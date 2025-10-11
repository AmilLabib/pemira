export async function uploadFileToR2(bucket: R2Bucket, file: File) {
  const key = `${Date.now()}-${file.name}`;
  const arrayBuffer = await file.arrayBuffer();
  await bucket.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });

  return {
    key,
    url: `/api/r2/download/${encodeURIComponent(key)}`,
  };
}

export async function getObjectFromR2(bucket: R2Bucket, key: string) {
  const obj = await bucket.get(key);
  if (!obj) return null;
  const body = await obj.arrayBuffer();
  const contentType =
    obj.httpMetadata?.contentType || "application/octet-stream";
  return { body, contentType };
}

export async function listR2Objects(bucket: R2Bucket) {
  const list = await bucket.list();
  return list;
}

export async function deleteR2Object(bucket: R2Bucket, key: string) {
  await bucket.delete(key);
}
