import { useState } from "react";

type Props = {
  isOpen: boolean;
  onConfirm?: () => void;
};

export default function PopupSK({ isOpen, onConfirm }: Props) {
  const [checked, setChecked] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-100/70 p-6 backdrop-blur-sm">
      <div className="relative h-[90vh] w-[80vw]">
        <div className="h-full rounded-3xl bg-teal-100">
          <div className="h-full overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="h-full overflow-auto px-8 py-4">
              <h2 className="font-league mt-2 text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Syarat & Ketentuan
              </h2>

              <div className="font-poppins mt-8 grid gap-6 text-sm text-slate-700 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">
                    Calon Presma &amp; Wapresma
                  </h3>
                  <ol className="mt-2 list-decimal space-y-0.5 pl-5 text-sm">
                    <li>
                      Calon Presma dan Wapresma dipilih dalam 1 (satu) pasangan
                      secara langsung
                    </li>
                    <li>Mahasiswa aktif PKN STAN</li>
                    <li>Bertakwa kepada Tuhan Yang Maha Esa</li>
                    <li>
                      Mampu menjalankan tugasnya, berwibawa, dan bermoral baik
                    </li>
                    <li>
                      Memiliki dedikasi dan loyalitas tinggi terhadap organisasi
                    </li>
                    <li>
                      Syarat akademik:
                      <ul className="mt-1 list-disc pl-5">
                        <li>
                          Calon untuk Presiden: Mahasiswa luluh/mahasiswa
                          program studi Diploma IV Alih Program minimal semester
                          7, program studi Diploma III Alih Program minimal
                          semester 3, atau Diploma IV reguler minimal semester 3
                        </li>
                        <li>
                          Calon untuk Wakil Presiden: Mahasiswa luluh/mahasiswa
                          program studi Diploma IV Alih Program minimal semester
                          7, Diploma IV Reguler minimal semester 3, atau Diploma
                          III Alih Program minimal semester 3
                        </li>
                      </ul>
                    </li>
                    <li>
                      Memperoleh dukungan minimal 50 mahasiswa dari seluruh
                      mahasiswa PKN STAN
                    </li>
                    <li>
                      Melengkapi seluruh dokumen persyaratan sebagaimana dalam
                      Peraturan PPR nomor PER-01 Tahun 2024 tentang Pencalonan
                      Peserta Pemilihan Raya Presiden dan Wakil Presiden
                      Mahasiswa.
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">
                    Calon Anggota BLM
                  </h3>
                  <ol className="list-decimal space-y-0.5 pl-5 text-sm">
                    <li>
                      Calon anggota BLM adalah perorangan, perwakilan dari
                      mahasiswa setiap angkatan dan prodi
                    </li>
                    <li>Mahasiswa aktif PKN STAN</li>
                    <li>Bertakwa kepada Tuhan Yang Maha Esa</li>
                    <li>
                      Mampu menjalankan tugasnya, berwibawa, dan bermoral baik
                    </li>
                    <li>
                      Memiliki dedikasi dan loyalitas tinggi terhadap organisasi
                    </li>
                    <li>
                      Syarat akademik:
                      <ul className="mt-1 list-disc pl-5">
                        <li>
                          Calon anggota BLM yang berasal dari program Diploma
                          III Alih Program minimal semester 3, Diploma IV Alih
                          Program minimal semester 7, dan Diploma IV Reguler
                          minimal semester 1
                        </li>
                      </ul>
                    </li>
                    <li>
                      Melengkapi seluruh dokumen persyaratan sebagaimana dalam
                      Peraturan PPR PKN STAN nomor PER-02 Tahun 2024 tentang
                      Pencalonan Peserta Pemilihan Raya Anggota Badan Legislatif
                      Mahasiswa.
                    </li>
                  </ol>
                </div>
              </div>

              <div className="mt-2 border-t pt-3">
                <div className="justify-left flex items-center gap-4">
                  <button
                    onClick={() => setChecked((v) => !v)}
                    aria-pressed={checked}
                    style={{ cursor: "pointer" }}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                      checked
                        ? "bg-emerald-100"
                        : "border border-slate-200 bg-white"
                    }`}
                  >
                    {checked ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="12" cy="12" r="12" fill="#16A34A" />
                        <path
                          d="M7 13l3 3 7-7"
                          stroke="#fff"
                          strokeWidth={2.2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="0.5"
                          y="0.5"
                          width="23"
                          height="23"
                          rx="6"
                          stroke="#E5E7EB"
                        />
                      </svg>
                    )}
                  </button>

                  <div className="text-left text-sm font-medium text-slate-800">
                    <span className="font-bold">Saya telah membaca</span> dan{" "}
                    <span className="font-bold">siap memenuhi</span> seluruh
                    persyaratan yang berlaku
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => {
                      if (!checked) return;
                      onConfirm?.();
                    }}
                    className={`inline-flex items-center justify-center rounded-full px-10 py-3 font-bold shadow-sm transition-colors disabled:opacity-50 ${
                      checked
                        ? "cursor-pointer bg-amber-400 text-slate-900 hover:bg-amber-500"
                        : "cursor-not-allowed bg-amber-200 text-slate-700"
                    }`}
                    disabled={!checked}
                  >
                    KONFIRMASI
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
