import React from "react";
import Card from "./Card";

const Tugas: React.FC = () => {
  return (
    <div
      className="grid w-[90vw] grid-cols-1 gap-6 pb-8 md:grid-cols-2 lg:w-[65vw]"
      style={{ marginLeft: "auto", marginRight: "auto" }}
    >
      <Card
        title={
          <div>
            Tugas
            <br />
            Badan Eksekutif Mahasiswa
          </div>
        }
        items={[
          "Merencanakan dan melaksanakan kegiatan Ormawa PKN STAN",
          "Mengoordinasikan seluruh kegiatan dan keuangan BK Ormawa PKN STAN",
          "Melakukan pembinaan terhadap Unit Kegiatan Mahasiswa",
          "Mengelola Barang Milik Ormawa PKN STAN",
        ]}
      />

      <Card
        title={
          <div>
            Tugas
            <br />
            Badan Legislatif Mahasiswa
          </div>
        }
        items={[
          "Menyelenggarakan RAKM",
          "Melakukan penyusunan dan penetapan peraturan Ormawa PKN STAN",
          "Melakukan pembahasan dan penetapan peraturan anggaran Ormawa PKN STAN",
          "Mensosialisasikan produk hukum BLM",
          "Melakukan perencanaan dan pelaksanaan pengawasan terhadap program dan kegiatan",
          "Membentuk PPR dan menindaklanjuti aspirasi mahasiswa",
        ]}
      />
    </div>
  );
};

export default Tugas;
