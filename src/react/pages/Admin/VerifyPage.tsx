import React, { useEffect, useState } from "react";

type Candidate = {
  posisi: string;
  nama: string;
  nim: string;
  kelas: string;
  jurusan: string;
  dapil: string;
  visi: string;
  misi: string;
  program_kerja: string;
  ktm: string;
  surat_pernyataan: string;
  cv: string;
  formulir_pernyataan_dukungan: string;
  formulir_pendaftaran_tim_sukses: string;
  link_video: string;
  foto: string;
  is_verified: number;
};

const VerifyPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingKey, setFetchingKey] = useState<string | null>(null);

  async function fetchCandidates() {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/bakal_calon", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const json = await res.json();
      if (json.success) setCandidates(json.result || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCandidates();
  }, []);

  async function toggleVerify(nim: string) {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/admin/bakal_calon/${nim}/verify`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
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

  async function openFile(key: string) {
    try {
      setFetchingKey(key);
      const token = localStorage.getItem("admin_token");
      const res = await fetch(
        `/api/admin/file?key=${encodeURIComponent(key)}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
      );
      if (!res.ok) {
        console.error("failed to fetch file", res.status);
        setFetchingKey(null);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      // revoke after a short delay to allow browser to load
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingKey(null);
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">
        Admin — Verifikasi Bakal Calon
      </h1>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="space-y-4">
          {candidates.map((c) => (
            <div key={c.nim} className="rounded border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-semibold">
                    {c.nama} — {c.posisi}
                  </div>
                  <div className="text-sm text-slate-600">
                    NIM: {c.nim} • Kelas: {c.kelas} • Jurusan: {c.jurusan}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    className={`rounded px-3 py-1 text-white ${c.is_verified ? "bg-green-600" : "bg-slate-600"}`}
                    onClick={() => toggleVerify(c.nim)}
                  >
                    {c.is_verified ? "Verified" : "Verify"}
                  </button>
                  <button
                    className="rounded bg-red-600 px-3 py-1 text-white"
                    onClick={async () => {
                      if (
                        !confirm(
                          `Delete candidate ${c.nama} (${c.nim})? This will remove stored files.`,
                        )
                      )
                        return;
                      try {
                        const token = localStorage.getItem("admin_token");
                        const res = await fetch(
                          `/api/admin/bakal_calon/${encodeURIComponent(c.nim)}`,
                          {
                            method: "DELETE",
                            headers: token
                              ? { Authorization: `Bearer ${token}` }
                              : undefined,
                          },
                        );
                        const json = await res.json();
                        if (json.success) {
                          setCandidates((prev) =>
                            prev.filter((x) => x.nim !== c.nim),
                          );
                        } else {
                          console.error("delete failed", json);
                          alert("Delete failed: " + (json.error || "unknown"));
                        }
                      } catch (err) {
                        console.error(err);
                        alert("Delete failed: " + String(err));
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                <div>
                  <div className="text-sm font-medium">Visi</div>
                  <div className="text-sm whitespace-pre-wrap">{c.visi}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Misi</div>
                  <div className="text-sm whitespace-pre-wrap">{c.misi}</div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {c.ktm && (
                  <button
                    className="text-sky-600 underline"
                    onClick={() => openFile(c.ktm)}
                    disabled={Boolean(fetchingKey)}
                  >
                    {fetchingKey === c.ktm ? "Loading…" : "KTM"}
                  </button>
                )}
                {c.surat_pernyataan && (
                  <button
                    className="text-sky-600 underline"
                    onClick={() => openFile(c.surat_pernyataan)}
                    disabled={Boolean(fetchingKey)}
                  >
                    {fetchingKey === c.surat_pernyataan ? "Loading…" : "Surat"}
                  </button>
                )}
                {c.cv && (
                  <button
                    className="text-sky-600 underline"
                    onClick={() => openFile(c.cv)}
                    disabled={Boolean(fetchingKey)}
                  >
                    {fetchingKey === c.cv ? "Loading…" : "CV"}
                  </button>
                )}
                {c.formulir_pernyataan_dukungan && (
                  <button
                    className="text-sky-600 underline"
                    onClick={() => openFile(c.formulir_pernyataan_dukungan)}
                    disabled={Boolean(fetchingKey)}
                  >
                    {fetchingKey === c.formulir_pernyataan_dukungan
                      ? "Loading…"
                      : "Formulir Dukungan"}
                  </button>
                )}
                {c.formulir_pendaftaran_tim_sukses && (
                  <button
                    className="text-sky-600 underline"
                    onClick={() => openFile(c.formulir_pendaftaran_tim_sukses)}
                    disabled={Boolean(fetchingKey)}
                  >
                    {fetchingKey === c.formulir_pendaftaran_tim_sukses
                      ? "Loading…"
                      : "Formulir Tim"}
                  </button>
                )}
                {c.foto && (
                  <button
                    className="text-sky-600 underline"
                    onClick={() => openFile(c.foto)}
                    disabled={Boolean(fetchingKey)}
                  >
                    {fetchingKey === c.foto ? "Loading…" : "Foto"}
                  </button>
                )}
                {c.link_video && (
                  <a
                    className="text-sky-600"
                    target="_blank"
                    rel="noreferrer"
                    href={c.link_video}
                  >
                    Video
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifyPage;
