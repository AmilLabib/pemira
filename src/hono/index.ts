import { Hono } from "hono";
import login from "./routes/login";
import ballot from "./routes/ballot";
import r2 from "./routes/r2";
import candidates from "./routes/candidates";
import tickets from "./routes/tickets";

const app = new Hono<{ Bindings: { DB: D1Database; BUCKET: R2Bucket } }>();

app.route("/api", login);
app.route("/api", ballot);
app.route("/api", r2);
app.route("/api", candidates);
app.route("/api", tickets);

export default app;
