import { sampleVoters as sample } from "../../../data/voters";
import { useMemo, useState, useCallback, useEffect } from "react";
import type { FilterValues } from "./Filter";
import PopupUpload from "./PopupUpload";
import PopupReset from "./PopupReset";
import { API_BASE } from "../../../lib/api";

type Props = {
  filters?: FilterValues;
  onCountChange?: (count: number) => void;
  onVotedCountChange?: (count: number) => void;
};

export default function VotersList({
  filters,
  onCountChange,
  onVotedCountChange,
}: Props) {
  const [page, setPage] = useState(1);
  const [showUpload, setShowUpload] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [perPage, setPerPage] = useState<number>(() =>
    typeof window !== "undefined" && window.innerWidth < 640 ? 5 : 10,
  );

  useEffect(() => {
    function handleResize() {
      setPerPage(window.innerWidth < 640 ? 5 : 10);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [voters, setVoters] = useState<any[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("voters");
        if (raw) return JSON.parse(raw);
      }
    } catch (e) {
      // ignore parse errors
    }
    return typeof sample !== "undefined" ? [...sample] : [];
  });

  // fetch voters from server (fallback to localStorage if server unavailable)
  const fetchVotersFromServer = useCallback(async () => {
    try {
      const q = new URLSearchParams();
      // optionally include filters
      if (filters?.search) q.set("search", String(filters.search));
      if (filters?.jurusan) q.set("jurusan", String(filters.jurusan));
      if (filters?.class) q.set("class", String(filters.class));
      if (filters?.status) q.set("status", String(filters.status));
      const resp = await fetch(`${API_BASE}/api/admin/voters?${q.toString()}`, {
        credentials: "include",
      });
      if (!resp.ok) throw new Error(`status ${resp.status}`);
      const data = await resp.json();
      if (data && data.result) {
        setVoters(data.result);
        return true;
      }
    } catch (err) {
      // ignore and keep local state
    }
    return false;
  }, [filters]);

  useEffect(() => {
    // try to load from server on mount
    fetchVotersFromServer();
  }, [fetchVotersFromServer]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    onCountChange?.(voters.length);

    const voted = voters.reduce((acc, v) => {
      const status = String(v?.status ?? "").toLowerCase();
      if (status === "voted") return acc + 1;
      return acc;
    }, 0);

    onVotedCountChange?.(voted);
  }, [voters, onCountChange, onVotedCountChange]);

  const parseCSV = useCallback((text: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || typeof Blob === "undefined") {
        try {
          const rows: string[] = [];
          let cur = "";
          let inQuotes = false;
          for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (ch === '"') {
              if (inQuotes && text[i + 1] === '"') {
                cur += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
              continue;
            }
            if (ch === "\n" && !inQuotes) {
              rows.push(cur);
              cur = "";
              continue;
            }
            cur += ch;
          }
          if (cur) rows.push(cur);
          const parsed = rows.map((r) =>
            r
              .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
              .map((c) => c.replace(/^"|"$/g, "").trim()),
          );
          if (!parsed.length) return resolve([]);
          const headers = parsed[0].map((h) =>
            h.toLowerCase().replace(/\s+/g, "_"),
          );
          const data = parsed.slice(1).map((cols) => {
            const obj: any = {};
            headers.forEach((h, i) => (obj[h] = cols[i] ?? ""));
            return obj;
          });
          return resolve(data);
        } catch (err) {
          return reject(err);
        }
      }

      const workerCode = `
      self.onmessage = function(e) {
        try {
          const text = e.data;
          const rows = [];
          let cur = "";
          let inQuotes = false;
          for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (ch === '"') {
              if (inQuotes && text[i + 1] === '"') { cur += '"'; i++; } else { inQuotes = !inQuotes; }
              continue;
            }
            if (ch === "\n" && !inQuotes) { rows.push(cur); cur = ""; continue; }
            cur += ch;
          }
          if (cur) rows.push(cur);
          const parsed = rows.map(function(r) {
            return r.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(function(c){ return c.replace(/^\"|\"$/g, '').trim(); });
          });
          if (!parsed.length) { self.postMessage({ok:true, data: []}); return; }
          const headers = parsed[0].map(function(h){ return h.toLowerCase().replace(/\s+/g,'_'); });
          const data = parsed.slice(1).map(function(cols){ var obj={}; headers.forEach(function(h,i){ obj[h]=cols[i]||''; }); return obj; });
          self.postMessage({ok:true, data: data});
        } catch (err) { self.postMessage({ok:false, error: String(err)}); }
      }`;

      try {
        const blob = new Blob([workerCode], { type: "text/javascript" });
        const url = URL.createObjectURL(blob);
        const w = new Worker(url);
        const cleanup = () => {
          w.terminate();
          URL.revokeObjectURL(url);
        };
        w.onmessage = function (ev) {
          const d = ev.data;
          cleanup();
          if (d && d.ok) resolve(d.data || []);
          else
            reject(
              d && d.error ? new Error(d.error) : new Error("Parse error"),
            );
        };
        w.onerror = function (err) {
          cleanup();
          reject(err instanceof Error ? err : new Error(String(err)));
        };
        w.postMessage(text);
      } catch (err) {
        // fallback
        try {
          const rows: string[] = [];
          let cur = "";
          let inQuotes = false;
          for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (ch === '"') {
              if (inQuotes && text[i + 1] === '"') {
                cur += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
              continue;
            }
            if (ch === "\n" && !inQuotes) {
              rows.push(cur);
              cur = "";
              continue;
            }
            cur += ch;
          }
          if (cur) rows.push(cur);
          const parsed = rows.map((r) =>
            r
              .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
              .map((c) => c.replace(/^"|"$/g, "").trim()),
          );
          if (!parsed.length) return resolve([]);
          const headers = parsed[0].map((h) =>
            h.toLowerCase().replace(/\s+/g, "_"),
          );
          const data = parsed.slice(1).map((cols) => {
            const obj: any = {};
            headers.forEach((h, i) => (obj[h] = cols[i] ?? ""));
            return obj;
          });
          return resolve(data);
        } catch (err2) {
          return reject(err2);
        }
      }
    });
  }, []);

  const normalizeRow = useCallback((row: any, _idx: number) => {
    const get = (keys: string[]) => {
      for (const k of keys) {
        if (k in row && row[k] !== "") return row[k];
      }
      return "";
    };

    const fallbackId = String(
      get(["id", "id_number", "external_id", "externalid", "ID", "rowid"]) || get(["nim"]) || "",
    ).trim();

    return {
      // ensure we always have a stable id for display and React keys
      id: fallbackId,
      name: get(["name", "full_name", "nama"]),
      token: get(["token"]),
      // Skip nim yang sama
      nim: String(get(["nim", "student_id", "npm"]) ).trim(),
      jurusan: get(["jurusan", "department"]),
      dapil: get(["dapil", "dapil"]),
      absentNumber: get([
        "absent_number",
        "absentnumber",
        "absent",
        "no_absen",
      ]) || get(["absent", "absent_number"]),
      gender: get(["gender", "jenis_kelamin"]),
      angkatan: get(["angkatan", "year"]),
      kelas: get(["kelas", "class"]),
      status: get(["status"]),
      ...row,
    };
  }, []);

  // handle uploaded CSV file
  async function handleUpload(file: File) {
    // Post the file to server import endpoint. If that fails, fall back to client-side import.
    try {
      const fd = new FormData();
      fd.append("file", file, file.name);
      const resp = await fetch(`${API_BASE}/api/admin/voters/import`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      if (!resp.ok) throw new Error(`status ${resp.status}`);
      // reload from server
      await fetchVotersFromServer();
      setPage(1);
      setShowUpload(false);
      return;
    } catch (err) {
      // fallback to client-side parsing and storing in localStorage
    }

    // fallback: parse locally
    const reader = new FileReader();
    reader.onload = async () => {
      const text = String(reader.result ?? "");
      try {
        const parsed = await parseCSV(text);
        if (!parsed.length) {
          setShowUpload(false);
          return;
        }
        const newRecords = parsed.map((r, i) => normalizeRow(r, i));

        setVoters((prev) => {
          const existingNims = new Set(
            prev.map((v) =>
              String(v.nim ?? "")
                .trim()
                .toLowerCase(),
            ),
          );
          const filteredNew = newRecords.filter((rec) => {
            const nim = String(rec.nim ?? "").trim();
            if (!nim) return true;
            return !existingNims.has(nim.toLowerCase());
          });
          const next = [...prev, ...filteredNew];
          try {
            if (typeof window !== "undefined") {
              localStorage.setItem("voters", JSON.stringify(next));
            }
          } catch (e) {
            // ignore storage errors
          }
          return next;
        });

        setPage(1);
        setShowUpload(false);
      } catch (err) {
        console.error("CSV parse failed", err);
        setShowUpload(false);
      }
    };
    reader.onerror = () => {
      setShowUpload(false);
    };
    reader.readAsText(file);
  }

  // handle export to Excel
  async function exportToExcel() {
    if (!voters || !voters.length) {
      console.log("No voters to export");
      return;
    }

    try {
      const XLSX = await import(/* webpackChunkName: "xlsx" */ "xlsx");
      const rows = voters.map((v) => ({
        id: v.id ?? v.external_id ?? v.ID ?? "",
        name: v.name ?? "",
        nim: v.nim ?? "",
        token: v.token ?? "",
        jurusan: v.jurusan ?? "",
        dapil: v.dapil ?? "",
        kelas: v.kelas ?? "",
        angkatan: v.angkatan ?? "",
        gender: v.gender ?? "",
        absentNumber: v.absentNumber ?? v.absent ?? v.absent_number ?? "",
        status: v.status ?? "",
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Voters");
      const filename = `voters-${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, filename);
    } catch (err) {
      console.error("Failed to export xlsx", err);
    }
  }

  const filtered = useMemo(() => {
    if (!filters) return voters;

    const search = filters.search?.toLowerCase?.() ?? "";
    return voters.filter((s) => {
      if (search) {
        const hay = `${s.name ?? ""} ${s.nim ?? ""} ${
          s.token ?? ""
        }`.toLowerCase();
        if (!hay.includes(search)) return false;
      }
      if (filters.jurusan && !/all/i.test(filters.jurusan)) {
        if (
          !(s.jurusan ?? "")
            .toLowerCase()
            .includes(filters.jurusan.toLowerCase())
        )
          return false;
      }
      if (filters.class && !/all/i.test(filters.class)) {
        if (
          !(s.kelas ?? "").toLowerCase().includes(filters.class.toLowerCase())
        )
          return false;
      }
      if (filters.status && !/all/i.test(filters.status)) {
        if (filters.status !== s.status) return false;
      }
      return true;
    });
  }, [filters, voters]);

  const { totalPages, paginated } = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const start = (page - 1) * perPage;
    const paginated = filtered.slice(start, start + perPage);
    return { totalPages, paginated };
  }, [page, perPage, filtered]);

  function goto(newPage: number) {
    if (newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;
    setPage(newPage);
  }

  return (
    <div className="min-w-0 rounded-lg bg-white p-4 shadow">
      {/* Header */}
      <div className="mb-4 flex min-w-0 items-center justify-between">
        <div className="flex flex-shrink-0 items-center gap-3">
          <div className="rounded bg-gray-100 p-2">
            {/* table icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1f2937"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Voters List</h2>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 text-white shadow hover:bg-blue-700 lg:px-4 lg:py-2"
            style={{ cursor: "pointer" }}
          >
            {/* upload icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 5 17 10" />
              <line x1="12" y1="5" x2="12" y2="19" />
            </svg>
            <span className="text-xs">Upload CSV</span>
          </button>

          <button
            type="button"
            onClick={exportToExcel}
            className="inline-flex items-center gap-2 rounded-2xl bg-green-600 text-white shadow hover:bg-green-700 lg:px-4 lg:py-2"
            style={{ cursor: "pointer" }}
          >
            {/* excel icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" fill="#1D6F42" />
              <path
                d="M8 15L10 12L8 9M16 9L14 12L16 15"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="8" y="5" width="8" height="2" fill="#21A366" />
            </svg>

            <span className="text-xs">Download Excel</span>
          </button>

          <div className="hidden rounded-full bg-blue-500 px-3 py-1 text-sm text-white lg:block">
            {voters.length} data found
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr
              className="text-white"
              style={{ background: "linear-gradient(90deg,#58a2bd,#003f66)" }}
            >
              <th className="px-4 py-3 text-left first:rounded-l-md last:rounded-r-md">
                ID
              </th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Token</th>
              <th className="px-4 py-3 text-left">NIM</th>
              <th className="px-4 py-3 text-left">Jurusan</th>
              <th className="px-4 py-3 text-left">Dapil</th>
              <th className="w-16 px-4 py-3 text-center">Absent Number</th>
              <th className="px-4 py-3 text-left">Gender</th>
              <th className="px-4 py-3 text-left">Angkatan</th>
              <th className="px-4 py-3 text-left">Kelas</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((s) => (
              <tr key={s.id} className="border-b border-gray-300/50">
                <td className="px-4 py-4 text-sm text-gray-700">{s.id}</td>
                <td className="px-4 py-4 text-sm font-medium text-gray-800">
                  {s.name}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">{s.token}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{s.nim}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{s.jurusan}</td>
                <td className="px-4 py-4 text-center text-sm text-gray-700">
                  {s.dapil}
                </td>
                <td className="w-16 px-4 py-4 text-center text-sm text-gray-700">
                  {s.absentNumber ?? s.absent ?? s.absent_number ?? ""}
                </td>
                <td className="flex items-center gap-2 px-4 py-4 text-sm text-gray-700">
                  {s.gender}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {s.angkatan}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">{s.kelas}</td>
                <td className="px-4 py-4 text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm whitespace-nowrap text-white ${
                      String(s.status || "").toLowerCase() === "voted"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * perPage + 1} -{" "}
          {Math.min(page * perPage, voters.length)} of {voters.length}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => goto(page - 1)}
              className="rounded border px-3 py-1 hover:bg-gray-50"
              aria-label="Previous page"
            >
              ‹
            </button>
            <div className="rounded px-3 py-1">
              {page} / {totalPages}
            </div>
            <button
              onClick={() => goto(page + 1)}
              className="rounded border px-3 py-1 hover:bg-gray-50"
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Reset Data button + mobile actions (upload/export) */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="flex gap-3 lg:hidden">
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-3 py-2 text-white shadow hover:bg-blue-700"
            style={{ cursor: "pointer" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 5 17 10" />
              <line x1="12" y1="5" x2="12" y2="19" />
            </svg>
            <span className="text-xs">Upload CSV</span>
          </button>

          <button
            type="button"
            onClick={exportToExcel}
            className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-3 py-2 text-white shadow hover:bg-green-700"
            style={{ cursor: "pointer" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" fill="#1D6F42" />
              <path
                d="M8 15L10 12L8 9M16 9L14 12L16 15"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="8" y="5" width="8" height="2" fill="#21A366" />
            </svg>
            <span className="text-xs">Download Excel</span>
          </button>
        </div>

        <div>
          <button
            onClick={() => setShowReset(true)}
            className="rounded-2xl border px-4 py-2 text-red-600 hover:bg-red-50"
            title="Reset all voter data"
          >
            Reset Data
          </button>
        </div>
      </div>

      {/* Reset confirmation popup (separated component) */}
      <PopupReset
        open={showReset}
        onClose={() => setShowReset(false)}
        onConfirm={() => {
          (async () => {
            try {
              const resp = await fetch(`${API_BASE}/api/admin/voters/reset`, {
                method: "POST",
                credentials: "include",
              });
              if (resp.ok) {
                setVoters([]);
                try {
                  if (typeof window !== "undefined")
                    localStorage.removeItem("voters");
                } catch {}
              }
            } catch (err) {
              // fallback to client-side reset
              setVoters([]);
              try {
                if (typeof window !== "undefined")
                  localStorage.removeItem("voters");
              } catch {}
            }
            setPage(1);
            setShowReset(false);
          })();
        }}
      />

      {/* Upload popup */}
      <PopupUpload
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onSubmit={handleUpload}
      />
    </div>
  );
}
