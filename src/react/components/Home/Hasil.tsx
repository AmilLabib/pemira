import React from "react";

type DonutProps = {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  fontSize?: number | string;
};

const Donut: React.FC<DonutProps> = ({
  value,
  size = 72,
  stroke = 10,
  color = "#59c7d8",
  fontSize,
}) => {
  const pct = Math.max(0, Math.min(100, value));
  const angle = (pct / 100) * 360;
  const inner = size - stroke * 2;

  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center"
    >
      <div
        aria-hidden
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `conic-gradient(${color} ${angle}deg, rgba(0,0,0,0) ${angle}deg)`,
          boxShadow: "inset 0 0 0 6px #0b2a5a",
        }}
      />
      <div
        style={{
          width: inner,
          height: inner,
          borderRadius: "50%",
          fontSize: fontSize
            ? typeof fontSize === "number"
              ? `${fontSize}px`
              : fontSize
            : undefined,
        }}
        className="font-poppins absolute flex items-center justify-center bg-white text-sm font-semibold text-[#102a71]"
      >
        {pct}%
      </div>
    </div>
  );
};

const Hasil: React.FC = () => {
  // sample values
  const onsite = 75;
  const online = 5;
  const total = 80;

  return (
    <section className="mx-auto my-8 w-full lg:px-6">
      <div className="mx-auto w-[90vw] rounded-2xl bg-white py-8 opacity-90 shadow-xl lg:w-[80vw]">
        <div className="relative mx-auto w-[90%] rounded-2xl bg-[#102a71] px-6 py-8 text-white">
          {/* top centered ribbon */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="font-league rounded-full bg-[#102a71] px-6 py-2 text-center text-lg font-bold text-white lg:text-2xl">
              Hasil Akhir
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
            <div className="w-full md:col-span-5">
              <div className="grid gap-6">
                <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
                  <div className="font-league text-center text-lg font-bold md:text-left lg:text-3xl">
                    Suara masuk onsite :
                  </div>
                  <Donut
                    value={onsite}
                    size={100}
                    stroke={15}
                    color="#59c7d8"
                    fontSize={20}
                  />
                </div>

                <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
                  <div className="font-league text-center text-lg font-bold md:text-left lg:text-3xl">
                    Suara masuk online :
                  </div>
                  <Donut
                    value={online}
                    size={100}
                    stroke={15}
                    color="#59c7d8"
                    fontSize={20}
                  />
                </div>
              </div>
            </div>

            <div className="text-center md:col-span-3">
              <div className="font-league text-xl font-bold whitespace-nowrap lg:text-4xl">
                Total Suara Masuk :
              </div>
            </div>

            <div className="flex items-center justify-center md:col-span-4">
              <Donut
                value={total}
                size={152}
                stroke={25}
                color="#59c7d8"
                fontSize={36}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hasil;
