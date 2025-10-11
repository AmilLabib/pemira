import { Hono } from "hono";

const login = new Hono<{ Bindings: { DB: D1Database } }>();

login.post("/login", async (c) => {
  const { nim, token } = await c.req.json();
  const db = c.env.DB;
  const user = await db
    .prepare("SELECT nim FROM voter WHERE nim = ? AND token = ?")
    .bind(nim, token)
    .first();
  if (user) {
    const sessionToken = crypto.randomUUID();
    await db
      .prepare("INSERT INTO sessions (token) VALUES (?)")
      .bind(sessionToken)
      .run();
    c.header("Set-Cookie", `session=${sessionToken}; HttpOnly; Secure; Path=/`);
    return c.json({ success: true });
  }
  return c.json({ success: false }, 401);
});

export default login;
