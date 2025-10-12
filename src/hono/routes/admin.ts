import { Hono } from "hono";
import type { Context } from "hono";

export const admin = new Hono<{
  Bindings: { DB: D1Database; BUCKET: R2Bucket };
}>();

// simple admin auth guard: expects Authorization: Bearer <token>
async function requireAdmin(
  c: Context<{ Bindings: { DB: D1Database; BUCKET: R2Bucket } }>,
) {
  try {
    const auth = c.req.header("Authorization") || "";
    if (!auth.startsWith("Bearer ")) {
      return c.text("Unauthorized", 401);
    }
    const token = auth.slice(7);
    // compare with environment binding ADMIN_TOKEN (from worker vars)
    const envVars = c.env as unknown as Record<string, string | undefined>;
    const expected =
      envVars && envVars.ADMIN_TOKEN ? envVars.ADMIN_TOKEN : null;
    if (!expected || token !== expected) {
      return c.text("Unauthorized", 401);
    }
    return null;
  } catch (err: unknown) {
    console.error("auth check error", String(err));
    return c.text("Unauthorized", 401);
  }
}
// list all registrations
admin.get(
  "/bakal_calon",
  async (c: Context<{ Bindings: { DB: D1Database } }>) => {
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
  },
);

// verify token endpoint - frontend can call this to validate a token against server env
admin.get("/verify", async (c: Context) => {
  const unauth = await requireAdmin(c as any);
  if (unauth) return unauth;
  return c.json({ success: true });
});

// toggle verification by nim
admin.post(
  "/bakal_calon/:nim/verify",
  async (c: Context<{ Bindings: { DB: D1Database } }>) => {
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

// delete a kandidat and associated R2 objects
admin.delete(
  "/bakal_calon/:nim",
  async (c: Context<{ Bindings: { DB: D1Database; BUCKET: R2Bucket } }>) => {
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
admin.get("/file", async (c: Context<{ Bindings: { BUCKET: R2Bucket } }>) => {
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
