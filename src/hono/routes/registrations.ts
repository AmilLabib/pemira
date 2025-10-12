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
        const key = `registrations/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${entry.name}`;
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

      // Insert into D1 (is_verified defaults to 0)
      const sql = `INSERT INTO bakal_calon (
      posisi, nama, nim, kelas, jurusan, dapil, visi, misi, program_kerja,
      ktm, surat_pernyataan, cv, formulir_pernyataan_dukungan,
      formulir_pendaftaran_tim_sukses, link_video, foto, is_verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const stmt = await c.env.DB.prepare(sql);
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
