import React, { useEffect, useState } from "react";

type Candidate = {
  id: number;
  role: string;
  name: string;
  nim: string;
  major: string;
  vision: string;
  mission: string;
  programme: string;
  video_url?: string | null;
  photo_url?: string | null;
  is_verified?: boolean;
};

const VerifyCandidatePage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/candidates/all");
      const json = await res.json();
      if (res.ok) setCandidates(json.candidates || []);
      else console.error(json.error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleVerify = async (
    id: number,
    currentlyVerified: boolean | undefined,
  ) => {
    try {
      const endpoint = currentlyVerified ? "unverify" : "verify";
      // Optimistic UI update
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, is_verified: !currentlyVerified } : c,
        ),
      );
      const res = await fetch(`/api/candidates/${id}/${endpoint}`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) {
        console.error(json.error);
        alert(json.error || "Failed to update");
        // revert optimistic
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, is_verified: currentlyVerified } : c,
          ),
        );
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update candidate");
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, is_verified: currentlyVerified } : c,
        ),
      );
    }
  };

  return (
    <section className="p-6">
      <h2 className="mb-4 text-2xl font-bold">
        Admin Dashboard — Verify Candidates
      </h2>
      {loading && <p>Loading candidates...</p>}
      {!loading && candidates.length === 0 && <p>No candidates found.</p>}
      <div className="mt-4 grid grid-cols-1 gap-4">
        {candidates.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded border p-4"
          >
            <div className="flex items-center gap-4">
              {c.photo_url ? (
                <img
                  src={c.photo_url}
                  alt={c.name}
                  className="h-16 w-16 rounded object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded bg-gray-200" />
              )}
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-neutral-600">
                  {c.role} · {c.major}
                </div>
                <div className="text-sm text-neutral-500">NIM: {c.nim}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center text-sm text-neutral-600">
                {c.is_verified ? (
                  <span className="text-green-600">Verified</span>
                ) : (
                  <span className="text-yellow-600">Pending</span>
                )}
              </div>
              <button
                className={`rounded px-3 py-1 text-white ${c.is_verified ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
                onClick={() => toggleVerify(c.id, c.is_verified)}
              >
                {c.is_verified ? "Unverify" : "Verify"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VerifyCandidatePage;
