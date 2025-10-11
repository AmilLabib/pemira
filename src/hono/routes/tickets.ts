import { Hono } from "hono";

const tickets = new Hono<{
  Bindings: { DB: D1Database; BUCKET: R2Bucket };
}>();

type TicketBody = {
  president_id?: number;
  vice_id?: number;
  name?: string;
  vision: string;
  mission: string;
  programme: string;
  video_url?: string | null;
  photo_url?: string | null;
};

// Create a ticket (admin)
// Accepts existing candidate IDs for president & vice, or you can extend to accept person fields
tickets.post("/tickets", async (c) => {
  try {
    const body = (await c.req.json()) as TicketBody;
    if (!body.president_id || !body.vice_id) {
      return c.json({ error: "president_id and vice_id are required" }, 400);
    }
    const db = c.env.DB;
    // Ensure both candidates exist
    const pres = await db
      .prepare("SELECT id FROM candidates WHERE id = ?")
      .bind(body.president_id)
      .first();
    const vice = await db
      .prepare("SELECT id FROM candidates WHERE id = ?")
      .bind(body.vice_id)
      .first();
    if (!pres || !vice)
      return c.json({ error: "president or vice candidate not found" }, 404);

    // Insert ticket
    const res = await db
      .prepare(
        "INSERT INTO tickets (president_id, vice_id, name, vision, mission, programme, video_url, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(
        body.president_id,
        body.vice_id,
        body.name || null,
        body.vision,
        body.mission,
        body.programme,
        body.video_url || null,
        body.photo_url || null,
      )
      .run();

    return c.json({ success: true, id: (res as any).lastRowId }, 201);
  } catch (err: any) {
    return c.json({ error: err?.message || "Internal error" }, 500);
  }
});

// Public: list verified tickets
tickets.get("/tickets", async (c) => {
  try {
    const db = c.env.DB;
    const rows = await db
      .prepare(
        `SELECT t.id, t.name, t.vision, t.mission, t.programme, t.video_url, t.photo_url, t.is_verified,
                p.id as president_id, p.name as president_name, p.nim as president_nim, p.photo_url as president_photo,
                v.id as vice_id, v.name as vice_name, v.nim as vice_nim, v.photo_url as vice_photo
         FROM tickets t
         JOIN candidates p ON p.id = t.president_id
         JOIN candidates v ON v.id = t.vice_id
         WHERE t.is_verified = 1
         ORDER BY t.id ASC`,
      )
      .all();
    return c.json({ tickets: rows.results || [] });
  } catch (err: any) {
    return c.json({ error: err?.message || "Internal error" }, 500);
  }
});

// Admin: list all tickets
tickets.get("/tickets/all", async (c) => {
  try {
    const db = c.env.DB;
    const rows = await db
      .prepare(
        `SELECT t.id, t.name, t.vision, t.mission, t.programme, t.video_url, t.photo_url, t.is_verified,
                p.id as president_id, p.name as president_name, p.nim as president_nim, p.photo_url as president_photo,
                v.id as vice_id, v.name as vice_name, v.nim as vice_nim, v.photo_url as vice_photo
         FROM tickets t
         JOIN candidates p ON p.id = t.president_id
         JOIN candidates v ON v.id = t.vice_id
         ORDER BY t.id ASC`,
      )
      .all();
    return c.json({ tickets: rows.results || [] });
  } catch (err: any) {
    return c.json({ error: err?.message || "Internal error" }, 500);
  }
});

// Admin: verify/unverify
tickets.post("/tickets/:id/verify", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (!id) return c.json({ error: "invalid id" }, 400);
    const db = c.env.DB;
    const existing = await db
      .prepare("SELECT id FROM tickets WHERE id = ?")
      .bind(id)
      .first();
    if (!existing) return c.json({ error: "ticket not found" }, 404);
    await db
      .prepare("UPDATE tickets SET is_verified = 1 WHERE id = ?")
      .bind(id)
      .run();
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err?.message || "Internal error" }, 500);
  }
});

tickets.post("/tickets/:id/unverify", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (!id) return c.json({ error: "invalid id" }, 400);
    const db = c.env.DB;
    const existing = await db
      .prepare("SELECT id FROM tickets WHERE id = ?")
      .bind(id)
      .first();
    if (!existing) return c.json({ error: "ticket not found" }, 404);
    await db
      .prepare("UPDATE tickets SET is_verified = 0 WHERE id = ?")
      .bind(id)
      .run();
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err?.message || "Internal error" }, 500);
  }
});

export default tickets;
