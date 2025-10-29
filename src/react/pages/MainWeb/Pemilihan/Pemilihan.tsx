import React from "react";
import Card from "../../../components/MainWeb/Pemilihan/Card";
import AnimatedContent from "../../../components/MainWeb/Common/AnimatedContent";

const Pemilihan: React.FC = () => {
  return (
    <div className="mx-auto mt-12 w-full items-center justify-center bg-[url('/src/react/assets/MainWeb/bg1.webp')] bg-cover bg-top bg-no-repeat px-0 py-16">
      <AnimatedContent
        distance={150}
        direction="vertical"
        duration={1}
        delay={0.2}
      >
        <div className="mx-auto mb-8 w-[90vw] lg:w-[60vw]">
          <div className="font-league rounded-xl bg-white py-3 text-center text-2xl font-bold text-[#002a45] shadow">
            INFORMASI PEMULIHAN
          </div>
        </div>
        <div className="mx-auto flex w-[90vw] flex-col justify-center gap-6 lg:w-[60vw] lg:flex-row">
          <Card
            header="Onsite"
            content={
              <>
                Untuk mahasiswa reguler, alih program non magang, dan non
                blended learning silakan menuju{" "}
                <span className="font-bold">Gedung N lantai 1 ruang UPLB</span>{" "}
                untuk melakukan pemilihan Capresma, Cawapresma, dan calon
                anggota BLM secara langsung.
                <br />
                <br />
                Pastikan membawa:
                <br />
                <span className="font-bold">KTM yang masih berlaku</span>
                <br />
                <br />
                *Jam operasional masing-masing kelas dapat dilaksanakan melalui
                link di bawah ini:
              </>
            }
            buttonText="JADWAL PEMILIHAN PER KELAS"
            link="/jadwal"
          />
          <Card
            header="Online"
            content={
              <>
                Untuk mahasiswa alih program semester 9 (magang) dan blended
                learning, silakan mengisi formulir pemilihan secara online
                melalui link di bawah ini:
                <br />
                <br />
                *Form akan aktif selama periode pemilihan berlangsung.
              </>
            }
            buttonText="ISI FORM PEMILIHAN"
            link="www.google.com"
          />
        </div>
      </AnimatedContent>
    </div>
  );
};

export default Pemilihan;
