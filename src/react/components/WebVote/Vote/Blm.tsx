import React from "react";

type Candidate = {
  id: number;
  number: number;
  name: string;
  kelas?: string;
  image?: string;
};

const defaultCandidates: Candidate[] = [
  { id: 1, number: 1, name: "NAMA CALON 1", kelas: "Kelas 1A" },
  { id: 2, number: 2, name: "NAMA CALON 2", kelas: "Kelas 1B" },
  { id: 3, number: 3, name: "NAMA CALON 3", kelas: "Kelas 2A" },
  { id: 4, number: 4, name: "NAMA CALON 4", kelas: "Kelas 2B" },
  { id: 5, number: 5, name: "NAMA CALON 5", kelas: "Kelas 3A" },
  { id: 6, number: 6, name: "NAMA CALON 6", kelas: "Kelas 3B" },
  { id: 7, number: 7, name: "NAMA CALON 7", kelas: "Kelas 4A" },
  { id: 8, number: 8, name: "NAMA CALON 8", kelas: "Kelas 4B" },
  { id: 9, number: 9, name: "NAMA CALON 9", kelas: "Kelas 5A" },
  { id: 10, number: 10, name: "NAMA CALON 10", kelas: "Kelas 5B" },
  { id: 11, number: 11, name: "NAMA CALON 11", kelas: "Kelas 6A" },
  { id: 12, number: 12, name: "NAMA CALON 12", kelas: "Kelas 6B" },
];
export interface BlmProps {
  candidates?: Candidate[];
  title?: string;
  selected?: number | null;
  onSelect?: (id: number) => void;
}

const Blm: React.FC<BlmProps> = ({
  candidates = defaultCandidates,
  title = "Pilih Badan Legislatif Mahasiswa",
  selected = null,
  onSelect,
}) => {
  return (
    <div className="mx-auto w-[90vw] rounded-2xl bg-white px-7 py-3 shadow-sm">
      <h2 className="mb-2 text-lg font-extrabold text-[#003b4f] lg:text-2xl">
        {title}
      </h2>
      <hr className="mb-4 border-t-2 border-gray-200" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {candidates.map((candidate) => {
          const isSelected = selected === candidate.id;
          return (
            <div
              className={`${
                isSelected
                  ? "bg-[#eaf9ff] ring-4 ring-[#102a71]"
                  : "bg-white hover:bg-[#eaf9ff]"
              } relative transform rounded-lg border-2 border-gray-200 p-4 transition duration-200 hover:-translate-y-1 hover:border-[#102a71]`}
              key={candidate.id}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect?.(candidate.id)}
              role="button"
              aria-pressed={isSelected}
            >
              <div className="absolute left-3 rounded-md bg-[#123a73] px-3 py-1 text-sm font-bold text-white">
                No. {candidate.number}
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="flex w-full flex-col items-center">
                  <div className="mt-8 h-48 w-36 rounded-lg bg-gradient-to-b from-cyan-100 to-sky-100 shadow-inner lg:h-60 lg:w-45" />
                  <div className="mt-2 w-3/4 rounded-md border border-gray-200 bg-white px-4 py-2 text-center font-semibold whitespace-normal text-[#0b2b3a]">
                    {candidate.name}
                    <div className="mt-1 text-sm text-gray-500">
                      {candidate.kelas}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Blm;
