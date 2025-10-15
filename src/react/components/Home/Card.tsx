import React from "react";

type Props = {
  title: React.ReactNode;
  items?: string[];
  className?: string;
  children?: React.ReactNode;
};

const Card: React.FC<Props> = ({ title, items, className = "", children }) => {
  return (
    <div
      className={`w-full rounded-3xl bg-white p-6 shadow-xl transition-transform duration-200 hover:-translate-y-2 ${className}`}
    >
      <div className="text-center">
        <h3 className="font-league mb-4 text-xl font-bold">{title}</h3>
      </div>

      <div className="max-w-none text-sm text-gray-800">
        {items ? (
          <div className="space-y-3">
            {items.map((t, i) => (
              <p key={i} className="leading-relaxed">
                {t}
              </p>
            ))}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default Card;
