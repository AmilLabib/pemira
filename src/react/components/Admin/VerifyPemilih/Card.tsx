import React from "react";

type CardProps = {
  header?: string;
  number: string | number;
  icon?: React.ReactNode;
  className?: string;
  progress?: number;
  total?: number;
};

const DefaultIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="1em"
    height="1em"
    className="text-white"
    aria-hidden
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6 18c0-2.21 3.58-4 6-4s6 1.79 6 4v1H6v-1z" />
    <path
      d="M2 20v-1c0-2.21 3.58-4 6-4 .34 0 .68.02 1 .06A7.996 7.996 0 002 20z"
      opacity=".0"
    />
  </svg>
);

export default function Card({
  header,
  number,
  icon,
  progress,
  total,
}: CardProps) {
  return (
    <div
      className="h-32 flex-1 rounded-2xl shadow-sm sm:w-full"
      style={{
        background: "linear-gradient(90deg,#58a2bd,#003f66)",
        padding: "1rem",
      }}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col text-[#f4f4f4]">
          <div className="text-left text-base font-bold">{header}</div>
          {typeof progress === "number" && typeof total === "number" ? (
            <>
              {(() => {
                const pct =
                  total > 0 ? Math.round((progress / total) * 100) : 0;
                const pctClamped = Math.max(0, Math.min(100, pct));
                return (
                  <>
                    <div className="text-left text-3xl font-bold">
                      {pctClamped}%
                    </div>
                    <div className="mt-2 w-40">
                      <div className="h-3 w-full rounded-full bg-white/30">
                        <div
                          className="h-3 rounded-full bg-white"
                          style={{ width: `${pctClamped}%` }}
                          aria-valuenow={pctClamped}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          role="progressbar"
                        />
                      </div>
                    </div>
                  </>
                );
              })()}
            </>
          ) : (
            <div className="text-left text-3xl font-bold">{number}</div>
          )}
        </div>
        <div className="ml-4 flex items-center justify-center">
          {icon === null ? null : (icon ?? <DefaultIcon />)}
        </div>
      </div>
    </div>
  );
}
