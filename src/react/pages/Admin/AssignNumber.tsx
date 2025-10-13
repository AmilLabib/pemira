import React, { useEffect, useState } from "react";
// no direct auth hook needed; requests use cookie credentials

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
  foto: string;
  is_verified: number;
  ticket_number?: number | null;
};

const AssignNumber: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [numberInput, setNumberInput] = useState<string>("");

  // using cookie session; no direct auth token needed here

  const fetchCandidates = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bakal_calon", {
        credentials: "same-origin",
      });
      const json = await res.json();
      if (json.success)
        // only show verified candidates on Assign Number page
        setCandidates(
          (json.result || []).filter((c: Candidate) => Boolean(c.is_verified)),
        );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, []);

  async function assignNumber(nim: string) {
    const parsed = Number(numberInput);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      alert("Masukkan nomor valid (integer > 0)");
      return;
    }
    setAssigning(nim);
    try {
      const res = await fetch(
        `/api/admin/bakal_calon/${encodeURIComponent(nim)}/assign_number`,
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ number: parsed }),
        },
      );
      const json = await res.json();
      if (json.success) {
        // refresh list
        await fetchCandidates();
        setNumberInput("");
      } else {
        alert("Assign failed: " + (json.error || "unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Assign failed: " + String(err));
    } finally {
      setAssigning(null);
    }
  }

  async function clearNumber(nim: string) {
    if (!confirm("Clear assigned number for this candidate?")) return;
    setAssigning(nim);
    try {
      const res = await fetch(
        `/api/admin/bakal_calon/${encodeURIComponent(nim)}/assign_number`,
        {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ number: null }),
        },
      );
      const json = await res.json();
      if (json.success) {
        await fetchCandidates();
      } else {
        alert("Clear failed: " + (json.error || "unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Clear failed: " + String(err));
    } finally {
      setAssigning(null);
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Admin — Assign Number</h1>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Nomor tiket (integer)"
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
              className="rounded border px-3 py-2"
            />
            <div className="text-sm text-slate-500">
              Select a candidate and click Assign
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {candidates.map((c) => (
              <div key={c.nim} className="rounded border bg-white p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {c.nama} — {c.posisi}
                    </div>
                    <div className="text-sm text-slate-600">NIM: {c.nim}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-slate-700">
                      {c.ticket_number ?? "—"}
                    </div>
                    <button
                      className="rounded bg-sky-600 px-3 py-1 text-white"
                      onClick={() => assignNumber(c.nim)}
                      disabled={Boolean(assigning)}
                    >
                      {assigning === c.nim ? "Assigning…" : "Assign"}
                    </button>
                    <button
                      className="rounded bg-gray-200 px-3 py-1 text-sm"
                      onClick={() => clearNumber(c.nim)}
                      disabled={Boolean(assigning)}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignNumber;
