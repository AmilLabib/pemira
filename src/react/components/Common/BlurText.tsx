import React, { useEffect, useRef } from "react";
import gsap from "gsap";

type AnimateBy = "words" | "chars";

interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: AnimateBy;
  direction?: "top" | "bottom" | "left" | "right";
  onAnimationComplete?: () => void;
  className?: string;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 0,
  animateBy = "words",
  direction = "bottom",
  onAnimationComplete,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const items = Array.from(
      el.querySelectorAll<HTMLElement>(".blur-text-item"),
    );
    if (!items.length) return;

    // map direction to initial translate values
    const distance = 24;
    let fromVars: any = { opacity: 0, filter: "blur(8px)" };
    if (direction === "bottom") fromVars.y = distance;
    else if (direction === "top") fromVars.y = -distance;
    else if (direction === "left") fromVars.x = -distance;
    else if (direction === "right") fromVars.x = distance;

    // repeat indefinitely with a 5s pause between cycles
    tlRef.current = gsap.timeline({
      repeat: -1,
      repeatDelay: 5, // seconds
      onRepeat: () => {
        if (onAnimationComplete) onAnimationComplete();
      },
    });

    tlRef.current.fromTo(
      items,
      { ...fromVars },
      {
        x: 0,
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        delay: delay / 1000,
      },
    );

    return () => {
      tlRef.current?.kill();
      tlRef.current = null;
    };
  }, [text, delay, animateBy, direction, onAnimationComplete]);

  const buildNodes = () => {
    if (animateBy === "chars") {
      return text.split("").map((ch, i) => (
        <span
          key={`ch-${i}`}
          className="blur-text-item inline-block"
          aria-hidden="true"
        >
          {ch}
        </span>
      ));
    }

    return text.split(" ").map((word, i) => (
      <span
        key={`w-${i}`}
        className="blur-text-item mr-2 inline-block whitespace-nowrap"
        aria-hidden="true"
      >
        {word}
      </span>
    ));
  };

  return (
    <div ref={containerRef} className={className} aria-label={text}>
      {buildNodes()}
    </div>
  );
};

export default BlurText;
