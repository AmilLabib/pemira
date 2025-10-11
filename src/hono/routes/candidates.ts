import { Hono } from "hono";

const candidates = new Hono<{
  Bindings: { DB: D1Database; BUCKET: R2Bucket };
}>();

type CandidateBody = {
  role: string;
  name: string;
  nim: string;
  major: string;
  vision: string;
  mission: string;
  programme: string;
  video_url?: string | null;
  photo_url?: string | null;
};

candidates.post("/candidates", async (c) => {
  try {
    // Accept either JSON or multipart/form-data
    const contentType = c.req.header("content-type") || "";
    let body: CandidateBody;
    let photo_url: string | null = null;
    let video_url: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await c.req.formData();
      body = {
        role: form.get("role")?.toString() || "",
        name: form.get("name")?.toString() || "",
        nim: form.get("nim")?.toString() || "",
        major: form.get("major")?.toString() || "",
        vision: form.get("vision")?.toString() || "",
        mission: form.get("mission")?.toString() || "",
        programme: form.get("programme")?.toString() || "",
      } as CandidateBody;

      // Handle files: 'photo' and 'video'
      const photo = form.get("photo") as File | null;
      if (photo && (photo as any).arrayBuffer) {
        const key = `${Date.now()}-${photo.name}`;
        const ab = await (photo as any).arrayBuffer();
        await c.env.BUCKET.put(key, ab, {
          httpMetadata: { contentType: (photo as any).type || "image/*" },
        });
        photo_url = `/api/r2/download/${encodeURIComponent(key)}`;
      }

      const video = form.get("video") as File | null;
      if (video && (video as any).arrayBuffer) {
        const key = `${Date.now()}-${video.name}`;
        const ab = await (video as any).arrayBuffer();
        await c.env.BUCKET.put(key, ab, {
          httpMetadata: { contentType: (video as any).type || "video/*" },
        });
        video_url = `/api/r2/download/${encodeURIComponent(key)}`;
      }
    } else {
      body = (await c.req.json()) as CandidateBody;
      photo_url = body.photo_url || null;
      video_url = body.video_url || null;
    }

    // Require photo
    if (!photo_url) {
      return c.json({ error: "photo is required" }, 400);
    }

    // Basic validation
    const required = [
      "role",
      "name",
      "nim",
      "major",
      "vision",
      "mission",
      "programme",
    ];
    for (const key of required) {
      if (
        !body[key as keyof CandidateBody] ||
        String(body[key as keyof CandidateBody]).trim() === ""
      ) {
        return c.json({ error: `${key} is required` }, 400);
      }
    }

    const db = c.env.DB;

    // Check nim uniqueness
    const existing = await db
      .prepare("SELECT id FROM candidates WHERE nim = ?")
      .bind(body.nim)
      .first();
    if (existing) {
      return c.json({ error: "Candidate with this NIM already exists" }, 409);
    }

    // Insert candidate (include dapil and category if provided)
    const result = await db
      .prepare(
        "INSERT INTO candidates (role, name, nim, major, vision, mission, programme, video_url, photo_url, dapil, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(
        body.role,
        body.name,
        body.nim,
        body.major,
        body.vision,
        body.mission,
        body.programme,
        video_url,
        photo_url,
        // dapil and category may be undefined; use null/defaults
        (body as any).dapil ?? null,
        (body as any).category ?? null,
      )
      .run();

    // Attempt to return the new row id (lastRowId) when available
    // D1 run() result may include lastRowId
    const lastRowId = (result as any)?.lastRowId ?? null;
    return c.json({ success: true, id: lastRowId }, 201);
  } catch (err: any) {
    return c.json({ error: err?.message || "Internal error" }, 500);
  }
});

// GET list of candidates
candidates.get("/candidates", async (c) => {
  try {
    const db = c.env.DB;
    const rows = await db
      .prepare(
        // Only return verified candidates to the public
        "SELECT id, role, name, nim, major, vision, mission, programme, video_url, photo_url FROM candidates WHERE is_verified = 1 ORDER BY id ASC",
      )
      .all();
    // rows.results is an array
    return c.json({ candidates: rows.results || [] });
  } catch (err: any) {
    return c.json({ error: err?.message || "Internal error" }, 500);
  }
});

// Admin: list pending (unverified) candidates
candidates.get("/candidates/pending", async (c) => {
  try {
    const db = c.env.DB;
    const rows = await db
      .prepare(
        "SELECT id, role, name, nim, major, vision, mission, programme, video_url, photo_url FROM candidates WHERE is_verified = 0 ORDER BY id ASC",
      )
      .all();
    return c.json({ candidates: rows.results || [] });
  } catch (err: any) {
    return c.json({ error: err?.message || "Internal error" }, 500);
  }
});

// Admin: list ALL candidates (including is_verified)
candidates.get("/candidates/all", async (c) => {
  try {
    const db = c.env.DB;
    const rows = await db
      .prepare(
        "SELECT id, role, name, nim, major, vision, mission, programme, video_url, photo_url, is_verified FROM candidates ORDER BY id ASC",
      )
      .all();
    return c.json({ candidates: rows.results || [] });
  } catch (err: any) {
    return c.json({ error: err?.message || "Internal error" }, 500);
  }
});

// Admin: verify a candidate by id
candidates.post("/candidates/:id/verify", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (!id) return c.json({ error: "invalid id" }, 400);
    const db = c.env.DB;
    // Ensure candidate exists
    const existing = await db
      .prepare("SELECT id FROM candidates WHERE id = ?")
      .bind(id)
      .first();
    if (!existing) return c.json({ error: "candidate not found" }, 404);
    await db
      .prepare("UPDATE candidates SET is_verified = 1 WHERE id = ?")
      .bind(id)
      .run();
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err?.message || "Internal error" }, 500);
  }
});

// Admin: unverify a candidate by id
candidates.post("/candidates/:id/unverify", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (!id) return c.json({ error: "invalid id" }, 400);
    const db = c.env.DB;
    const existing = await db
      .prepare("SELECT id FROM candidates WHERE id = ?")
      .bind(id)
      .first();
    if (!existing) return c.json({ error: "candidate not found" }, 404);
    await db
      .prepare("UPDATE candidates SET is_verified = 0 WHERE id = ?")
      .bind(id)
      .run();
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err?.message || "Internal error" }, 500);
  }
});

export default candidates;
