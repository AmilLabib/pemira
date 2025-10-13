import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";

export type FilterValues = {
  class: string;
  jurusan: string;
  status: string;
  search: string;
};

type Props = {
  value?: FilterValues;
  onApply?: (filters: FilterValues) => void;
};

export default function FilterBar({ value, onApply }: Props) {
  const [filters, setFilters] = useState<FilterValues>(
    value ?? {
      class: "All Kelas",
      jurusan: "All Jurusan",
      status: "All Status",
      search: "",
    }
  );

  useEffect(() => {
    if (value) setFilters(value);
  }, [value]);

  const handleChange = (key: keyof FilterValues, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val } as FilterValues));
  };

  const handleApply = () => {
    if (onApply) onApply(filters);
    else console.log("Applied filters:", filters);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-2 bg-gray-100 rounded ">
          <Filter className="text-gray-700" size={18} />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 ml-2">Filters</h2>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-3"></div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleApply();
        }}
        className="flex flex-wrap items-center gap-4"
      >
        {/* Search */}
        <div className="flex flex-col flex-1 min-w-[250px]">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Cari..
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
            <Search size={16} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search by name, email, or NIM..."
              className="w-full text-sm text-gray-700 outline-none"
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
            />
          </div>
        </div>
        {/* Class */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Kelas
          </label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          <label className="text-sm font-medium text-gray-700 mb-1">
            Jurusan
          </label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
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

        {/* Voting Status */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Status Voting
          </label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option>All Status</option>
            <option>Voted</option>
            <option>Not Voted</option>
          </select>
        </div>

        {/* Apply Button */}
        <button
          type="submit"
          className="self-end bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
          style={{ cursor: "pointer" }}
        >
          <Filter size={16} />
          Apply Filters
        </button>
      </form>
    </div>
  );
}
