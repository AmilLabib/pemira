import React, { useEffect, useState } from "react";
import RegistrationForm from "../../components/Registration/RegistrationForm";
import AnimatedContent from "../../components/Common/AnimatedContent";
import PopupSK from "../../components/Registration/PopupSK";

const RegistrationPage: React.FC = () => {
  const [showSK, setShowSK] = useState(false);

  // show when opened /daftar
  useEffect(() => {
    setShowSK(true);
  }, []);

  return (
    <main className="container mx-auto mt-8 bg-[url('/src/react/assets/bg1.webp')] bg-cover bg-center bg-no-repeat px-4 py-16 text-left">
      <AnimatedContent
        distance={150}
        direction="vertical"
        duration={1}
        delay={0.2}
      >
        <div className="font-league mx-auto mb-4 w-[90vw] rounded-xl bg-white py-3 text-center text-2xl font-bold text-[#002a45] shadow lg:w-1/2">
          Pendaftaran Bakal Calon PEMIRA 2026
        </div>
      </AnimatedContent>
      <AnimatedContent
        distance={150}
        direction="vertical"
        duration={1}
        delay={0.2}
      >
        <RegistrationForm />
      </AnimatedContent>

      <PopupSK isOpen={showSK} onConfirm={() => setShowSK(false)} />
    </main>
  );
};

export default RegistrationPage;
