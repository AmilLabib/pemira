import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { env } from "hono/adapter";

const app = new Hono();

app.use(
  "/dashboard",
  basicAuth({
    verifyUser: (username, password, c) => {
      const { USERNAME, PASSWORD } = env<{
        USERNAME: string;
        PASSWORD: string;
      }>(c);
      return username === USERNAME && password === PASSWORD;
    },
  })
);

app.get("/dashboard", (c) => c.text("Protected Dashboard"));

app.use(
  "/ballot",
  basicAuth({
    verifyUser: async (username, password) => {
      // const { DB } = env<{ DB: D1Database }>(c);
      // const result = await DB.prepare(
      //   "SELECT password FROM users WHERE username = ?"
      // )
      //   .bind(username)
      //   .first();
      // return !!result && result.password === password;
      return username === "voter" && password === "vote2024";
    },
  })
);

app.post("/ballot", (c) => c.text("Ballot access granted"));

export default app;
