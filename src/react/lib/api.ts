export const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function apiFetch(path: string, opts?: RequestInit) {
  const base = API_BASE.replace(/\/+$/, "");
  const url = base ? `${base}${path.startsWith("/") ? "" : "/"}${path}` : path;
  return fetch(url, opts);
}
