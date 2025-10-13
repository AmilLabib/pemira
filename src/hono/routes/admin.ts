import { Hono } from "hono";
import type { Context } from "hono";
import { requireAdmin, createSessionCookie } from "../auth";

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
};

export const admin = new Hono<{
  Bindings: Bindings;
}>();
// list all registrations
admin.get("/bakal_calon", async (c: Context<{ Bindings: Bindings }>) => {
  const unauth = await requireAdmin(c as any);
  if (unauth) return unauth;
  try {
    const res = await c.env.DB.prepare(
      "SELECT * FROM bakal_calon ORDER BY nama",
    ).all();
    return c.json({ success: true, result: res.results || [] });
  } catch (err: unknown) {
    console.error("admin list error", String(err));
    return c.json({ success: false, error: String(err) }, { status: 500 });
  }
});

// verify token endpoint - frontend can call this to validate a token against server env
admin.get("/verify", async (c: Context<{ Bindings: Bindings }>) => {
  const unauth = await requireAdmin(c as any);
  if (unauth) return unauth;
  return c.json({ success: true });
});

// login endpoint: accept JSON { username, password }
admin.post("/login", async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const body = await c.req.json().catch(() => ({}) as any);
    const username = typeof body.username === "string" ? body.username : "";
    const password = typeof body.password === "string" ? body.password : "";

    // prefer explicit ADMIN_USERNAME/PASSWORD env bindings; fallback: single shared secret
    const env = c.env as unknown as Bindings;
    const expectedUser = env.ADMIN_USERNAME || "admin";
    const expectedPass = env.ADMIN_PASSWORD || "";

    if (username !== expectedUser || password !== expectedPass) {
      return c.json({ success: false, error: "invalid credentials" }, 401);
    }

    const cookie = await createSessionCookie(env, username);
    return c.json({ success: true }, { headers: { "Set-Cookie": cookie } });
  } catch (err: unknown) {
    console.error("login error", String(err));
    return c.json({ success: false, error: String(err) }, { status: 500 });
  }
});

