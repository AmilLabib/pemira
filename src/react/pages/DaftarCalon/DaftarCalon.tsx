import React, { useEffect, useState } from "react";

type Candidate = {
  posisi: string;
  nama: string;
  nim: string;
  kelas: string;
  jurusan: string;
  dapil: string | null;
  ticket_number: number | null;
  foto?: string;
  is_verified: number;
  formulir_pendaftaran_tim_sukses?: string | null;
  visi?: string | null;
  misi?: string | null;
  program_kerja?: string | null;
  link_video?: string | null;
};

const DaftarCalon: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Candidate | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch("/api/daftar/bakal_calon");
        const json = await res.json();
        if (json.success && mounted) {
          // only show verified candidates
          const verified: Candidate[] = (json.result || []).filter(
            (c: any) => c.is_verified && c.ticket_number !== null,
          );
          setCandidates(verified);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // fetch images for displayed candidates and cache as object URLs
  useEffect(() => {
    let mounted = true;
    const createdUrls: string[] = [];

    async function fetchForCandidate(c: Candidate) {
      if (!c.foto) return;
      if (imageUrls[c.nim] || imageLoading[c.nim]) return;

      setImageLoading((s) => ({ ...s, [c.nim]: true }));
      setImageError((s) => ({ ...s, [c.nim]: false }));

      try {
        // if foto looks like an internal R2 key (no scheme), proxy via backend
        const isLikelyKey = /^[^:\/]+\/.+/.test(c.foto);
        const fetchUrl = isLikelyKey
          ? `/api/daftar/file?key=${encodeURIComponent(c.foto)}`
          : c.foto;
        const res = await fetch(fetchUrl);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const blob = await res.blob();
        const obj = URL.createObjectURL(blob);
        createdUrls.push(obj);
        if (mounted) setImageUrls((s) => ({ ...s, [c.nim]: obj }));
      } catch (err) {
        console.error("image fetch failed for", c.nim, err);
        if (mounted) setImageError((s) => ({ ...s, [c.nim]: true }));
      } finally {
        if (mounted) setImageLoading((s) => ({ ...s, [c.nim]: false }));
      }
    }

    // start fetching for current candidates
    candidates.forEach((c) => {
      if (c.foto) fetchForCandidate(c);
    });

    return () => {
      mounted = false;
      // revoke created object URLs
      createdUrls.forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates]);

  // group presma/wapresma pairs by ticket_number
  const pairs = React.useMemo(() => {
    const map = new Map<number, Candidate[]>();
    candidates.forEach((c) => {
      if (c.posisi === "presma" || c.posisi === "wapresma") {
        if (c.ticket_number !== null) {
          const arr = map.get(c.ticket_number) || [];
          arr.push(c);
          map.set(c.ticket_number, arr);
        }
      }
    });
    // return sorted by ticket number
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([num, arr]) => ({ number: num, pair: arr }));
  }, [candidates]);

  // group anggota blm by dapil
  const anggotaByDapil = React.useMemo(() => {
    const map = new Map<string, Candidate[]>();
    candidates.forEach((c) => {
      if (c.posisi === "anggota_blm" || c.posisi === "anggota blm") {
        const key = c.dapil || "Unknown";
        const arr = map.get(key) || [];
        arr.push(c);
        map.set(key, arr);
      }
    });
    // sort candidates inside each dapil by ticket_number (ascending, nulls last) then by name
    const entries = Array.from(map.entries()).map(([k, list]) => {
      const sorted = list.slice().sort((x, y) => {
        const aNum =
          x.ticket_number === null || x.ticket_number === undefined
            ? Infinity
            : x.ticket_number;
        const bNum =
          y.ticket_number === null || y.ticket_number === undefined
            ? Infinity
            : y.ticket_number;
        if (aNum !== bNum) return aNum - bNum;
        return x.nama.localeCompare(y.nama);
      });
      return [k, sorted] as [string, Candidate[]];
    });
    return entries.sort((a, b) => a[0].localeCompare(b[0]));
  }, [candidates]);

  // fixed dapil navigation (always show these 4)
  const DAPILS = ["Dapil I", "Dapil II", "Dapil III", "Dapil IV"];
  const [selectedDapil, setSelectedDapil] = useState<string>(DAPILS[0]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-center text-2xl font-bold">
        Daftar Calon Terverifikasi
      </h1>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="mb-2 text-center text-xl font-semibold">
              Presma & Wapresma
            </h2>
            {pairs.length === 0 ? (
              <div>Tidak ada pasangan terverifikasi dengan nomor.</div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {pairs.map((p) => (
                  <div
                    key={p.number}
                    className="rounded border bg-white p-4 shadow-sm transition hover:shadow-md"
                  >
                    <div className="text-center text-sm text-gray-500">
                      Nomor {p.number}
                    </div>

                    {/* 2-column layout: presma left, wapresma right */}
                    <div className="mt-3 grid grid-cols-2 items-start gap-4 md:grid-cols-2">
                      {/** Ensure two cards (presma left, wapresma right). We'll map and place by posisi. **/}
                      <div className="md:col-span-1">
                        {p.pair
                          .filter((c) => c.posisi === "presma")
                          .map((c) => (
                            <div
                              key={c.nim}
                              className="flex flex-col items-center gap-3 text-center"
                            >
                              {imageLoading[c.nim] ? (
                                <div className="h-40 w-28 animate-pulse rounded-md bg-gray-200" />
                              ) : imageUrls[c.nim] ? (
                                <img
                                  src={imageUrls[c.nim]}
                                  alt={c.nama}
                                  className="mx-auto h-40 w-28 rounded-md object-cover"
                                  style={{ objectPosition: "center center" }}
                                />
                              ) : c.foto && imageError[c.nim] ? (
                                <div className="flex h-40 w-28 items-center justify-center rounded-md bg-red-100 text-xs text-red-600">
                                  Err
                                </div>
                              ) : c.foto ? (
                                <img
                                  src={c.foto}
                                  alt={c.nama}
                                  className="mx-auto h-40 w-28 rounded-md object-cover"
                                  style={{ objectPosition: "center center" }}
                                />
                              ) : (
                                <div className="h-40 w-28 rounded-md bg-gray-200" />
                              )}

                              <div className="mt-2 flex w-full flex-col items-center">
                                <div className="font-medium">{c.nama}</div>
                                <div className="text-sm text-gray-600">
                                  {c.nim}
                                </div>
                                <div className="mt-2">
                                  <button
                                    className="rounded bg-slate-100 px-3 py-1 text-sm"
                                    onClick={() => setSelected(c)}
                                  >
                                    Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>

                      <div className="md:col-span-1">
                        {p.pair
                          .filter((c) => c.posisi === "wapresma")
                          .map((c) => (
                            <div
                              key={c.nim}
                              className="flex flex-col items-center gap-3 text-center"
                            >
                              {imageLoading[c.nim] ? (
                                <div className="h-40 w-28 animate-pulse rounded-md bg-gray-200" />
                              ) : imageUrls[c.nim] ? (
                                <img
                                  src={imageUrls[c.nim]}
                                  alt={c.nama}
                                  className="mx-auto h-40 w-28 rounded-md object-cover"
                                  style={{ objectPosition: "center center" }}
                                />
                              ) : c.foto && imageError[c.nim] ? (
                                <div className="flex h-40 w-28 items-center justify-center rounded-md bg-red-100 text-xs text-red-600">
                                  Err
                                </div>
                              ) : c.foto ? (
                                <img
                                  src={c.foto}
                                  alt={c.nama}
                                  className="mx-auto h-40 w-28 rounded-md object-cover"
                                  style={{ objectPosition: "center center" }}
                                />
                              ) : (
                                <div className="h-40 w-28 rounded-md bg-gray-200" />
                              )}

                              <div className="mt-2 flex w-full flex-col items-center">
                                <div className="font-medium">{c.nama}</div>
                                <div className="text-sm text-gray-600">
                                  {c.nim}
                                </div>
                                <div className="mt-2">
                                  <button
                                    className="rounded bg-slate-100 px-3 py-1 text-sm"
                                    onClick={() => setSelected(c)}
                                  >
                                    Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-2 text-center text-xl font-semibold">
              Anggota BLM
            </h2>
            {anggotaByDapil.length === 0 ? (
              <div>Tidak ada anggota BLM terverifikasi.</div>
            ) : (
              <div className="space-y-4">
                {/* dapil navigation */}
                <div className="flex flex-wrap gap-2">
                  {DAPILS.map((dapil) => (
                    <button
                      key={dapil}
                      className={`rounded px-3 py-1 text-sm ${dapil === selectedDapil ? "bg-slate-200 font-semibold" : "bg-slate-50 hover:bg-slate-100"}`}
                      onClick={() => setSelectedDapil(dapil)}
                      aria-pressed={dapil === selectedDapil}
                    >
                      {dapil}
                    </button>
                  ))}
                </div>

                {/* show only selected dapil */}
                {(() => {
                  const found = anggotaByDapil.find(
                    ([d]) => d === selectedDapil,
                  );
                  if (!found) return null; // no candidates for this dapil -> show nothing
                  const [dapil, list] = found;
                  return (
                    // show only the dapil card (no outer border wrapper)
                    <div key={dapil}>
                      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {list.map((c) => (
                          <div
                            key={c.nim}
                            className="flex flex-col items-start gap-3 rounded border bg-white p-3 shadow-sm"
                          >
                            <div className="flex w-full items-center gap-3">
                              {imageLoading[c.nim] ? (
                                <div className="h-20 w-14 animate-pulse rounded-md bg-gray-200" />
                              ) : imageUrls[c.nim] ? (
                                <img
                                  src={imageUrls[c.nim]}
                                  alt={c.nama}
                                  className="h-20 w-14 rounded-md object-cover"
                                  style={{ objectPosition: "center center" }}
                                />
                              ) : c.foto && imageError[c.nim] ? (
                                <div className="flex h-20 w-14 items-center justify-center rounded-md bg-red-100 text-xs text-red-600">
                                  Err
                                </div>
                              ) : c.foto ? (
                                <img
                                  src={c.foto}
                                  alt={c.nama}
                                  className="h-20 w-14 rounded-md object-cover"
                                  style={{ objectPosition: "center center" }}
                                />
                              ) : (
                                <div className="h-20 w-14 rounded-md bg-gray-200" />
                              )}

                              <div className="flex-1">
                                <div className="font-medium">{c.nama}</div>
                                <div className="text-sm text-gray-600">
                                  Nomor {c.ticket_number ?? "-"} • {c.nim}
                                </div>
                              </div>
                            </div>

                            <div className="flex w-full justify-end">
                              <button
                                className="rounded bg-slate-100 px-2 py-1 text-sm"
                                onClick={() => setSelected(c)}
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </section>
        </div>
      )}

      {/* details modal/simple panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelected(null)}
          />
          <div className="relative z-10 max-w-xl rounded bg-white p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">{selected.nama}</div>
                <div className="text-sm text-gray-600">
                  {selected.nim} • {selected.posisi}
                </div>
              </div>
              <button
                className="ml-4 rounded bg-slate-100 px-2 py-1"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <div className="text-sm font-medium">Kelas / Jurusan</div>
                <div className="text-sm">
                  {selected.kelas} — {selected.jurusan}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Ticket</div>
                <div className="text-sm">{selected.ticket_number ?? "—"}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm font-medium">Detail</div>
              <div className="text-sm whitespace-pre-wrap">{
                // show a few available fields
                `Posisi: ${selected.posisi}\nNIM: ${selected.nim}\nKelas: ${selected.kelas}\nJurusan: ${selected.jurusan}\nDapil: ${selected.dapil ?? "-"}`
              }</div>
            </div>

            {/* visi / misi / program kerja */}
            <div className="mt-4">
              {selected.visi && (
                <div className="mb-3">
                  <div className="text-sm font-medium">Visi</div>
                  <div className="text-sm whitespace-pre-wrap">
                    {selected.visi}
                  </div>
                </div>
              )}

              {selected.misi && (
                <div className="mb-3">
                  <div className="text-sm font-medium">Misi</div>
                  <div className="text-sm whitespace-pre-wrap">
                    {selected.misi}
                  </div>
                </div>
              )}

              {selected.program_kerja && (
                <div>
                  <div className="text-sm font-medium">Program Kerja</div>
                  <div className="text-sm whitespace-pre-wrap">
                    {selected.program_kerja}
                  </div>
                </div>
              )}
            </div>

            {selected.link_video && (
              <div className="mt-3">
                <div className="text-sm font-medium">Video</div>
                <a
                  className="text-sky-600"
                  href={selected.link_video}
                  target="_blank"
                  rel="noreferrer"
                >
                  {selected.link_video}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarCalon;
