import React from "react";

type Candidate = {
  name: string;
  image?: string;
};

type Pair = {
  presma: Candidate;
  wapresma: Candidate;
};

// Dummy Data
const defaultPairs: Pair[] = [
  {
    presma: { name: "Muhammad Advaita Yudhapratidina Hermansyah" },
    wapresma: { name: "Arridho Rizki Ananda" },
  },
  {
    presma: { name: "Muhammad Naufal Prananda" },
    wapresma: { name: "Agustian Rafif Setya" },
  },
  {
    presma: { name: "Rally Al Farouq" },
    wapresma: { name: "Farid Wicaksono" },
  },
];

export interface PresmaWapresmaProps {
  pairs?: Pair[];
  title?: string;
  selected?: number | null;
  onSelect?: (index: number) => void;
}

const PresmaWapresma: React.FC<PresmaWapresmaProps> = ({
  pairs = defaultPairs,
  title = "Pilih Presma - Wapresma",
  selected = null,
  onSelect,
}) => {
  return (
    <div className="mx-auto w-[90vw] rounded-2xl bg-white px-7 py-2 shadow-sm">
      <h2 className="text:lg mb-2 font-extrabold text-[#003b4f] lg:text-2xl">
        {title}
      </h2>
      <hr className="mb-4 border-t-2 border-gray-200" />

      <div className="flex flex-col items-stretch gap-5 md:flex-row">
        {pairs.map((pair, idx) => {
          const isSelected = selected === idx;
          return (
            <div
              className={`flex-1 ${
                isSelected
                  ? "bg-[#eaf9ff] ring-4 ring-[#102a71]"
                  : "bg-white hover:bg-[#eaf9ff]"
              } relative min-w-[200px] rounded-lg border-2 border-gray-200 p-4 transition-all duration-400 hover:bottom-2 hover:border-[#102a71]`}
              key={idx}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect?.(idx)}
              role="button"
              aria-pressed={isSelected}
            >
              <div className="absolute left-3 rounded-md bg-[#123a73] px-3 py-1 text-base font-bold text-white">
                No. {idx + 1}
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="flex w-full flex-col items-center">
                  <div className="h-48 w-36 rounded-lg bg-gradient-to-b from-cyan-100 to-sky-100 shadow-inner lg:h-60 lg:w-45" />
                  <div className="font-regular font-league mt-2 w-[90%] rounded-md border border-gray-200 bg-white px-4 py-2 text-center whitespace-normal text-[#0b2b3a]">
                    {pair.presma.name}
                  </div>
                </div>

                <div className="flex w-full flex-col items-center">
                  <div className="h-48 w-36 rounded-lg bg-gradient-to-b from-cyan-100 to-sky-100 shadow-inner lg:h-60 lg:w-45" />
                  <div className="font-regular font-league mt-2 w-60 rounded-md border border-gray-200 bg-white px-4 py-2 text-center whitespace-normal text-[#0b2b3a]">
                    {pair.wapresma.name}
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

export default PresmaWapresma;
