import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";

export type FilterValues = {
  class?: string;
  jurusan?: string;
  status?: string;
  search: string;
  position?: string;
};

type Props = {
  value?: FilterValues;
  onApply?: (filters: FilterValues) => void;
  showStatus?: boolean;
  showPosition?: boolean;
};

export default function FilterBar({
  value,
  onApply,
  showStatus = true,
  showPosition = false,
}: Props) {
  const [filters, setFilters] = useState<FilterValues>(
    value ?? {
      class: "All Kelas",
      jurusan: "All Jurusan",
      status: "All Status",
      position: "All Positions",
      search: "",
    },
  );

  useEffect(() => {
    if (value) setFilters(value);
  }, [value]);

  const handleChange = (key: keyof FilterValues, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }) as FilterValues);
  };

  const handleApply = () => {
    if (onApply) onApply(filters);
    else console.log("Applied filters:", filters);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-center space-x-2">
        <div className="rounded bg-gray-100 p-2">
          <Filter className="text-gray-700" size={18} />
        </div>
        <h2 className="ml-2 text-lg font-semibold text-gray-800">Filters</h2>
      </div>

      {/* Divider */}
      <div className="my-3 border-t border-gray-200"></div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleApply();
        }}
        className="flex flex-wrap items-center gap-4"
      >
        {/* Search */}
        <div className="flex min-w-[250px] flex-1 flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Cari..
          </label>
          <div className="flex items-center rounded-md border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
            <Search size={16} className="mr-2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by nama, token, or NIM..."
              className="w-full border-none text-sm text-gray-700 outline-none focus-within:ring-0"
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
            />
          </div>
        </div>
        {/* Class */}
        {showPosition ? (
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Position
            </label>
            <select
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={filters.position}
              onChange={(e) => handleChange("position", e.target.value)}
            >
              <option>All Positions</option>
              <option>Presma</option>
              <option>Wapresma</option>
              <option>BLM</option>
            </select>
          </div>
        ) : (
          <>
            {/* Class */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Kelas
              </label>
              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={filters.class}
                onChange={(e) => handleChange("class", e.target.value)}
              >
                <option>All Kelas</option>
                <option>Kelas A</option>
                <option>Kelas B</option>
              </select>
            </div>

            {/* Jurusan */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Jurusan
              </label>
              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={filters.jurusan}
                onChange={(e) => handleChange("jurusan", e.target.value)}
              >
                <option>All Jurusan</option>
                <option>D3 Akuntansi Alih Program</option>
                <option>D3 Kebendaharaan Negara Alih Program</option>
                <option>D3 Kepabeanan dan Cukai Alih Program</option>
                <option>D3 Manajemen Aset Alih Program</option>
                <option>D3 Pajak Alih Program</option>
                <option>D3 PBB/Penilai Alih Program</option>
                <option>D4 Akuntansi Sektor Publik Alih Program</option>
                <option>D4 Akuntansi Sektor Publik Reguler</option>
                <option>D4 Manajemen Aset Publik Alih Program</option>
                <option>D4 Manajemen Aset Publik Reguler</option>
                <option>D4 Manajemen Keuangan Negara Alih Program</option>
                <option>D4 Manajemen Keuangan Negara Reguler</option>
              </select>
            </div>
          </>
        )}

        {/* Voting Status */}
        {showStatus ? (
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Status Voting
            </label>
            <select
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={filters.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option>All Status</option>
              <option>Voted</option>
              <option>Not Voted</option>
            </select>
          </div>
        ) : null}

        {/* Apply Button */}
        <button
          type="submit"
          className="mx-auto mt-6 flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          style={{ cursor: "pointer" }}
        >
          <Filter size={16} />
          Apply Filters
        </button>
      </form>
    </div>
  );
}
