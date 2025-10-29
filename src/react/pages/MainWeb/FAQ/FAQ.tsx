import React from "react";
import FAQCard from "../../../components/MainWeb/FAQ/FAQCard";
import AnimatedContent from "../../../components/MainWeb/Common/AnimatedContent";

const FAQ: React.FC = () => {
  return (
    <div className="mx-auto mt-12 min-h-screen w-full items-center justify-center bg-[url('/src/react/assets/MainWeb/bg1.webp')] bg-cover bg-top bg-no-repeat px-4 py-16">
      <AnimatedContent
        distance={150}
        direction="vertical"
        duration={1}
        delay={0.2}
      >
        <div className="mx-auto w-[90vw] lg:w-1/2">
          <div className="font-league rounded-xl bg-white py-3 text-center text-2xl font-bold text-[#002a45] shadow">
            FAQ
          </div>
        </div>
        <FAQCard />
      </AnimatedContent>
    </div>
  );
};

export default FAQ;
