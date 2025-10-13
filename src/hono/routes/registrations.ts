import { Hono } from "hono";
import type { Context } from "hono";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const registrations = new Hono<{
  Bindings: { DB: D1Database; BUCKET: R2Bucket };
}>();

registrations.post(
  "/",
  async (c: Context<{ Bindings: { DB: D1Database; BUCKET: R2Bucket } }>) => {
    try {
      const form = await c.req.formData();

      const getText = (name: string) => {
        const v = form.get(name);
        return v === null ? "" : String(v);
      };

      const posisi = getText("posisi");
      const nama = getText("nama");
      const nim = getText("nim");
      const kelas = getText("kelas");
      const jurusan = getText("jurusan");
      const dapil = getText("dapil");
      const visi = getText("visi");
      const misi = getText("misi");
      const program_kerja = getText("program_kerja");
      const link_video = getText("link_video");

      // helper to upload a file to R2 and return the object key (or empty string)
      async function uploadFile(fieldName: string) {
        const entry = form.get(fieldName) as File | null;
        if (!entry) return "";
        // server-side size validation
        if (entry.size > MAX_FILE_SIZE) {
          throw {
            status: 400,
            message: `${fieldName} terlalu besar (maks ${MAX_FILE_SIZE} bytes)`,
          };
        }

        // sanitize helper for path segments (remove slashes and unsafe chars)
        const sanitize = (s: string) =>
          s
            .replace(/[/\\?%*:|"<>]+/g, "_") // remove path/control chars
            .replace(/\s+/g, "_")
            .replace(/_+/g, "_")
            .replace(/^_+|_+$/g, "");

        const now = new Date().toISOString().replace(/[:.]/g, "-");
        const cleanPosisi = sanitize(posisi || "unknown");
        const cleanNama = sanitize(nama || "unknown");
        const cleanNim = sanitize(nim || "unknown");

        // preserve extension when possible
        const extMatch = entry.name.match(/(\.[^\.]+)$/);
        const ext = extMatch ? extMatch[1] : "";

        const key = `registrations/${cleanPosisi}/${fieldName}/${now}_${cleanNim}_${cleanNama}${ext}`;
        const ab = await entry.arrayBuffer();
        await c.env.BUCKET.put(key, ab, {
          httpMetadata: {
            contentType: entry.type || "application/octet-stream",
          },
        });
        return key;
      }

      const ktmKey = await uploadFile("ktm");
      const suratKey = await uploadFile("surat_pernyataan");
      const cvKey = await uploadFile("cv");
      const dukunganKey = await uploadFile("formulir_pernyataan_dukungan");
      const timKey = await uploadFile("formulir_pendaftaran_tim_sukses");
      const fotoKey = await uploadFile("foto");

      // Prevent duplicate NIM: check if a row with same nim already exists
      try {
        const existing = await c.env.DB.prepare(
          "SELECT nim FROM bakal_calon WHERE nim = ? LIMIT 1",
        )
          .bind(nim)
          .first();
        if (existing && existing.nim) {
          return new Response(
            JSON.stringify({ success: false, error: "NIM already registered" }),
            { status: 409, headers: { "content-type": "application/json" } },
          );
        }
      } catch (err: unknown) {
        console.error("dup check error", String(err));
        // continue to the main error handler by throwing
        throw err;
      }

      // Insert into D1 (is_verified defaults to 0)
      const sql = `INSERT INTO bakal_calon (
      posisi, nama, nim, kelas, jurusan, dapil, visi, misi, program_kerja,
      ktm, surat_pernyataan, cv, formulir_pernyataan_dukungan,
      formulir_pendaftaran_tim_sukses, link_video, foto, is_verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const stmt = c.env.DB.prepare(sql);
      const res = await stmt
        .bind(
          posisi,
          nama,
          nim,
          kelas,
          jurusan,
          dapil,
          visi,
          misi,
          program_kerja,
          ktmKey,
          suratKey,
          cvKey,
          dukunganKey,
          timKey,
          link_video,
          fotoKey,
          0,
        )
        .run();

      return c.json({ success: true, result: res }, 200);
    } catch (err: unknown) {
      console.error("/api/registrations error:", String(err));
      const e = err as { status?: number; message?: string } | undefined;
      if (e && e.status) {
        return new Response(
          JSON.stringify({ success: false, error: e.message || "Bad Request" }),
          {
            status: e.status,
            headers: { "content-type": "application/json" },
          },
        );
      }
      return new Response(
        JSON.stringify({ success: false, error: String(err) }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        },
      );
    }
  },
);

export default registrations;

// Public listing of verified candidates with assigned ticket numbers
// Mounted under /api/daftar/bakal_calon
registrations.get(
  "/bakal_calon",
  async (c: Context<{ Bindings: { DB: D1Database; BUCKET: R2Bucket } }>) => {
    try {
      const res = await c.env.DB.prepare(
        "SELECT * FROM bakal_calon WHERE is_verified = 1 AND ticket_number IS NOT NULL ORDER BY ticket_number, nama",
      ).all();
      return c.json({ success: true, result: res.results || [] });
    } catch (err: unknown) {
      console.error("/api/daftar/bakal_calon error:", String(err));
      return new Response(
        JSON.stringify({ success: false, error: String(err) }),
        { status: 500, headers: { "content-type": "application/json" } },
      );
    }
  },
);

// Public file proxy for R2 objects for daftar routes
// Example: GET /api/daftar/file?key=registrations/1234_image.png
registrations.get(
  "/file",
  async (c: Context<{ Bindings: { DB: D1Database; BUCKET: R2Bucket } }>) => {
    try {
      const key = c.req.query("key") as string | null;
      if (!key) return c.text("missing key", 400);
      const obj = await c.env.BUCKET.get(key);
      if (!obj) return c.text("not found", 404);

      // stream the object back with original content-type and caching
      const headers: Record<string, string> = {};
      if (obj.httpMetadata && obj.httpMetadata.contentType)
        headers["content-type"] = obj.httpMetadata.contentType;
      // allow browsers to cache images for a short period; adjust as needed
      headers["cache-control"] = "public, max-age=3600";

      const body = await obj.arrayBuffer();
      return c.body(body, 200, headers);
    } catch (err: unknown) {
      console.error("/api/daftar/file error", String(err));
      return new Response(
        JSON.stringify({ success: false, error: String(err) }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        },
      );
    }
  },
);
