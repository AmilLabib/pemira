import bg1 from "../../../assets/WebVote/bg1.webp";
import cert from "../../../assets/WebVote/sertif1.png";
import Header from "../../../components/WebVote/Sertif/Header";

function Sertif() {
  return (
    <div
      className="min-h-screen w-full justify-center bg-cover bg-center py-4"
      style={{ backgroundImage: `url(${bg1})` }}
    >
      <Header />
      <div className="mx-auto mt-4 w-[90vw] items-center bg-[#102a71]/60 px-4 py-6 lg:w-[65vw] lg:px-24">
        <h1 className="font-league text-center text-lg font-extrabold text-[#ffd358] lg:text-3xl">
          Sertifikat E-Voting
        </h1>
        <p className="font-poppins my-2 text-center text-sm text-white lg:text-base">
          Terima Kasih atas partisipasi Anda dalam Pemilihan Raya 2025
        </p>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-md">
          <img
            src={cert}
            alt="certificate"
            className="inset-0 w-2/3 object-contain"
          />
          <p className="font-poppins mt-4 text-xs text-white lg:text-sm">
            • Sertifikat akan dikirim ke email masing-masing mahasiswa pada
            pengumuman selanjutnya
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => (window.location.href = "/voting")}
            className="font-poppins rounded-full bg-yellow-300 px-6 py-3 font-bold text-[#102a71] shadow hover:brightness-80"
            style={{ cursor: "pointer" }}
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sertif;
