import { Hono } from "hono";
import registrations from "./routes/registrations";
import admin from "./routes/admin";

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
  ADMIN_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Healthcheck
app.get("/", (c) => c.text("OK"));

// mount registrations under /api/registrations and admin under /api/admin
app.route("/api/registrations", registrations as any);
app.route("/api/admin", admin as any);

export default app;
