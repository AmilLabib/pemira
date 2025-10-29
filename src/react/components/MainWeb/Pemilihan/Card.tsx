import React from "react";

interface CardProps {
  header: React.ReactNode;
  content: React.ReactNode;
  buttonText: string;
  onButtonClick?: () => void;
  link?: string;
}

const Card: React.FC<CardProps> = ({
  header,
  content,
  buttonText,
  onButtonClick,
  link,
}) => {
  return (
    <div className="mx-auto flex min-h-[400px] w-full flex-col justify-between rounded-[2rem] bg-white p-6 pb-8 shadow-lg lg:w-1/2">
      <div className="font-poppins mb-2 w-fit rounded-lg px-2 py-1 text-2xl font-bold text-[#0f2a71]">
        {header}
      </div>
      <div className="font-poppins font-regular mb-6 text-base tracking-normal text-[#222]">
        {content}
      </div>
      {link ? (
        <a
          href={link}
          className="text-regular block w-full cursor-pointer rounded-2xl bg-[#fed258] py-3 text-center font-bold text-[#0f2a71] shadow-md transition hover:opacity-80 hover:shadow-none"
          rel="noopener noreferrer"
        >
          {buttonText}
        </a>
      ) : (
        <button
          onClick={onButtonClick}
          className="text-regular w-full cursor-pointer rounded-2xl bg-[#fed258] py-3 font-bold text-[#0f2a71] shadow-md transition hover:opacity-80 hover:shadow-none"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Card;
