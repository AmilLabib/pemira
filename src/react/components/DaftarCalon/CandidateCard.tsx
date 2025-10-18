import React from "react";

type Candidate = {
  posisi: string;
  nama: string;
  nim: string;
  kelas: string;
  jurusan: string;
  dapil: string;
  visi: string;
  misi: string;
  program_kerja: string;
  ktm: string;
  surat_pernyataan: string;
  cv: string;
  formulir_pernyataan_dukungan: string;
  formulir_pendaftaran_tim_sukses: string;
  link_video: string;
  foto: string;
  is_verified: number;
};

type Props = {
  candidate: Candidate;
  onToggleVerify: (nim: string) => void;
  onDelete: (nim: string) => Promise<void> | void;
  onOpenFile: (key: string) => Promise<void> | void;
  fetchingKey?: string | null;
};

const CandidateCard: React.FC<Props> = ({
  candidate: c,
  onToggleVerify,
  onDelete,
  onOpenFile,
  fetchingKey,
}) => {
  return (
    <div className="rounded border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg font-semibold">
            {c.nama} — {c.posisi}
          </div>
          <div className="text-sm text-slate-600">
            NIM: {c.nim} • Kelas: {c.kelas} • Jurusan: {c.jurusan}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            className={`rounded px-3 py-1 text-white ${
              c.is_verified ? "bg-green-600" : "bg-slate-600"
            }`}
            onClick={() => onToggleVerify(c.nim)}
          >
            {c.is_verified ? "Verified" : "Verify"}
          </button>

          <button
            className="rounded bg-red-600 px-3 py-1 text-white"
            onClick={() => onDelete(c.nim)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
        <div>
          <div className="text-sm font-medium">Visi</div>
          <div className="text-sm whitespace-pre-wrap">{c.visi}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Misi</div>
          <div className="text-sm whitespace-pre-wrap">{c.misi}</div>
        </div>
      </div>

      {c.program_kerja && (
        <div className="mt-3">
          <div className="text-sm font-medium">Program Kerja</div>
          <div className="text-sm whitespace-pre-wrap">{c.program_kerja}</div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        {c.ktm && (
          <button
            className="text-sky-600 underline"
            onClick={() => onOpenFile(c.ktm)}
            disabled={Boolean(fetchingKey)}
          >
            {fetchingKey === c.ktm ? "Loading…" : "KTM"}
          </button>
        )}

        {c.surat_pernyataan && (
          <button
            className="text-sky-600 underline"
            onClick={() => onOpenFile(c.surat_pernyataan)}
            disabled={Boolean(fetchingKey)}
          >
            {fetchingKey === c.surat_pernyataan ? "Loading…" : "Surat"}
          </button>
        )}

        {c.cv && (
          <button
            className="text-sky-600 underline"
            onClick={() => onOpenFile(c.cv)}
            disabled={Boolean(fetchingKey)}
          >
            {fetchingKey === c.cv ? "Loading…" : "CV"}
          </button>
        )}

        {c.formulir_pernyataan_dukungan && (
          <button
            className="text-sky-600 underline"
            onClick={() => onOpenFile(c.formulir_pernyataan_dukungan)}
            disabled={Boolean(fetchingKey)}
          >
            {fetchingKey === c.formulir_pernyataan_dukungan
              ? "Loading…"
              : "Formulir Dukungan"}
          </button>
        )}

        {c.formulir_pendaftaran_tim_sukses && (
          <button
            className="text-sky-600 underline"
            onClick={() => onOpenFile(c.formulir_pendaftaran_tim_sukses)}
            disabled={Boolean(fetchingKey)}
          >
            {fetchingKey === c.formulir_pendaftaran_tim_sukses
              ? "Loading…"
              : "Formulir Tim"}
          </button>
        )}

        {c.foto && (
          <button
            className="text-sky-600 underline"
            onClick={() => onOpenFile(c.foto)}
            disabled={Boolean(fetchingKey)}
          >
            {fetchingKey === c.foto ? "Loading…" : "Foto"}
          </button>
        )}

        {c.link_video && (
          <a
            className="text-sky-600"
            target="_blank"
            rel="noreferrer"
            href={c.link_video}
          >
            Video
          </a>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;
