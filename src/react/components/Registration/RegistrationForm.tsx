import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";

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
        const res = await fetch("/api/registrations", {
          method: "POST",
          body: data,
        });
        const json = await res.json();
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
        alert("Pendaftaran berhasil dikirim.");
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Posisi yang dipilih</label>
        <select
          value={posisi}
          onChange={(e) => setPosisi(e.target.value as PositionType)}
          className="mt-1 w-full rounded border px-3 py-2"
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
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
        />
        {errors.nama && (
          <div className="text-sm text-red-600">{errors.nama}</div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium">NIM</label>
          <input
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
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
            className="mt-1 w-full rounded border px-3 py-2"
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
            className="mt-1 w-full rounded border px-3 py-2"
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
            className="mt-1 w-full rounded border bg-slate-50 px-3 py-2"
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
          className="mt-1 w-full rounded border px-3 py-2"
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
          className="mt-1 w-full rounded border px-3 py-2"
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
            className="mt-1 w-full rounded border px-3 py-2"
          />
          {errors.programKerja && (
            <div className="text-sm text-red-600">{errors.programKerja}</div>
          )}
        </div>
      )}

      {/* File uploads — shared with some position-specific files */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">
            Kartu Tanda Mahasiswa (KTM) — max 10MB
          </label>
          <div className="mt-1 flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange(e, setKtm, "ktm")}
                className="sr-only"
              />
              <span>Choose file</span>
            </label>
            <div className="text-sm text-slate-600">
              {ktm ? (
                `${ktm.name} (${formatFileSize(ktm.size)})`
              ) : (
                <span className="text-slate-400">No file selected</span>
              )}
            </div>
          </div>
          {errors.ktm && (
            <div className="text-sm text-red-600">{errors.ktm}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">
            Surat Pernyataan (Upload) — max 10MB
          </label>
          <div className="mt-1 flex items-center gap-3">
            <a
              className="text-sm text-sky-600"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Download template
            </a>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  handleFileChange(e, setSuratPernyataan, "suratPernyataan")
                }
                className="sr-only"
              />
              <span>Choose file</span>
            </label>
            <div className="text-sm text-slate-600">
              {suratPernyataan ? (
                `${suratPernyataan.name} (${formatFileSize(suratPernyataan.size)})`
              ) : (
                <span className="text-slate-400">No file selected</span>
              )}
            </div>
          </div>
          {errors.suratPernyataan && (
            <div className="text-sm text-red-600">{errors.suratPernyataan}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">
            Curriculum Vitae (CV) — max 10MB
          </label>
          <div className="mt-1 flex items-center gap-3">
            <a
              className="text-sm text-sky-600"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Download template
            </a>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e, setCv, "cv")}
                className="sr-only"
              />
              <span>Choose file</span>
            </label>
            <div className="text-sm text-slate-600">
              {cv ? (
                `${cv.name} (${formatFileSize(cv.size)})`
              ) : (
                <span className="text-slate-400">No file selected</span>
              )}
            </div>
          </div>
          {errors.cv && <div className="text-sm text-red-600">{errors.cv}</div>}
        </div>

        {/* Formulir pernyataan dukungan — only for presma/wapresma */}
        {(posisi === "presma" || posisi === "wapresma") && (
          <div>
            <label className="block text-sm font-medium">
              Formulir Pernyataan Dukungan (Upload) — max 10MB
            </label>
            <div className="mt-1 flex items-center gap-3">
              <a
                className="text-sm text-sky-600"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Download template
              </a>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    handleFileChange(e, setFormulirDukungan, "formulirDukungan")
                  }
                  className="sr-only"
                />
                <span>Choose file</span>
              </label>
              <div className="text-sm text-slate-600">
                {formulirDukungan ? (
                  `${formulirDukungan.name} (${formatFileSize(formulirDukungan.size)})`
                ) : (
                  <span className="text-slate-400">No file selected</span>
                )}
              </div>
            </div>
            {errors.formulirDukungan && (
              <div className="text-sm text-red-600">
                {errors.formulirDukungan}
              </div>
            )}
          </div>
        )}

        {/* Formulir pendaftaran tim sukses — only for presma/wapresma */}
        {(posisi === "presma" || posisi === "wapresma") && (
          <div>
            <label className="block text-sm font-medium">
              Formulir Pendaftaran Tim Sukses (Upload) — max 10MB
            </label>
            <div className="mt-1 flex items-center gap-3">
              <a
                className="text-sm text-sky-600"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Download template
              </a>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    handleFileChange(e, setFormulirTim, "formulirTim")
                  }
                  className="sr-only"
                />
                <span>Choose file</span>
              </label>
              <div className="text-sm text-slate-600">
                {formulirTim ? (
                  `${formulirTim.name} (${formatFileSize(formulirTim.size)})`
                ) : (
                  <span className="text-slate-400">No file selected</span>
                )}
              </div>
            </div>
            {errors.formulirTim && (
              <div className="text-sm text-red-600">{errors.formulirTim}</div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">
            Pas Foto 4x6 — max 10MB
          </label>
          <div className="mt-1 flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setFoto, "foto")}
                className="sr-only"
              />
              <span>Choose file</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600">
                {foto ? (
                  `${foto.name} (${formatFileSize(foto.size)})`
                ) : (
                  <span className="text-slate-400">No file selected</span>
                )}
              </div>
              {fotoPreviewUrl && (
                <img
                  src={fotoPreviewUrl}
                  alt="Preview foto"
                  className="h-20 w-20 rounded object-cover"
                />
              )}
            </div>
          </div>
          {errors.foto && (
            <div className="text-sm text-red-600">{errors.foto}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">
            Tautan Video Perkenalan
          </label>
          <input
            value={linkVideo}
            onChange={(e) => setLinkVideo(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="https://youtube.com/..."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`rounded px-4 py-2 text-white ${isSubmitting ? "cursor-not-allowed bg-slate-400" : "bg-sky-600 hover:bg-sky-700"}`}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle className="h-4 w-4 animate-spin text-white" />
              Mengirim...
            </span>
          ) : (
            "Kirim Pendaftaran"
          )}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;
