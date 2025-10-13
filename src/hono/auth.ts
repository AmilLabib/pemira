import type { Context } from "hono";

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
  ADMIN_TOKEN: string;
};

// simple admin auth guard: expects Authorization: Bearer <token>
export async function requireAdmin(c: Context<{ Bindings: Bindings }>) {
  try {
    const auth = c.req.header("Authorization") || "";
    if (!auth.startsWith("Bearer ")) {
      return c.text("Unauthorized", 401);
    }
    const token = auth.slice(7);
    // compare with environment binding ADMIN_TOKEN (from worker vars)
    const expected = c.env.ADMIN_TOKEN;
    if (token !== expected) {
      return c.text("Unauthorized", 401);
    }
    return null;
  } catch (err: unknown) {
    console.error("auth check error", String(err));
    return c.text("Unauthorized", 401);
  }
}

export default requireAdmin;
