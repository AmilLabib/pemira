import { Hono } from "hono";

const app = new Hono<{ Bindings: { DB: D1Database; BUCKET: R2Bucket } }>();

export default app;
