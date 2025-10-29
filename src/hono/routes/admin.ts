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

// update kandidat data (partial update)
admin.put("/bakal_calon/:nim", async (c: Context<{ Bindings: Bindings }>) => {
  const unauth = await requireAdmin(c as any);
  if (unauth) return unauth;
  try {
    const nim = c.req.param("nim");

    // ensure the row exists
    const existing = await c.env.DB.prepare(
      "SELECT * FROM bakal_calon WHERE nim = ?",
    )
      .bind(nim)
      .first();
    if (!existing) return c.json({ success: false, error: "Not found" }, 404);

    const body = await c.req.json().catch(() => ({}));

    // allowed updatable fields
    const allowed = [
      "posisi",
      "nama",
      "kelas",
      "jurusan",
      "dapil",
      "visi",
      "misi",
      "program_kerja",
      "ktm",
      "surat_pernyataan",
      "cv",
      "formulir_pernyataan_dukungan",
      "formulir_pendaftaran_tim_sukses",
      "link_video",
      "foto",
      "ticket_number",
    ];

    const sets: string[] = [];
    const binds: any[] = [];

    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        sets.push(`${key} = ?`);
        binds.push((body as any)[key]);
      }
    }

    if (sets.length === 0) {
      return c.json({ success: false, error: "no fields to update" }, 400);
    }

    const sql = `UPDATE bakal_calon SET ${sets.join(", ")} WHERE nim = ?`;
    binds.push(nim);

    await c.env.DB.prepare(sql)
      .bind(...binds)
      .run();

    const updated = await c.env.DB.prepare(
      "SELECT * FROM bakal_calon WHERE nim = ?",
    )
      .bind(nim)
      .first();

    return c.json({ success: true, result: updated || null });
  } catch (err: unknown) {
    console.error("update candidate error", String(err));
    return c.json({ success: false, error: String(err) }, { status: 500 });
  }
});

// upload files for existing candidate
admin.post(
  "/bakal_calon/:nim/upload",
  async (c: Context<{ Bindings: Bindings }>) => {
    const unauth = await requireAdmin(c as any);
    if (unauth) return unauth;
    try {
      const nim = c.req.param("nim");

      // fetch existing row
      const existing = await c.env.DB.prepare(
        "SELECT * FROM bakal_calon WHERE nim = ?",
      )
        .bind(nim)
        .first();
      if (!existing) return c.json({ success: false, error: "Not found" }, 404);

      const form = await c.req.formData();

      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

      const sanitize = (s: string) =>
        s
          .replace(/[/\\?%*:|"<>]+/g, "_")
          .replace(/\s+/g, "_")
          .replace(/_+/g, "_")
          .replace(/^_+|_+$/g, "");

      const now = new Date().toISOString().replace(/[:.]/g, "-");
      const cleanPosisi = sanitize(String(existing.posisi || "unknown"));
      const cleanNama = sanitize(String(existing.nama || "unknown"));
      const cleanNim = sanitize(String(existing.nim || "unknown"));

      const fileFields = [
        "foto",
        "ktm",
        "surat_pernyataan",
        "cv",
        "formulir_pernyataan_dukungan",
        "formulir_pendaftaran_tim_sukses",
      ];

      const updates: Record<string, string | null> = {};

      for (const field of fileFields) {
        const entry = form.get(field) as File | null;
        if (!entry) continue;
        if (entry.size > MAX_FILE_SIZE) {
          return c.json(
            { success: false, error: `${field} terlalu besar` },
            400,
          );
        }

        const extMatch = entry.name.match(/(\.[^\.]+)$/);
        const ext = extMatch ? extMatch[1] : "";
        const key = `registrations/${cleanPosisi}/${field}/${now}_${cleanNim}_${cleanNama}${ext}`;
        const ab = await entry.arrayBuffer();

        // upload new object
        await c.env.BUCKET.put(key, ab, {
          httpMetadata: {
            contentType: entry.type || "application/octet-stream",
          },
        });

        // attempt to delete old object if present
        try {
          const old = (existing as any)[field];
          if (old) await c.env.BUCKET.delete(old);
        } catch (err: unknown) {
          console.error("failed to delete old r2 object", field, String(err));
        }

        updates[field] = key;
      }

      if (Object.keys(updates).length === 0) {
        return c.json({ success: false, error: "no files uploaded" }, 400);
      }

      // build update SQL
      const sets: string[] = [];
      const binds: any[] = [];
      for (const k of Object.keys(updates)) {
        sets.push(`${k} = ?`);
        binds.push(updates[k]);
      }
      binds.push(nim);

      const sql = `UPDATE bakal_calon SET ${sets.join(", ")} WHERE nim = ?`;
      await c.env.DB.prepare(sql)
        .bind(...binds)
        .run();

      const updated = await c.env.DB.prepare(
        "SELECT * FROM bakal_calon WHERE nim = ?",
      )
        .bind(nim)
        .first();

      return c.json({ success: true, result: updated || null });
    } catch (err: unknown) {
      console.error("upload files error", String(err));
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
