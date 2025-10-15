import { useState, useEffect, useRef } from "react";
import { LoaderCircle } from "lucide-react";
import FileInput from "./FileInput";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

type PositionType = "presma" | "wapresma" | "anggota_blm";

const jurusans = [
  "Akuntansi Sektor Publik STR AP",
  "D3 Akuntansi AP",
  "D3 Pajak AP",
  "D3 PBB/Penilai AP",
  "D3 Kepabeanan dan Cukai AP",
  "D3 Kebendaharaan Negara AP",
  "D3 Manajemen Aset AP",
  "Akuntansi Sektor Publik STR",
  "Manajemen Aset Publik STR",
  "Manajemen Keuangan Negara STR",
];

const dapilMap: Record<string, string> = {
  "Akuntansi Sektor Publik STR AP": "Dapil I",
  "D3 Akuntansi AP": "Dapil I",
  "D3 Pajak AP": "Dapil I",
  "D3 PBB/Penilai AP": "Dapil I",
  "D3 Kepabeanan dan Cukai AP": "Dapil I",
  "D3 Kebendaharaan Negara AP": "Dapil I",
  "D3 Manajemen Aset AP": "Dapil I",
  "Manajemen Keuangan Negara STR": "Dapil II",
  "Akuntansi Sektor Publik STR": "Dapil III",
  "Manajemen Aset Publik STR": "Dapil IV",
};

type Props = {
  defaultPosisi?: PositionType | "";
};

