import { Hono } from "hono";

const ballot = new Hono<{ Bindings: { DB: D1Database } }>();

ballot.get("/ballot", async (c) => {
  const cookie = c.req.header("Cookie");
  const sessionToken = cookie?.match(/session=([^;]+)/)?.[1];
  if (!sessionToken) return c.json({ error: "Unauthorized" }, 401);

  const db = c.env.DB;
  const session = await db
    .prepare("SELECT * FROM sessions WHERE token = ?")
    .bind(sessionToken)
    .first();
  if (session) {
    return c.json({ message: "Access granted to ballot!" });
  }
  return c.json({ error: "Unauthorized" }, 401);
});

export default ballot;
