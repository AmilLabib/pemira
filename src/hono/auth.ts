import type { Context } from "hono";

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
  ADMIN_PASSWORD?: string; // used as signing secret
  ADMIN_USERNAME?: string;
};

// Helpers: create/verify a simple signed session cookie using HMAC-SHA256
async function importHmacKey(secret: string) {
  return await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function base64UrlEncode(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  // btoa works on binary string
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(s: string) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  // pad
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr.buffer;
}

export async function createSessionCookie(
  env: Bindings,
  username: string,
  maxAgeSeconds = 60 * 60 * 24,
) {
  const expiry = Math.floor(Date.now() / 1000) + maxAgeSeconds;
  const payload = `${username}:${expiry}`;
  // Use ADMIN_PASSWORD as signing secret
  const secret = (env.ADMIN_PASSWORD as string) || "";
  const key = await importHmacKey(secret);
  const sigBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  const cookieVal = `${btoa(username)}.${expiry}.${base64UrlEncode(sigBuf)}`;
  // HttpOnly cookie; do not set Secure to keep local dev easier. Path=/ and SameSite=Lax.
  const cookie = `admin_session=${cookieVal}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
  return cookie;
}

export async function verifySessionCookie(
  env: Bindings,
  cookieVal: string | null,
) {
  try {
    if (!cookieVal) return false;
    // expected format b64user.expiry.sig
    const parts = cookieVal.split(".");
    if (parts.length !== 3) return false;
    const username = atob(parts[0]);
    const expiry = parseInt(parts[1], 10);
    const sig = parts[2];
    if (Number.isNaN(expiry) || expiry < Math.floor(Date.now() / 1000))
      return false;
    const payload = `${username}:${expiry}`;
    const secret = (env.ADMIN_PASSWORD as string) || "";
    const key = await importHmacKey(secret);
    const sigBuf = base64UrlDecode(sig);
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBuf,
      new TextEncoder().encode(payload),
    );
    return Boolean(ok);
  } catch (err: unknown) {
    console.error("verify session cookie error", String(err));
    return false;
  }
}

// middleware-like helper: returns null when authorized, or a Response when unauthorized
export async function requireAdmin(c: Context<{ Bindings: Bindings }>) {
  try {
    const raw = c.req.header("cookie") || "";
    const match = raw
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith("admin_session="));
    const val = match ? match.slice("admin_session=".length) : null;
    const ok = await verifySessionCookie(
      c.env as unknown as Bindings,
      val as string | null,
    );
    if (!ok) return c.text("Unauthorized", 401);
    return null;
  } catch (err: unknown) {
    console.error("auth check error", String(err));
    return c.text("Unauthorized", 401);
  }
}

export default requireAdmin;
