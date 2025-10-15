import React from "react";
import Tabel from "../../components/Jadwal/Tabel";
import jadwals from "../../data/jadwals";

const Jadwal: React.FC = () => {
  return (
    <div className="container mx-auto mt-12 items-center justify-center bg-[url('/src/react/assets/bg1.webp')] bg-cover bg-center bg-no-repeat px-4 py-16">
      <div className="rounded-t-xl bg-[#143b8a] px-6 pt-4 pb-2">
        <h2 className="text-2xl font-bold text-white">Data Jadwal Per Kelas</h2>
        <p className="mt-1 text-xs text-white">
          *Silakan melakukan pemilihan sesuai jam yg ditetapkan, tetapi jika ada
          kelas silakan menyesuaikan
        </p>
      </div>
      <div className="rounded-b-xl bg-white px-6 pb-6 shadow-lg">
        <Tabel data={jadwals} />
      </div>
    </div>
  );
};

export default Jadwal;
