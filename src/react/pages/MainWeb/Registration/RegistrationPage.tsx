import React, { useEffect, useState } from "react";
import RegistrationForm from "../../../components/MainWeb/Registration/RegistrationForm";
import AnimatedContent from "../../../components/MainWeb/Common/AnimatedContent";
import PopupSK from "../../../components/MainWeb/Registration/PopupSK";

const RegistrationPage: React.FC = () => {
  const [showSK, setShowSK] = useState(false);

  // show when opened /daftar
  useEffect(() => {
    try {
      const confirmed =
        typeof window !== "undefined"
          ? localStorage.getItem("popup_sk_confirmed")
          : null;
      if (!confirmed) setShowSK(true);
    } catch (e) {
      // if localStorage is unavailable, fall back to showing the popup
      setShowSK(true);
    }
  }, []);

  return (
    <main className="mx-auto mt-8 w-full bg-[url('/src/react/assets/MainWeb/bg1.webp')] bg-cover bg-top bg-no-repeat px-4 py-16 text-left">
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

      <PopupSK
        isOpen={showSK}
        onConfirm={() => {
          try {
            if (typeof window !== "undefined")
              localStorage.setItem("popup_sk_confirmed", "1");
          } catch (e) {}
          setShowSK(false);
        }}
      />
    </main>
  );
};

export default RegistrationPage;
