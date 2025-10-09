import { Hono } from "hono";

const app = new Hono<{ Bindings: { DB: D1Database } }>();

app.post("/api/login", async (c) => {
  const { nim, token } = await c.req.json();
  const db = c.env.DB;
  const user = await db
    .prepare("SELECT nim FROM voter WHERE nim = ? AND token = ?")
    .bind(nim, token)
    .first();
  if (user) {
    const sessionToken = crypto.randomUUID();
    await db
      .prepare("INSERT INTO sessions (token, nim) VALUES (?, ?)")
      .bind(sessionToken, nim)
      .run();
    c.header("Set-Cookie", `session=${sessionToken}; HttpOnly; Secure; Path=/`);
    return c.json({ success: true });
  }
  return c.json({ success: false }, 401);
});

app.get("/api/ballot", async (c) => {
  const cookie = c.req.header("Cookie");
  const sessionToken = cookie?.match(/session=([^;]+)/)?.[1];
  if (!sessionToken) return c.json({ error: "Unauthorized" }, 401);

  const db = c.env.DB;
  const session = await db
    .prepare("SELECT nim FROM sessions WHERE token = ?")
    .bind(sessionToken)
    .first();
  if (session) {
    return c.json({ message: "Access granted to ballot!" });
  }
  return c.json({ error: "Unauthorized" }, 401);
});

export default app;
