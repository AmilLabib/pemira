import { Hono } from "hono";
import registrations from "./routes/registrations";
import admin from "./routes/admin";
import vote from "./routes/vote";

const app = new Hono();

// Simple CORS middleware -> allow the frontend on Hostinger to call the worker
app.use("*", async (c, next) => {
  const origin = c.req.header("origin") || "";
  const allowed = ["https://pemirapknstan2025.com", "http://localhost:3000"];
  if (allowed.includes(origin)) {
    c.header("Access-Control-Allow-Origin", origin);
    // allow cookies to be sent from the frontend when using cross-subdomain requests
    c.header("Access-Control-Allow-Credentials", "true");
  } else {
    c.header("Access-Control-Allow-Origin", "");
  }
  c.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  // allow Content-Type + Authorization and typical X-Requested-With
  c.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  if (c.req.method === "OPTIONS") {
    // respond to preflight with the same CORS headers
    const headers: Record<string, string> = {
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With",
    };
    if (allowed.includes(origin)) {
      headers["Access-Control-Allow-Origin"] = origin;
      headers["Access-Control-Allow-Credentials"] = "true";
    }
    return new Response(null, { status: 204, headers });
  }
  await next();
});

// Healthcheck
app.get("/", (c) => c.text("OK"));

// mount registrations under /api/daftar and admin under /api/admin
app.route("/api/daftar", registrations as any);
app.route("/api/admin", admin as any);
// mount public vote routes
app.route("/api/vote", vote as any);

export default app;
