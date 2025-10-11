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
};

const DaftarCalon: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Candidate | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/candidates");
        const json = await res.json();
        if (res.ok) {
          setCandidates(json.candidates || []);
        } else {
          console.error(json.error || "Failed to load candidates");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section id="daftar-calon" className="px-4 py-16">
      <h2 className="mb-4 text-center text-3xl font-bold">Daftar Calon</h2>
      {loading && <p className="text-center">Loading...</p>}
      {!loading && candidates.length === 0 && (
        <p className="text-center text-neutral-700">
          Belum ada calon terdaftar.
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {candidates.map((c) => (
          <article
            key={c.id}
            className="cursor-pointer rounded border p-4 text-left shadow-sm hover:shadow-md"
            onClick={() => setSelected(c)}
          >
            <div className="flex items-center gap-4">
              {c.photo_url ? (
                <img
                  src={c.photo_url}
                  alt={c.name}
                  className="h-20 w-20 rounded object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded bg-gray-200" />
              )}
              <div>
                <h3 className="text-lg font-semibold">{c.name}</h3>
                <p className="text-sm text-neutral-600">
                  {c.role} — {c.major}
                </p>
                <p className="text-sm text-neutral-500">NIM: {c.nim}</p>
              </div>
            </div>

            {/* Visi & Misi hidden on the home card; open the card to view details */}
          </article>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-3xl overflow-auto rounded bg-white p-6">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold">{selected.name}</h3>
              <button
                className="text-gray-600"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-4 md:flex-row">
              {selected.photo_url ? (
                <img
                  src={selected.photo_url}
                  alt={selected.name}
                  className="h-48 w-48 rounded object-cover"
                />
              ) : (
                <div className="h-48 w-48 rounded bg-gray-200" />
              )}
              <div>
                <p className="mb-2 text-sm text-neutral-600">
                  {selected.role} — {selected.major}
                </p>
                <p className="mb-2">
                  <strong>Vision</strong>: {selected.vision}
                </p>
                <p className="mb-2">
                  <strong>Mission</strong>: {selected.mission}
                </p>
                <p className="mb-2">
                  <strong>Programme</strong>: {selected.programme}
                </p>
                {selected.video_url && (
                  <div className="mt-4">
                    <video
                      controls
                      src={selected.video_url}
                      className="max-h-64 w-full rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DaftarCalon;
