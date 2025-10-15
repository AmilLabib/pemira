import React from "react";
import RegistrationForm from "../../components/Registration/RegistrationForm";
import AnimatedContent from "../../components/Common/AnimatedContent";

const RegistrationPage: React.FC = () => {
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
    </main>
  );
};

export default RegistrationPage;
