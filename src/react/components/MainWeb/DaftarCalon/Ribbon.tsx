import React from "react";

type Props = {
  text?: string;
  className?: string;
  children?: React.ReactNode;
};

const Ribbon: React.FC<Props> = ({ text, children, className = "" }) => {
  return (
    <div
      className={`relative flex justify-center rounded-xl bg-[#102a71] shadow-xl ${className}`}
      style={{
        width: "100%",
      }}
    >
      <div className="font-league mx-auto max-w-full px-4 py-2 text-center text-lg font-bold text-white lg:text-xl">
        {text ?? children}
      </div>
    </div>
  );
};

export default Ribbon;
