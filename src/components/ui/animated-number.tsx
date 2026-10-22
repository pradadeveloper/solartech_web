"use client";

import { useEffect, useRef, useState } from "react";
import { formatCOPCompact, formatNumber } from "@/lib/utils";

const formats = {
  integer: (n: number) => formatNumber(n, 0),
  decimal: (n: number) => formatNumber(n, 1),
  copCompact: (n: number) => formatCOPCompact(n),
};

type Props = {
  value: number;
  format?: keyof typeof formats;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

/** Contador que anima de 0 al valor cuando entra en pantalla.
    El HTML del servidor ya trae el valor final (SEO y sin JS). Sin dependencias:
    IntersectionObserver + requestAnimationFrame (antes usaba `motion`, ~40 KB de JS). */
export function AnimatedNumber({ value, format = "integer", prefix = "", suffix = "", duration = 1.6, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = formats[format];
  const [display, setDisplay] = useState(() => fmt(value));

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / (duration * 1000));
          setDisplay(fmt(value * easeOutExpo(t)));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: "-10% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration, fmt]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
