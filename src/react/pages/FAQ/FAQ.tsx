import React from "react";
import FAQCard from "../../components/FAQ/FAQCard";
import AnimatedContent from "../../components/Common/AnimatedContent";

const FAQ: React.FC = () => {
  return (
    <div className="container mx-auto mt-12 min-h-screen items-center justify-center bg-[url('/src/react/assets/bg1.webp')] bg-cover bg-center bg-no-repeat px-4 py-16">
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
