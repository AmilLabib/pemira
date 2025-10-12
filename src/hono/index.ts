import { Hono } from "hono";
import registrations from "./routes/registrations";
import admin from "./routes/admin";

const app = new Hono<{ Bindings: { DB: D1Database; BUCKET: R2Bucket } }>();

// Healthcheck
app.get("/", (c) => c.text("OK"));

// mount registrations under /api/registrations and admin under /api/admin
app.route("/api/registrations", registrations as any);
app.route("/api/admin", admin as any);

export default app;
