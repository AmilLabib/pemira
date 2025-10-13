import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import CandidateCard from "../../components/Admin/CandidateCard";

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

  const auth = useAuth();

  const fetchCandidates = React.useCallback(async () => {
    setLoading(true);
    try {
      const token = auth.token;
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
  }, [auth.token]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  async function toggleVerify(nim: string) {
    try {
      const token = auth.token;
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
      const token = auth.token;
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
    <div>
      <h1 className="mb-4 text-2xl font-bold">
        Admin — Verifikasi Bakal Calon
      </h1>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="space-y-4">
          {candidates.map((c) => (
            <CandidateCard
              key={c.nim}
              candidate={c}
              onToggleVerify={toggleVerify}
              onDelete={async (nim: string) => {
                if (
                  !confirm(
                    `Delete candidate ${c.nama} (${c.nim})? This will remove stored files.`,
                  )
                )
                  return;
                try {
                  const token = auth.token;
                  const res = await fetch(
                    `/api/admin/bakal_calon/${encodeURIComponent(nim)}`,
                    {
                      method: "DELETE",
                      headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : undefined,
                    },
                  );
                  const json = await res.json();
                  if (json.success) {
                    setCandidates((prev) => prev.filter((x) => x.nim !== nim));
                  } else {
                    console.error("delete failed", json);
                    alert("Delete failed: " + (json.error || "unknown"));
                  }
                } catch (err) {
                  console.error(err);
                  alert("Delete failed: " + String(err));
                }
              }}
              onOpenFile={openFile}
              fetchingKey={fetchingKey}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifyPage;
