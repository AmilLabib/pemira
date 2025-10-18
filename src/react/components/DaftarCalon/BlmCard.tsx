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
};

type Props = {
  candidate: Candidate;
  imageUrls: Record<string, string>;
  imageLoading: Record<string, boolean>;
  imageError: Record<string, boolean>;
  onSelect: (c: Candidate) => void;
};

const BlmCard: React.FC<Props> = ({
  candidate: c,
  imageUrls,
  imageLoading,
  imageError,
  onSelect,
}) => {
  return (
    <div className="flex flex-col items-start gap-3 rounded bg-white p-3 shadow-xl">
      <div className="flex w-full items-center gap-3">
        {imageLoading[c.nim] ? (
          <div className="h-28 w-21 animate-pulse rounded-md bg-gray-200" />
        ) : imageUrls[c.nim] ? (
          <img
            src={imageUrls[c.nim]}
            alt={c.nama}
            className="h-28 w-21 rounded-md object-cover"
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
            className="h-28 w-21 rounded-md object-cover"
            style={{ objectPosition: "center center" }}
          />
        ) : (
          <div className="h-28 w-21 rounded-md bg-gray-200" />
        )}

        <div className="flex-1">
          <div className="font-medium">{c.nama}</div>
          <div className="text-sm text-gray-600">{c.kelas ?? "-"}</div>
        </div>
      </div>

      <div className="flex w-full justify-end">
        <button
          className="rounded bg-slate-100 px-2 py-1 text-sm"
          onClick={() => onSelect(c)}
          style={{ cursor: "pointer" }}
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default BlmCard;
