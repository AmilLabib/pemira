import { Hono } from "hono";
import {
  uploadFileToR2,
  getObjectFromR2,
  listR2Objects,
  deleteR2Object,
} from "../utils/r2";

const r2 = new Hono<{ Bindings: { BUCKET: R2Bucket } }>();

r2.post("/r2/upload", async (c) => {
  const form = await c.req.formData();
  const file = form.get("file") as File | null;
  if (!file) return c.json({ error: "No file provided" }, 400);

  const result = await uploadFileToR2(c.env.BUCKET, file);

  return c.json({ success: true, ...result });
});

r2.get("/r2/download/:key", async (c) => {
  const key = c.req.param("key");
  const obj = await getObjectFromR2(c.env.BUCKET, key);
  if (!obj) return c.json({ error: "Not found" }, 404);

  return new Response(obj.body, {
    status: 200,
    headers: { "Content-Type": obj.contentType },
  });
});

r2.get("/r2/list", async (c) => {
  const list = await listR2Objects(c.env.BUCKET);
  return c.json({ objects: list.objects });
});

r2.delete("/r2/delete/:key", async (c) => {
  const key = c.req.param("key");
  await deleteR2Object(c.env.BUCKET, key);
  return c.json({ success: true });
});

export default r2;
