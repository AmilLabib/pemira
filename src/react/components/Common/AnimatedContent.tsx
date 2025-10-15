import React, { useEffect, useRef } from "react";
import gsap from "gsap";

type Direction = "horizontal" | "vertical";

interface Props {
  children: React.ReactNode;
  distance?: number;
  direction?: Direction;
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
}

const AnimatedContent: React.FC<Props> = ({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
  duration = 0.8,
  ease = "power3.out",
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.2,
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    // initial styles to ensure element is ready for animation
    const from: any = {
      opacity: animateOpacity ? initialOpacity : 1,
      scale: 1,
    };
    if (direction === "horizontal") {
      from.x = reverse ? -distance : distance;
    } else {
      from.y = reverse ? -distance : distance;
    }

    const to: any = { x: 0, y: 0, scale, duration, ease, delay };
    if (animateOpacity) to.opacity = 1;

    // set initial state
    gsap.set(el, from);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !playedRef.current) {
            playedRef.current = true;
            gsap.to(el, to);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold },
    );

    obs.observe(el);

    return () => {
      obs.disconnect();
    };
  }, [
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    threshold,
    delay,
  ]);

  return <div ref={ref}>{children}</div>;
};

export default AnimatedContent;
