import React, { useEffect, useRef, useState } from "react";
import BlurText from "../Common/BlurText";
import img1 from "../../../assets/MainWeb/carousel1.webp";
import img2 from "../../../assets/MainWeb/carousel2.webp";
import img3 from "../../../assets/MainWeb/carousel3.webp";
import img4 from "../../../assets/MainWeb/carousel4.webp";
import img5 from "../../../assets/MainWeb/carousel5.webp";

const slides = [img1, img2, img3, img4, img5];

const Hero: React.FC = () => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 3000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[100dvh] w-full">
        {slides.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === index
                ? "z-10 opacity-100"
                : "pointer-events-none z-0 opacity-0"
            }`}
          >
            <img
              src={src}
              alt={`slide-${i}`}
              className="h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}

        {/* overlay text */}
        <div className="absolute bottom-30 left-10 z-20 max-w-3xl lg:bottom-40 lg:left-40">
          <div>
            {/* Suara Berkarya */}
            <BlurText
              text="Suara Berkarya"
              delay={1000}
              animateBy="words"
              direction="bottom"
              className="text-4xl font-extrabold text-white drop-shadow-xl lg:text-6xl"
            />

            {/* Bersama Suara, Wujudkan Asa */}
            <BlurText
              text="Bersama Suara, Wujudkan Asa"
              delay={1000}
              animateBy="words"
              direction="bottom"
              className="text-xl font-semibold text-white drop-shadow lg:mt-2 lg:text-4xl"
            />
          </div>

          <div className="mt-2 lg:mt-6">
            <button
              className="rounded-full bg-[#0b3a82] px-5 py-2 text-sm font-semibold text-white shadow-lg hover:opacity-80 lg:text-base"
              onClick={() => {
                const timeline = document.getElementById("timeline");
                if (timeline) {
                  timeline.scrollIntoView({ behavior: "smooth" });
                }
              }}
              style={{ cursor: "pointer" }}
            >
              Mulai Memilih Sekarang !
            </button>
          </div>
        </div>

        {/* indicators */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-3 w-5 rounded-full transition-all duration-300 lg:h-3 lg:w-10 ${
                i === index ? "w-10 bg-yellow-400" : "w-3 bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
