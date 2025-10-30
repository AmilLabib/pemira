import React, { useEffect, useState, useMemo } from "react";
import { API_BASE } from "../../lib/api";
import FilterBar, {
  type FilterValues,
} from "../../components/Admin/VerifyPemilih/Filter";
import EditCandidateModal from "../../components/Admin/EditCandidateModal";

type Candidate = {
  posisi: string;
  nama: string;
  nim: string;
  kelas: string;
  jurusan: string;
  dapil?: string | null;
  visi?: string;
  misi?: string;
  program_kerja?: string;
  ktm?: string;
  surat_pernyataan?: string;
  cv?: string;
  formulir_pernyataan_dukungan?: string;
  formulir_pendaftaran_tim_sukses?: string;
  link_video?: string;
  foto?: string;
  is_verified: number;
  ticket_number?: number | null;
};

function DashboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#58a2bd"
      viewBox="0 0 24 24"
      width="2em"
      height="2em"
    >
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" />
    </svg>
  );
}

const VerifyPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterValues | undefined>(undefined);

  // editing state
  const [editingNim, setEditingNim] = useState<string | null>(null);

  const fetchCandidates = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/bakal_calon`, {
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) setCandidates(json.result || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  async function toggleVerify(nim: string) {
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/bakal_calon/${nim}/verify`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      const json = await res.json();
      if (json.success) {
        setCandidates((prev) =>
          prev.map((c) =>
            c.nim === nim ? { ...c, is_verified: json.is_verified } : c,
          ),
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Note: openFile/startEdit/cancelEdit/saveEdit were removed during refactor
  // in favor of the table + EditCandidateModal flow. If you need the
  // old inline-edit or file-open behavior restored, I can re-add them.

  const filtered = useMemo(() => {
    if (!filters) return candidates;
    const q = filters.search.trim().toLowerCase();
    return candidates.filter((c) => {
      // search by name or nim
      if (q) {
        if (c.nama.toLowerCase().includes(q) || c.nim.toLowerCase().includes(q))
          return true;
        return false;
      }

      // position filter (from the updated FilterBar)
      if (filters.position && filters.position !== "All Positions") {
        const p = filters.position.toLowerCase();
        const posVal = (c.posisi || "").toLowerCase().trim();
        if (p === "presma" || p === "wapresma") {
          return posVal === p;
        }
        if (p === "blm") {
          return posVal.includes("anggota");
        }
      }
      return true;
    });
  }, [candidates, filters]);

  return (
    <>
      <div className="container max-w-[85vw] overflow-hidden md:py-8 lg:mx-auto lg:w-full lg:px-4 lg:py-6">
        <div className="flex gap-4 sm:flex-row sm:items-center">
          <div>
            <DashboardIcon />
          </div>
          <h1 className="text-2xl font-semibold text-[#002a45] sm:text-3xl">
            Verifikasi Bakal Calon
          </h1>
        </div>

        <div className="mt-6">
          <FilterBar
            value={filters}
            onApply={(f) => setFilters(f)}
            showStatus={false}
            showPosition={true}
          />

          <div className="mt-4">
            {loading ? (
              <div>Loading…</div>
            ) : (
              <div className="rounded bg-white p-4 shadow-sm">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="text-left text-sm text-gray-600">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Position</th>
                      <th className="pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr key={c.nim} className="border-t">
                        <td className="py-3 align-top">
                          <div className="font-medium">{c.nama}</div>
                          <div className="text-sm text-gray-500">{c.nim}</div>
                        </td>
                        <td className="py-3 align-top">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-sm text-gray-700">
                              {c.posisi}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 align-top">
                          <div className="flex gap-2">
                            <button
                              className="rounded bg-slate-100 px-2 py-1 text-sm"
                              onClick={() => {
                                setEditingNim(c.nim);
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              Edit
                            </button>
                            <button
                              className={`rounded px-2 py-1 text-sm text-white ${c.is_verified ? "bg-emerald-600" : "bg-red-600"}`}
                              onClick={() => toggleVerify(c.nim)}
                              style={{ cursor: "pointer" }}
                            >
                              {c.is_verified ? "Verified" : "Unverified"}
                            </button>
                            <button
                              className="rounded bg-red-600 px-2 py-1 text-sm text-white"
                              style={{ cursor: "pointer" }}
                              onClick={async () => {
                                if (
                                  !confirm(
                                    `Delete candidate ${c.nama} (${c.nim})? This will remove stored files.`,
                                  )
                                )
                                  return;
                                try {
                                  const res = await fetch(
                                    `${API_BASE}/api/admin/bakal_calon/${encodeURIComponent(
                                      c.nim,
                                    )}`,
                                    {
                                      method: "DELETE",
                                      credentials: "include",
                                    },
                                  );
                                  const json = await res.json();
                                  if (json.success)
                                    setCandidates((prev) =>
                                      prev.filter((x) => x.nim !== c.nim),
                                    );
                                  else
                                    alert(
                                      "Delete failed: " +
                                        (json.error || "unknown"),
                                    );
                                } catch (err) {
                                  console.error(err);
                                  alert(String(err));
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditCandidateModal
        open={Boolean(editingNim)}
        candidate={
          editingNim
            ? candidates.find((x) => x.nim === editingNim) || null
            : null
        }
        onClose={() => setEditingNim(null)}
        onSave={async (nim, updated) => {
          try {
            const res = await fetch(
              `${API_BASE}/api/admin/bakal_calon/${encodeURIComponent(nim)}`,
              {
                method: "PUT",
                credentials: "include",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(updated),
              },
            );
            const text = await res.text();

            // If the server returned a non-OK status, show a clear error with status + body
            if (!res.ok) {
              console.error("Save failed", res.status, res.statusText, text);
              alert(
                `Save failed: ${res.status} ${res.statusText}\n${text || "(no response body)"}`,
              );
              return;
            }

            let json: any;
            try {
              json = text ? JSON.parse(text) : {};
            } catch (parseErr) {
              console.error("Failed to parse JSON response:", text, parseErr);
              alert("Save failed: server returned invalid JSON:\n" + text);
              return;
            }

            if (json && json.success) {
              const updatedCandidate = json.result || updated;
              setCandidates((prev) =>
                prev.map((p) =>
                  p.nim === nim ? { ...p, ...(updatedCandidate as any) } : p,
                ),
              );
              setEditingNim(null);
            } else {
              alert("Save failed: " + (json?.error || "unknown"));
            }
          } catch (err) {
            console.error(err);
            alert("Save failed: " + String(err));
          }
        }}
      />
    </>
  );
};

export default VerifyPage;
