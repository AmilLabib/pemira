import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Slide =
  | { type: "image"; src: string; alt?: string }
  | { type: "youtube"; videoId: string; title?: string };

interface CarouselProps {
  slides: Slide[];
  interval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
  slides,
  interval = 6000,
  showIndicators = true,
  showArrows = true,
}) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // autoplay
    if (slides.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, interval);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [slides.length, interval]);

  useEffect(() => {
    // pause on hover
    const el = containerRef.current;
    if (!el) return;
    const onEnter = () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    const onLeave = () => {
      if (slides.length <= 1) return;
      if (!timerRef.current) {
        timerRef.current = window.setInterval(() => {
          setIndex((i) => (i + 1) % slides.length);
        }, interval);
      }
    };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [slides.length, interval]);

  const go = (i: number) => {
    setIndex(((i % slides.length) + slides.length) % slides.length);
  };

  return (
    <div className="mx-auto w-[90vw] rounded-xl bg-white py-8 opacity-90 lg:w-[80vw]">
      <div
        ref={containerRef}
        className="relative mx-auto aspect-video w-[90%] overflow-hidden rounded-2xl"
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === index
                ? "z-10 opacity-100"
                : "pointer-events-none z-0 opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            {s.type === "image" ? (
              <img
                src={s.src}
                alt={s.alt ?? `slide-${i}`}
                className="h-full w-full object-cover"
                loading={i === index ? "eager" : "lazy"}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-black">
                {i === index ? (
                  <iframe
                    title={s.title ?? `YouTube video ${s.videoId}`}
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${s.videoId}?autoplay=0&rel=0&showinfo=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  // show thumbnail when not active to save resources
                  <img
                    src={`https://img.youtube.com/vi/${s.videoId}/hqdefault.jpg`}
                    alt={s.title ?? `YouTube thumbnail ${s.videoId}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
            )}
          </div>
        ))}
        {showArrows && slides.length > 1 && (
          <>
            <button
              aria-label="Previous"
              onClick={() => go(index - 1)}
              className="absolute top-1/2 left-3 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/60"
            >
              <ChevronLeft />
            </button>
            <button
              aria-label="Next"
              onClick={() => go(index + 1)}
              className="absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/60"
            >
              <ChevronRight />
            </button>
          </>
        )}
        {showIndicators && slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                className={`h-3 w-3 rounded-full transition-colors duration-200 ${
                  i === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Carousel;
