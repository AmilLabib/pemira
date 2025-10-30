import { Hono } from "hono";
import type { Context } from "hono";

export const vote = new Hono<{ Bindings: { DB: D1Database } }>();

// POST /login - public voter login using nim + token
vote.post("/login", async (c: Context<{ Bindings: { DB: D1Database } }>) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const nim = (body.nim || "").toString().trim();
    const token = (body.token || "").toString().trim();

    if (!nim || !token) {
      return c.json({ success: false, error: "missing nim or token" }, 400);
    }

    const row = await c.env.DB.prepare(
      "SELECT nim, name, jurusan, kelas, angkatan, status, token FROM voters WHERE lower(nim) = lower(?) LIMIT 1",
    )
      .bind(nim)
      .first();

    if (!row)
      return c.json({ success: false, error: "invalid credentials" }, 401);

    const storedToken = String((row as any).token || "").trim();
    if (storedToken !== token) {
      return c.json({ success: false, error: "invalid credentials" }, 401);
    }

    // successful login - return minimal voter info
    const voter = {
      nim: (row as any).nim,
      name: (row as any).name,
      jurusan: (row as any).jurusan,
      kelas: (row as any).kelas,
      angkatan: (row as any).angkatan,
      status: (row as any).status,
    };

    return c.json({ success: true, voter });
  } catch (err: unknown) {
    console.error("vote login error", String(err));
    return c.json({ success: false, error: String(err) }, { status: 500 });
  }
});

export default vote;
