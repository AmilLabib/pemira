import { Hono } from "hono";
import registrations from "./routes/registrations";
import admin from "./routes/admin";

const app = new Hono();

// Healthcheck
app.get("/", (c) => c.text("OK"));

// mount registrations under /api/daftar and admin under /api/admin
app.route("/api/daftar", registrations as any);
app.route("/api/admin", admin as any);

export default app;
