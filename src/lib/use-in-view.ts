"use client";

import { useEffect, useRef, useState } from "react";

/** `true` mientras el elemento está en pantalla (o una sola vez con `once`).
    Sirve para arrancar animaciones solo cuando se ven y pausarlas fuera de pantalla. */
export function useInView<T extends Element>({ once = false, threshold = 0.25 }: { once?: boolean; threshold?: number } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  return [ref, inView] as const;
}

/** Entrada escalonada al hacer scroll. Devuelve `hidden` = true solo para bloques que al
    cargar estaban debajo de la pantalla y aún no se han visto: el HTML del servidor y los
    bloques ya visibles se muestran siempre, así nada queda oculto si el script falla. */
export function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setHidden(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHidden(false);
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, hidden] as const;
}

/** Clases de la entrada escalonada para el elemento `i` de un bloque. */
export function revealStyle(hidden: boolean, i: number) {
  return {
    className: `transition-[opacity,transform] duration-700 ease-out ${hidden ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"}`,
    style: { transitionDelay: hidden ? "0ms" : `${i * 80}ms` },
  };
}

/** `true` si el visitante pidió reducir el movimiento: sin rotaciones automáticas. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
