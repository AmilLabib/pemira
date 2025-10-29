import React, { useEffect, useMemo, useState } from "react";

type Candidate = {
  posisi: string;
  nama: string;
  nim: string;
  ticket_number: number | null;
  foto?: string;
  is_verified: number;
};

type PairData = {
  id: string;
  number: number; // ticket number
  presma: string;
  wapresma: string;
  votes: number;
  color?: string;
  presmaFoto?: string;
  wapresmaFoto?: string;
};

type Props = {
  height?: number;
};

const PresmaColumnChart: React.FC<Props> = ({ height = 400 }) => {
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/daftar/bakal_calon");
        if (!res.ok) throw new Error("fetch failed");
        const json = await res.json();
        if (json?.result && mounted) {
          setCandidates(json.result as Candidate[]);
        }
      } catch (e) {
        // ignore and leave candidates null to use fallback
        console.warn("PresmaColumnChart: failed to load candidates", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // read votes from localStorage
  const votes = useMemo(() => {
    try {
      const raw = localStorage.getItem("votes");
      if (!raw) return [] as any[];
      return JSON.parse(raw) as any[];
    } catch (e) {
      return [] as any[];
    }
  }, []);

  // group candidates into pairs by ticket_number (same logic as DaftarCalon)
  const pairs = useMemo(() => {
    if (!candidates) return [] as { number: number; pair: Candidate[] }[];
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
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([num, arr]) => ({ number: num, pair: arr }));
  }, [candidates]);

  const data: PairData[] = useMemo(() => {
    if (!pairs || pairs.length === 0) {
      return [
        {
          id: "1",
          number: 1,
          presma: "Ali",
          wapresma: "Budi",
          votes: 240,
          color: "bg-teal-500",
        },
        {
          id: "2",
          number: 2,
          presma: "Citra",
          wapresma: "Dewi",
          votes: 160,
          color: "bg-yellow-500",
        },
        {
          id: "3",
          number: 3,
          presma: "Eko",
          wapresma: "Fajar",
          votes: 80,
          color: "bg-indigo-500",
        },
      ];
    }

    return pairs.map((p, idx) => {
      // find presma and wapresma names
      const pres = p.pair.find((c) => c.posisi === "presma");
      const wap = p.pair.find((c) => c.posisi === "wapresma");

      // count votes: support both stored index (0-based) or ticket_number
      const count = votes.reduce((acc, v) => {
        try {
          if (v === null || v === undefined) return acc;
          // v.presma may be index or ticket number
          if (Number(v.presma) === idx) return acc + 1;
          if (Number(v.presma) === p.number) return acc + 1;
        } catch (e) {
          // ignore
        }
        return acc;
      }, 0 as number);

      const color =
        idx === 0
          ? "bg-teal-500"
          : idx === 1
            ? "bg-yellow-500"
            : "bg-indigo-500";

      // helper to turn internal R2 key into proxy URL
      const makePhotoUrl = (foto?: string | undefined) => {
        if (!foto) return undefined;
        const isLikelyKey = /^[^:\/]+\/.+/.test(foto);
        return isLikelyKey
          ? `/api/daftar/file?key=${encodeURIComponent(foto)}`
          : foto;
      };

      return {
        id: String(p.number),
        number: p.number,
        presma: pres?.nama ?? "-",
        wapresma: wap?.nama ?? "-",
        votes: count,
        color,
        presmaFoto: makePhotoUrl(pres?.foto),
        wapresmaFoto: makePhotoUrl(wap?.foto),
      };
    });
  }, [pairs, votes]);

  const max = Math.max(...data.map((d) => d.votes), 1);

  return (
    <div className="mx-auto my-8 w-[90vw] rounded-xl bg-white py-8 opacity-90 lg:w-[65vw]">
      <div className="w-full">
        <div className="flex items-end gap-6 px-4 md:px-8">
          {data.map((pair) => {
            const h = Math.round((pair.votes / max) * (height - 40)) + 40; // enforce min height
            return (
              <div key={pair.id} className="flex flex-1 flex-col items-center">
                {/* top labels with person icons */}
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex flex-col items-center text-sm">
                    <div className="flex items-center gap-1">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/60 shadow">
                        {pair.presmaFoto ? (
                          <img
                            src={pair.presmaFoto}
                            alt={pair.presma}
                            className="h-7 w-7 rounded-full object-cover"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-700"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                          </svg>
                        )}
                      </div>
                      <div className="text-xs font-medium text-gray-700">
                        {pair.presma}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">Presma</div>
                  </div>

                  <div className="flex flex-col items-center text-sm">
                    <div className="flex items-center gap-1">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/60 shadow">
                        {pair.wapresmaFoto ? (
                          <img
                            src={pair.wapresmaFoto}
                            alt={pair.wapresma}
                            className="h-7 w-7 rounded-full object-cover"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-700"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                          </svg>
                        )}
                      </div>
                      <div className="text-xs font-medium text-gray-700">
                        {pair.wapresma}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">Wapresma</div>
                  </div>
                </div>

                {/* bar itself */}
                <div className="relative flex w-full flex-col items-center">
                  <div
                    className={`w-11/12 rounded-t-lg shadow-md ${pair.color || "bg-sky-400"}`}
                    style={{ height: `${h}px`, transition: "height 400ms" }}
                  />
                  <div className="mt-2 text-sm font-semibold text-gray-800">
                    {pair.votes}
                  </div>
                  <div className="mt-1 text-center text-xs text-gray-500">
                    No {pair.number}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* axis ticks */}
        <div className="mt-6 px-4 md:px-8">
          <div className="flex justify-between text-xs text-gray-400">
            <span>0</span>
            <span>{Math.round(max / 2)}</span>
            <span>{max}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresmaColumnChart;