const RegistrationForm: React.FC<Props> = ({ defaultPosisi = "" }) => {
  const [posisi, setPosisi] = useState<PositionType | "">(defaultPosisi);
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [kelas, setKelas] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [dapil, setDapil] = useState("");
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [programKerja, setProgramKerja] = useState("");

  const [ktm, setKtm] = useState<File | null>(null);
  const [suratPernyataan, setSuratPernyataan] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [formulirDukungan, setFormulirDukungan] = useState<File | null>(null);
  const [formulirTim, setFormulirTim] = useState<File | null>(null);
  const [foto, setFoto] = useState<File | null>(null);
  const [linkVideo, setLinkVideo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState<string | null>(null);
  const nimRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const positions = [
    { value: "presma", label: "Presma" },
    { value: "wapresma", label: "Wapresma" },
    { value: "anggota_blm", label: "Anggota BLM" },
  ];

  // update dapil when jurusan changes (dapil is not editable)
  useEffect(() => {
    const newDapil = jurusan ? (dapilMap[jurusan] ?? "") : "";
    if (newDapil !== dapil) setDapil(newDapil);
  }, [jurusan, dapil]);

  function validateFile(file: File | null) {
    if (!file) return "File wajib diunggah";
    if (file.size > MAX_FILE_SIZE) return "Ukuran file maksimal 10 MB";
    return "";
  }

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (f: File | null) => void,
    fieldName?: string,
  ) {
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setter(f);

    // update foto preview if this is the foto field
    if (fieldName === "foto") {
      if (f) {
        const url = URL.createObjectURL(f);
        setFotoPreviewUrl(url);
      } else {
        setFotoPreviewUrl(null);
      }
    }

    // immediate size validation for better UX
    if (fieldName) {
      setErrors((prev) => {
        const next = { ...prev };
        if (!f) {
          // clear size-specific error for this field; presence validation happens in validate()
          delete next[fieldName];
        } else if (f.size > MAX_FILE_SIZE) {
          next[fieldName] = "Ukuran file maksimal 10 MB";
        } else {
          delete next[fieldName];
        }
        return next;
      });
    }
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!posisi) errs.posisi = "Pilih posisi";
    if (!nama) errs.nama = "Nama lengkap wajib diisi";
    if (!nim) errs.nim = "NIM wajib diisi";
    if (!kelas) errs.kelas = "Kelas wajib diisi";
    if (!jurusan) errs.jurusan = "Jurusan wajib diisi";
    if (!visi) errs.visi = "Visi wajib diisi";
    if (!misi) errs.misi = "Misi wajib diisi";

    // position-specific checks
    if (posisi === "presma" || posisi === "wapresma") {
      if (!programKerja) errs.programKerja = "Program kerja wajib diisi";
      const ktmErr = validateFile(ktm);
      if (ktmErr) errs.ktm = ktmErr;

      const suratErr = validateFile(suratPernyataan);
      if (suratErr) errs.suratPernyataan = suratErr;

      const cvErr = validateFile(cv);
      if (cvErr) errs.cv = cvErr;

      const dukunganErr = validateFile(formulirDukungan);
      if (dukunganErr) errs.formulirDukungan = dukunganErr;

      const timErr = validateFile(formulirTim);
      if (timErr) errs.formulirTim = timErr;

      const fotoErr = validateFile(foto);
      if (fotoErr) errs.foto = fotoErr;
    }

    if (posisi === "anggota_blm") {
      if (!dapil) errs.dapil = "Dapil wajib diisi";
      const ktmErr = validateFile(ktm);
      if (ktmErr) errs.ktm = ktmErr;

      const suratErr = validateFile(suratPernyataan);
      if (suratErr) errs.suratPernyataan = suratErr;

      const cvErr = validateFile(cv);
      if (cvErr) errs.cv = cvErr;

      const fotoErr = validateFile(foto);
      if (fotoErr) errs.foto = fotoErr;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Build FormData for multipart upload. Here we just log the content for demo.
    const data = new FormData();
    data.append("posisi", posisi);
    data.append("nama", nama);
    data.append("nim", nim);
    data.append("kelas", kelas);
    data.append("jurusan", jurusan);
    data.append("dapil", dapil);
    data.append("visi", visi);
    data.append("misi", misi);
    data.append("program_kerja", programKerja);
    if (ktm) data.append("ktm", ktm, ktm.name);
    if (suratPernyataan)
      data.append("surat_pernyataan", suratPernyataan, suratPernyataan.name);
    if (cv) data.append("cv", cv, cv.name);
    if (formulirDukungan)
      data.append(
        "formulir_pernyataan_dukungan",
        formulirDukungan,
        formulirDukungan.name,
      );
    if (formulirTim)
      data.append(
        "formulir_pendaftaran_tim_sukses",
        formulirTim,
        formulirTim.name,
      );
    if (linkVideo) data.append("link_video", linkVideo);
    if (foto) data.append("foto", foto, foto.name);

    // POST to server API
    (async () => {
      try {
        const res = await fetch("/api/daftar", {
          method: "POST",
          body: data,
        });
        const json = await res.json().catch(() => ({}));

        if (res.status === 409) {
          // duplicate NIM — show inline error on nim field and focus it
          const msg = (json && json.error) || "NIM sudah terdaftar";
          setErrors((prev) => ({ ...prev, nim: String(msg) }));
          setIsSubmitting(false);
          // focus the nim input for quick correction
          nimRef.current?.focus();
          return;
        }

        if (!res.ok || !json.success) {
          // show server-side validation errors if provided
          if (json && json.error) {
            // server returned single error message
            setErrors((prev) => ({ ...prev, server: String(json.error) }));
          } else {
            setErrors((prev) => ({
              ...prev,
              server: "Terjadi kesalahan saat mengirim",
            }));
          }
          setIsSubmitting(false);
          return;
        }

        // success — clear form (keep jurusan/dapil logic simple)
        setPosisi("");
        setNama("");
        setNim("");
        setKelas("");
        setJurusan("");
        setDapil("");
        setVisi("");
        setMisi("");
        setProgramKerja("");
        setKtm(null);
        setSuratPernyataan(null);
        setCv(null);
        setFormulirDukungan(null);
        setFormulirTim(null);
        setLinkVideo("");
        setFoto(null);
        if (fotoPreviewUrl) {
          URL.revokeObjectURL(fotoPreviewUrl);
          setFotoPreviewUrl(null);
        }
        setErrors({});
        setIsSubmitting(false);
        // show transient success message (do not shift focus)
        setSuccessMessage("Pendaftaran berhasil dikirim.");
        setTimeout(() => setSuccessMessage(null), 4000);
      } catch (err: unknown) {
        console.error("submit error", String(err));
        setErrors((prev) => ({
          ...prev,
          server: "Gagal mengirim pendaftaran",
        }));
        setIsSubmitting(false);
      }
    })();
  }

  // cleanup object URL when component unmounts or foto changes
  useEffect(() => {
    return () => {
      if (fotoPreviewUrl) URL.revokeObjectURL(fotoPreviewUrl);
    };
  }, [fotoPreviewUrl]);

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-[90vw] rounded-2xl bg-white p-6 shadow-lg lg:max-w-2/3"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium">
            Posisi yang dipilih
          </label>
          <select
            value={posisi}
            onChange={(e) => setPosisi(e.target.value as PositionType)}
            className="mt-2 w-full rounded-full bg-[#0b2b5a] px-5 py-3 text-sm text-white focus:outline-none lg:text-lg"
          >
            <option value="">-- Pilih Posisi --</option>
            {positions.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          {errors.posisi && (
            <div className="text-sm text-red-600">{errors.posisi}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Nama Lengkap</label>
          <input
            ref={nameRef}
            value={nama}
            onChange={(e) => {
              setNama(e.target.value);
              setErrors((prev) => {
                const next = { ...prev };
                delete next.server;
                return next;
              });
            }}
            className="mt-2 w-full rounded-full bg-[#0b2b5a] px-5 py-3 text-white focus:outline-none"
          />
          {errors.nama && (
            <div className="text-sm text-red-600">{errors.nama}</div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium">NIM</label>
            <input
              ref={nimRef}
              value={nim}
              onChange={(e) => {
                setNim(e.target.value);
                // clear nim-specific server error as user types
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.nim;
                  delete next.server;
                  return next;
                });
              }}
              className="mt-2 w-full rounded-full bg-[#0b2b5a] px-5 py-3 text-white focus:outline-none"
            />
            {errors.nim && (
              <div className="text-sm text-red-600">{errors.nim}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Kelas</label>
            <input
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="mt-2 w-full rounded-full bg-[#0b2b5a] px-5 py-3 text-white focus:outline-none"
            />
            {errors.kelas && (
              <div className="text-sm text-red-600">{errors.kelas}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Jurusan</label>
            <select
              value={jurusan}
              onChange={(e) => setJurusan(e.target.value)}
              className="mt-2 w-full rounded-full bg-[#0b2b5a] px-5 py-3 text-sm text-white focus:outline-none lg:text-lg"
            >
              <option value="">-- Pilih Jurusan --</option>
              {jurusans.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
            {errors.jurusan && (
              <div className="text-sm text-red-600">{errors.jurusan}</div>
            )}
          </div>
        </div>

        {/* Dapil — visible for anggota_blm */}
        {posisi === "anggota_blm" && (
          <div>
            <label className="block text-sm font-medium">Dapil</label>
            <input
              value={dapil}
              readOnly
              className="mt-2 w-full rounded-lg bg-[#0b2b5a] px-5 py-3 text-white focus:outline-none"
            />
            {errors.dapil && (
              <div className="text-sm text-red-600">{errors.dapil}</div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Visi</label>
          <textarea
            value={visi}
            onChange={(e) => setVisi(e.target.value)}
            className="mt-2 min-h-[80px] w-full rounded-lg bg-[#0b2b5a] px-5 py-3 text-white focus:outline-none"
          />
          {errors.visi && (
            <div className="text-sm text-red-600">{errors.visi}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Misi</label>
          <textarea
            value={misi}
            onChange={(e) => setMisi(e.target.value)}
            className="mt-2 min-h-[80px] w-full rounded-lg bg-[#0b2b5a] px-5 py-3 text-white focus:outline-none"
          />
          {errors.misi && (
            <div className="text-sm text-red-600">{errors.misi}</div>
          )}
        </div>

        {/* Program Kerja — only for presma/wapresma */}
        {(posisi === "presma" || posisi === "wapresma") && (
          <div>
            <label className="block text-sm font-medium">Program Kerja</label>
            <textarea
              value={programKerja}
              onChange={(e) => setProgramKerja(e.target.value)}
              className="mt-1 w-full rounded border bg-[#0b2b5a] px-3 py-2 text-white focus:outline-none"
            />
            {errors.programKerja && (
              <div className="text-sm text-red-600">{errors.programKerja}</div>
            )}
          </div>
        )}

        {/* File uploads — shared with some position-specific files */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            {/* KTM */}
            <FileInput
              id="ktm"
              label="Kartu Tanda Mahasiswa (KTM) — max 10MB"
              accept="image/*,application/pdf"
              file={ktm}
              onFileChange={(e) => handleFileChange(e, setKtm, "ktm")}
              error={errors.ktm}
            />
          </div>

          {/* Surat Pernyataan */}
          <div>
            <FileInput
              id="surat"
              label="Surat Pernyataan (Upload) — max 10MB"
              accept="application/pdf"
              file={suratPernyataan}
              onFileChange={(e) =>
                handleFileChange(e, setSuratPernyataan, "suratPernyataan")
              }
              showTemplate
              templateHref="#"
              templateText="Download template"
              error={errors.suratPernyataan}
            />
          </div>

          {/* Curriculum Vitae (CV) */}
          <div>
            <FileInput
              id="cv"
              label="Curriculum Vitae (CV) — max 10MB"
              accept="application/pdf"
              file={cv}
              onFileChange={(e) => handleFileChange(e, setCv, "cv")}
              error={errors.cv}
            />
          </div>

          {/* Formulir pernyataan dukungan — only for presma/wapresma */}
          {(posisi === "presma" || posisi === "wapresma") && (
            <div>
              <FileInput
                id="dukungan"
                label="Formulir Pernyataan Dukungan (Upload) — max 10MB"
                accept="application/pdf"
                file={formulirDukungan}
                onFileChange={(e) =>
                  handleFileChange(e, setFormulirDukungan, "formulirDukungan")
                }
                showTemplate
                templateHref="#"
                templateText="Download template"
                error={errors.formulirDukungan}
              />
            </div>
          )}

          {/* Formulir pendaftaran tim sukses — only for presma/wapresma */}
          {(posisi === "presma" || posisi === "wapresma") && (
            <div>
              <FileInput
                id="tim"
                label="Formulir Pendaftaran Tim Sukses (Upload) — max 10MB"
                accept="application/pdf"
                file={formulirTim}
                onFileChange={(e) =>
                  handleFileChange(e, setFormulirTim, "formulirTim")
                }
                showTemplate
                templateHref="#"
                templateText="Download template"
                error={errors.formulirTim}
              />
            </div>
          )}

          {/* Pas Foto 4x6 */}
          <div>
            <FileInput
              id="foto"
              label="Pas Foto 4x6 — max 10MB"
              accept="image/*"
              file={foto}
              previewUrl={fotoPreviewUrl}
              onFileChange={(e) => handleFileChange(e, setFoto, "foto")}
              error={errors.foto}
            />
          </div>
        </div>
        {/* note about max file size (uses formatFileSize to avoid unused warning) */}
        <div className="text-sm text-gray-300">
          Ukuran maksimal berkas: {formatFileSize(MAX_FILE_SIZE)}
        </div>
        <div>
          <label className="block text-sm font-medium">
            Tautan Video Perkenalan
          </label>
          <input
            value={linkVideo}
            onChange={(e) => setLinkVideo(e.target.value)}
            className="mt-2 w-full rounded-full bg-[#0b2b5a] px-5 py-3 text-white focus:outline-none"
            placeholder="https://youtube.com/..."
          />
        </div>
        {/* transient success message */}
        {successMessage && (
          <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
            {successMessage}
          </div>
        )}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-6 w-40 rounded-full py-3 font-bold text-[#23408e] ${isSubmitting ? "cursor-not-allowed bg-[#f0d97a] opacity-60" : "bg-[#fed258] hover:opacity-90"}`}
            style={{ cursor: "pointer" }}
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <LoaderCircle className="h-4 w-4 animate-spin text-[#23408e]" />
                Mengirim...
              </span>
            ) : (
              "SUBMIT"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;
