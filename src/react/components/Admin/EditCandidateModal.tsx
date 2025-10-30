import { useEffect, useState } from "react";
import { API_BASE } from "../../lib/api";

type Candidate = {
  posisi: string;
  nama: string;
  nim: string;
  kelas?: string | null;
  jurusan?: string | null;
  dapil?: string | null;
  visi?: string | null;
  misi?: string | null;
  program_kerja?: string | null;
  ktm?: string | null;
  surat_pernyataan?: string | null;
  cv?: string | null;
  formulir_pernyataan_dukungan?: string | null;
  formulir_pendaftaran_tim_sukses?: string | null;
  link_video?: string | null;
  foto?: string | null;
  is_verified?: number;
  ticket_number?: number | null;
};

type Props = {
  open: boolean;
  candidate: Candidate | null;
  onClose: () => void;
  onSave: (nim: string, updated: Partial<Candidate>) => Promise<void> | void;
};

export default function EditCandidateModal({
  open,
  candidate,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<Partial<Candidate>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (candidate) setForm({ ...candidate });
    else setForm({});
  }, [candidate]);

  if (!open || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative z-10 h-[80vh] w-[90vw] max-w-3xl overflow-y-scroll rounded bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Edit Candidate — {candidate.nama}
          </h2>
          <button className="rounded bg-gray-200 px-2 py-1" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Nama</label>
            <input
              className="mt-1 w-full rounded border px-2 py-2"
              value={form.nama ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">NIM</label>
            <input
              className="mt-1 w-full rounded border px-2 py-2"
              value={form.nim ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, nim: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Posisi</label>
            <input
              className="mt-1 w-full rounded border px-2 py-2"
              value={form.posisi ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, posisi: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Kelas</label>
            <input
              className="mt-1 w-full rounded border px-2 py-2"
              value={form.kelas ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, kelas: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Jurusan</label>
            <input
              className="mt-1 w-full rounded border px-2 py-2"
              value={form.jurusan ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, jurusan: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Dapil</label>
            <input
              className="mt-1 w-full rounded border px-2 py-2"
              value={form.dapil ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, dapil: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Ticket Number</label>
            <input
              type="number"
              className="mt-1 w-full rounded border px-2 py-2"
              value={form.ticket_number ?? ("" as any)}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  ticket_number:
                    e.target.value === "" ? null : Number(e.target.value),
                }))
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Link Video</label>
            <input
              className="mt-1 w-full rounded border px-2 py-2"
              value={form.link_video ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, link_video: e.target.value }))
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Visi</label>
            <textarea
              className="mt-1 w-full rounded border px-2 py-2"
              value={form.visi ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, visi: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Misi</label>
            <textarea
              className="mt-1 w-full rounded border px-2 py-2"
              value={form.misi ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, misi: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Program Kerja</label>
            <textarea
              className="mt-1 w-full rounded border px-2 py-2"
              value={form.program_kerja ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, program_kerja: e.target.value }))
              }
            />
          </div>

          {/* File inputs for re-uploading files */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium">
              Replace files (optional)
            </label>
            <div className="mt-1 grid grid-cols-1 gap-2 md:grid-cols-2">
              <div>
                <div className="text-sm">Foto</div>
                <div className="mt-1 flex items-center gap-2">
                  <label
                    htmlFor="file-foto"
                    className="cursor-pointer rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                  >
                    Choose file
                  </label>
                  <span className="text-xs text-slate-600">
                    {files.foto?.name ?? (form.foto ? "Existing" : "No file")}
                  </span>
                  <input
                    id="file-foto"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setFiles((f) => ({
                        ...f,
                        foto: e.target.files?.[0] ?? null,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <div className="text-sm">KTM</div>
                <div className="mt-1 flex items-center gap-2">
                  <label
                    htmlFor="file-ktm"
                    className="cursor-pointer rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                  >
                    Choose file
                  </label>
                  <span className="text-xs text-slate-600">
                    {files.ktm?.name ?? (form.ktm ? "Existing" : "No file")}
                  </span>
                  <input
                    id="file-ktm"
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setFiles((f) => ({
                        ...f,
                        ktm: e.target.files?.[0] ?? null,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <div className="text-sm">CV</div>
                <div className="mt-1 flex items-center gap-2">
                  <label
                    htmlFor="file-cv"
                    className="cursor-pointer rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                  >
                    Choose file
                  </label>
                  <span className="text-xs text-slate-600">
                    {files.cv?.name ?? (form.cv ? "Existing" : "No file")}
                  </span>
                  <input
                    id="file-cv"
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setFiles((f) => ({
                        ...f,
                        cv: e.target.files?.[0] ?? null,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <div className="text-sm">Surat Pernyataan</div>
                <div className="mt-1 flex items-center gap-2">
                  <label
                    htmlFor="file-surat"
                    className="cursor-pointer rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                  >
                    Choose file
                  </label>
                  <span className="text-xs text-slate-600">
                    {files.surat_pernyataan?.name ??
                      (form.surat_pernyataan ? "Existing" : "No file")}
                  </span>
                  <input
                    id="file-surat"
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setFiles((f) => ({
                        ...f,
                        surat_pernyataan: e.target.files?.[0] ?? null,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <div className="text-sm">Formulir Dukungan</div>
                <div className="mt-1 flex items-center gap-2">
                  <label
                    htmlFor="file-dukungan"
                    className="cursor-pointer rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                  >
                    Choose file
                  </label>
                  <span className="text-xs text-slate-600">
                    {files.formulir_pernyataan_dukungan?.name ??
                      (form.formulir_pernyataan_dukungan
                        ? "Existing"
                        : "No file")}
                  </span>
                  <input
                    id="file-dukungan"
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setFiles((f) => ({
                        ...f,
                        formulir_pernyataan_dukungan:
                          e.target.files?.[0] ?? null,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <div className="text-sm">Formulir Tim</div>
                <div className="mt-1 flex items-center gap-2">
                  <label
                    htmlFor="file-tim"
                    className="cursor-pointer rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                  >
                    Choose file
                  </label>
                  <span className="text-xs text-slate-600">
                    {files.formulir_pendaftaran_tim_sukses?.name ??
                      (form.formulir_pendaftaran_tim_sukses
                        ? "Existing"
                        : "No file")}
                  </span>
                  <input
                    id="file-tim"
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setFiles((f) => ({
                        ...f,
                        formulir_pendaftaran_tim_sukses:
                          e.target.files?.[0] ?? null,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-4 flex items-center justify-center gap-2">
          <button
            className="rounded bg-gray-200 px-3 py-1 hover:opacity-80"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            className="rounded bg-sky-600 px-3 py-1 text-white hover:opacity-80"
            onClick={async () => {
              if (!candidate) return;
              setUploading(true);
              try {
                const hasFiles = Object.values(files).some(Boolean);
                let mergedForm = { ...form } as any;
                if (hasFiles) {
                  const fd = new FormData();
                  for (const k of Object.keys(files)) {
                    const f = (files as any)[k] as File | null;
                    if (f) fd.append(k, f);
                  }
                  const res = await fetch(
                    `${API_BASE}/api/admin/bakal_calon/${encodeURIComponent(
                      candidate.nim,
                    )}/upload`,
                    {
                      method: "POST",
                      credentials: "include",
                      body: fd,
                    },
                  );
                  const text = await res.text();
                  if (!res.ok) {
                    alert(
                      `Upload failed: ${res.status} ${res.statusText}\n${text}`,
                    );
                    return;
                  }
                  let json: any = null;
                  try {
                    json = text ? JSON.parse(text) : null;
                  } catch (e) {}
                  if (!(json && json.success)) {
                    alert(
                      "Upload failed: " + (json?.error || text || "unknown"),
                    );
                    return;
                  }
                  mergedForm = { ...mergedForm, ...(json.result || {}) };
                  setFiles({});
                }

                await onSave(candidate.nim, mergedForm);
              } catch (err) {
                console.error(err);
                alert("Save failed: " + String(err));
              } finally {
                setUploading(false);
              }
            }}
            style={{ cursor: "pointer" }}
            disabled={uploading}
          >
            {uploading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
