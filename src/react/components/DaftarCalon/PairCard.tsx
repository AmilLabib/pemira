import React from "react";

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

type Props = {
  number: number;
  presma?: Candidate | null;
  wapresma?: Candidate | null;
  imageUrls: Record<string, string>;
  imageLoading: Record<string, boolean>;
  imageError: Record<string, boolean>;
  onSelect: (c: Candidate | null) => void;
};

const CandidateCard: React.FC<{
  c?: Candidate | null;
  imageUrls: Record<string, string>;
  imageLoading: Record<string, boolean>;
  imageError: Record<string, boolean>;
  onSelect: (c: Candidate | null) => void;
}> = ({ c, imageUrls, imageLoading, imageError, onSelect }) => {
  if (!c) {
    return (
      <div className="flex flex-col items-center gap-3 text-center opacity-80">
        <div className="mt-8 h-48 w-36 rounded-md border border-dashed border-gray-300 bg-gray-100 lg:h-60 lg:w-45" />
        <div className="mt-2 flex w-full flex-col items-center">
          <div className="text-sm font-medium text-gray-700">
            Belum terdaftar
          </div>
          <div className="text-sm text-gray-500">—</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {imageLoading[c.nim] ? (
        <div className="mt-8 h-48 w-36 animate-pulse rounded-md bg-gray-200 lg:h-60 lg:w-45" />
      ) : imageUrls[c.nim] ? (
        <img
          src={imageUrls[c.nim]}
          alt={c.nama}
          className="mx-auto mt-8 h-40 w-30 rounded-md object-cover lg:h-60 lg:w-45"
          style={{ objectPosition: "center center" }}
        />
      ) : c.foto && imageError[c.nim] ? (
        <div className="flex h-40 w-30 items-center justify-center rounded-md bg-red-100 text-xs text-red-600 lg:h-60 lg:w-45">
          Err
        </div>
      ) : c.foto ? (
        <img
          src={c.foto}
          alt={c.nama}
          className="mx-auto mt-8 h-40 w-30 rounded-md object-cover lg:h-60 lg:w-45"
          style={{ objectPosition: "center center" }}
        />
      ) : (
        <div className="h-40 w-30 rounded-md bg-gray-200 lg:h-60 lg:w-45" />
      )}

      <div className="mt-2 flex w-full flex-col items-center">
        <div className="text-base leading-5 font-medium">{c.nama}</div>
        <div className="text-xs text-gray-600">{c.jurusan}</div>
        <div className="mt-2">
          <button
            className="rounded bg-slate-100 px-3 py-1 text-sm hover:bg-slate-300"
            onClick={() => onSelect(c)}
            style={{ cursor: "pointer" }}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

const PairCard: React.FC<Props> = ({
  number,
  presma,
  wapresma,
  imageUrls,
  imageLoading,
  imageError,
  onSelect,
}) => {
  return (
    <div className="relative mt-8 rounded-xl bg-white p-4 shadow-lg transition hover:shadow-md">
      <div className="font-league absolute top-3 left-3 rounded-xl bg-[#102a71] px-2 py-0.5 text-lg font-bold text-white shadow">
        No {number}
      </div>

      <div className="mt-3 grid grid-cols-2 items-start gap-2">
        <div className="md:col-span-1">
          <CandidateCard
            c={presma}
            imageUrls={imageUrls}
            imageLoading={imageLoading}
            imageError={imageError}
            onSelect={onSelect}
          />
        </div>
        <div className="md:col-span-1">
          <CandidateCard
            c={wapresma}
            imageUrls={imageUrls}
            imageLoading={imageLoading}
            imageError={imageError}
            onSelect={onSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default PairCard;
