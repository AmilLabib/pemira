const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-16 pt-28"
    >
      <div className="container mx-auto px-4 flex flex-col items-center text-center gap-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
          Selamat Datang di PEMIRA PKN STAN
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-4">
          Pemilihan Raya Mahasiswa PKN STAN 2025. Pilih calon terbaikmu dan
          wujudkan demokrasi kampus yang sehat, jujur, dan transparan.
        </p>
        <a
          href="#daftar-calon"
          className="inline-block px-8 py-3 bg-rose-600 hover:bg-rose-700 rounded-full font-semibold text-white shadow-lg transition-colors duration-200"
        >
          Lihat Daftar Calon
        </a>
      </div>
    </section>
  );
};

export default Hero;