// logout: clear cookie
admin.post("/logout", async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const cookie = `admin_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
    return c.json({ success: true }, { headers: { "Set-Cookie": cookie } });
  } catch (err: unknown) {
    console.error("logout error", String(err));
    return c.json({ success: false, error: String(err) }, { status: 500 });
  }
});

// toggle verification by nim
admin.post(
  "/bakal_calon/:nim/verify",
  async (c: Context<{ Bindings: Bindings }>) => {
    const unauth = await requireAdmin(c as any);
    if (unauth) return unauth;
    try {
      const nim = c.req.param("nim");
      // fetch current
      const row = await c.env.DB.prepare(
        "SELECT is_verified FROM bakal_calon WHERE nim = ?",
      )
        .bind(nim)
        .first();
      if (!row) return c.json({ success: false, error: "Not found" }, 404);
      const newVal = row.is_verified ? 0 : 1;
      await c.env.DB.prepare(
        "UPDATE bakal_calon SET is_verified = ? WHERE nim = ?",
      )
        .bind(newVal, nim)
        .run();
      return c.json({ success: true, nim, is_verified: newVal });
    } catch (err: unknown) {
      console.error("verify error", String(err));
      return c.json({ success: false, error: String(err) }, { status: 500 });
    }
  },
);

// assign a ticket number to a candidate (or clear it)
admin.post(
  "/bakal_calon/:nim/assign_number",
  async (c: Context<{ Bindings: Bindings }>) => {
    const unauth = await requireAdmin(c as any);
    if (unauth) return unauth;
    try {
      const nim = c.req.param("nim");
      const body = await c.req.json().catch(() => ({}));
      const num = typeof body.number === "number" ? body.number : null;

      // fetch row to ensure exists and get posisi
      const row = await c.env.DB.prepare(
        "SELECT posisi FROM bakal_calon WHERE nim = ?",
      )
        .bind(nim)
        .first();
      if (!row) return c.json({ success: false, error: "Not found" }, 404);

      // if candidate is presma or wapresma and num is set, also assign the same number
      // to the counterpart (pair) so presma/wapresma share one ticket.
      const r = row as any;
      const posisi: string = r.posisi;

      // update this candidate
      await c.env.DB.prepare(
        "UPDATE bakal_calon SET ticket_number = ? WHERE nim = ?",
      )
        .bind(num, nim)
        .run();

      if ((posisi === "presma" || posisi === "wapresma") && num !== null) {
        // find the other candidate in the pair (same formulir_pendaftaran_tim_sukses) if possible
        // fallback: assign the same number to any candidate with posisi opposite and same nama pattern
        // Simpler approach: assign to the other row with same formulir_pendaftaran_tim_sukses key
        const pairRow = await c.env.DB.prepare(
          "SELECT nim FROM bakal_calon WHERE posisi != ? AND formulir_pendaftaran_tim_sukses = (SELECT formulir_pendaftaran_tim_sukses FROM bakal_calon WHERE nim = ?) LIMIT 1",
        )
          .bind(posisi, nim)
          .first();
        if (pairRow && pairRow.nim) {
          await c.env.DB.prepare(
            "UPDATE bakal_calon SET ticket_number = ? WHERE nim = ?",
          )
            .bind(num, pairRow.nim)
            .run();
        }
      }

      return c.json({ success: true, nim, number: num });
    } catch (err: unknown) {
      console.error("assign number error", String(err));
      return c.json({ success: false, error: String(err) }, { status: 500 });
    }
  },
);

// delete a kandidat and associated R2 objects
admin.delete(
  "/bakal_calon/:nim",
  async (c: Context<{ Bindings: Bindings }>) => {
    const unauth = await requireAdmin(c as any);
    if (unauth) return unauth;
    try {
      const nim = c.req.param("nim");
      // fetch full row
      const row = await c.env.DB.prepare(
        "SELECT * FROM bakal_calon WHERE nim = ?",
      )
        .bind(nim)
        .first();
      if (!row) return c.json({ success: false, error: "Not found" }, 404);

      // keys stored in the row that may point to R2 objects
      const keys = [
        row.ktm,
        row.surat_pernyataan,
        row.cv,
        row.formulir_pernyataan_dukungan,
        row.formulir_pendaftaran_tim_sukses,
        row.foto,
      ].filter(Boolean) as string[];

      // attempt to delete each object from R2; non-fatal if delete fails
      for (const k of keys) {
        try {
          await c.env.BUCKET.delete(k);
        } catch (err: unknown) {
          console.error("failed to delete r2 object", k, String(err));
        }
      }

      // delete the row from D1
      await c.env.DB.prepare("DELETE FROM bakal_calon WHERE nim = ?")
        .bind(nim)
        .run();

      return c.json({ success: true, nim });
    } catch (err: unknown) {
      console.error("delete error", String(err));
      return c.json({ success: false, error: String(err) }, { status: 500 });
    }
  },
);

// serve a file from R2 (proxy)
admin.get("/file", async (c: Context<{ Bindings: Bindings }>) => {
  const unauth = await requireAdmin(c as any);
  if (unauth) return unauth;
  try {
    const key = c.req.query("key") as string | null;
    if (!key) return c.text("missing key", 400);
    const obj = await c.env.BUCKET.get(key);
    if (!obj) return c.text("not found", 404);
    const body = await obj.arrayBuffer();
    const headers: Record<string, string> = {};
    if (obj.httpMetadata && obj.httpMetadata.contentType)
      headers["content-type"] = obj.httpMetadata.contentType;
    return c.body(body, 200, headers);
  } catch (err: unknown) {
    console.error("file proxy error", String(err));
    return c.json({ success: false, error: String(err) }, { status: 500 });
  }
});

export default admin;
