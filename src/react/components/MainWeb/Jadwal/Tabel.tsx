import React from "react";
import type { JadwalRow } from "../../../data/jadwals";

interface Props {
  data: JadwalRow[];
}

const Tabel: React.FC<Props> = ({ data }) => {
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [search, setSearch] = React.useState("");

  const filtered = data.filter(
    (row) =>
      row.kelas.toLowerCase().includes(search.toLowerCase()) ||
      row.jadwal.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Tampilkan</span>
          <select
            className="rounded border px-4 py-1 text-left text-sm"
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Cari :</span>
          <input
            className="rounded border px-2 py-1 text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Kelas/Jadwal"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#143b8a] text-white">
              <th className="px-2 py-2 font-bold">ID</th>
              <th className="px-2 py-2 font-bold">Kelas</th>
              <th className="px-2 py-2 font-bold">Jadwal</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <tr key={row.id} className="border-b last:border-b-0">
                <td className="px-2 py-2 text-center">{row.id}</td>
                <td className="px-2 py-2">{row.kelas}</td>
                <td className="px-2 py-2 font-bold text-[#143b8a]">
                  {row.jadwal}
                  <span className="ml-2 font-normal text-black">
                    Menyesuaikan Jadwal Kelas
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between text-sm">
        <span>
          Menampilkan {paginated.length ? (page - 1) * perPage + 1 : 0} sampai{" "}
          {(page - 1) * perPage + paginated.length} dari {filtered.length} entri
        </span>
        <div className="flex items-center gap-1">
          <button
            className="rounded bg-gray-100 px-2 py-1 hover:bg-gray-200 disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{ cursor: "pointer" }}
          >
            Sebelumnya
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let p = i + 1;
            if (page > 3 && totalPages > 5) p = page - 2 + i;
            if (p < 1 || p > totalPages) return null;
            return (
              <button
                key={p}
                className={`rounded px-2 py-1 ${page === p ? "bg-[#143b8a] font-bold text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                onClick={() => setPage(p)}
                style={{ cursor: "pointer" }}
              >
                {p}
              </button>
            );
          })}
          {totalPages > 5 && page < totalPages - 2 && <span>.....</span>}
          <button
            className="rounded bg-gray-100 px-2 py-1 hover:bg-gray-200 disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            style={{ cursor: "pointer" }}
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tabel;
