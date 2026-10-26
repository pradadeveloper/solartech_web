"use client";

import { useEffect, useRef } from "react";

// Comunicación entre secciones de /referidos-comerciales/ (tabla del encabezado → simulador,
// perfiles → formulario de agendamiento) sin estado global: eventos del navegador.

type Events = { "referral:preset": string; "referral:profile": string };

export function emitReferral<K extends keyof Events>(name: K, detail: Events[K], scrollTo?: string) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
  if (scrollTo) document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function useReferralEvent<K extends keyof Events>(name: K, handler: (detail: Events[K]) => void) {
  // El manejador vive en una ref: se suscribe una sola vez aunque cambie en cada render.
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  useEffect(() => {
    const listener = (e: Event) => ref.current((e as CustomEvent<Events[K]>).detail);
    window.addEventListener(name, listener);
    return () => window.removeEventListener(name, listener);
  }, [name]);
}
