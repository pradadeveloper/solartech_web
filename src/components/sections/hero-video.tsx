"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_VIDEO_PLACEHOLDER } from "@/components/sections/hero-video-placeholder";
import { cn } from "@/lib/utils";

type Size = "sm" | "lg";

type FrameCallbackVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: () => void) => number;
  cancelVideoFrameCallback?: (id: number) => void;
};

/** Video de dron de proyectos reales detrás del hero.
    Para no afectar la carga:
    - Se pide solo después del evento `load` y cuando el navegador está libre; no se carga con
      ahorro de datos, conexión lenta o movimiento reducido; en móvil usa la versión de 640 px.
    - Se pinta en un <canvas>: Chrome cuenta el primer cuadro de un <video> visible como LCP
      (lo retrasaría hasta que el video descargue), pero un canvas no es candidato a LCP.
    - Se pausa fuera de pantalla. Mientras llega se ve una miniatura borrosa de <1 KB. */
export function HeroVideo() {
  const videoRef = useRef<FrameCallbackVideo>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<Size | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (connection?.saveData || /(^|-)(2g|3g)$/.test(connection?.effectiveType ?? "")) return;

    // Safari no tiene requestIdleCallback: ahí se espera 1,5 s después del load.
    const hasIdle = typeof window.requestIdleCallback === "function";
    let handle: number | undefined;
    const start = () => {
      const pick = () => setSize(window.innerWidth < 768 ? "sm" : "lg");
      handle = hasIdle ? window.requestIdleCallback(pick, { timeout: 3000 }) : window.setTimeout(pick, 1500);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (handle === undefined) return;
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  // Copia cada cuadro del video al canvas.
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!size || !video || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let frameId = 0;
    let stopped = false;
    const useFrameCallback = typeof video.requestVideoFrameCallback === "function";
    const draw = () => {
      if (stopped) return;
      if (video.readyState >= 2) {
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setReady(true);
      }
      frameId = useFrameCallback ? video.requestVideoFrameCallback!(draw) : requestAnimationFrame(draw);
    };
    draw();

    // Pausa cuando el hero sale de pantalla (ahorra CPU y batería).
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(canvas);

    return () => {
      stopped = true;
      observer.disconnect();
      if (useFrameCallback) video.cancelVideoFrameCallback?.(frameId);
      else cancelAnimationFrame(frameId);
    };
  }, [size]);

  const base = size === "sm" ? "/videos/hero-loop-sm" : "/videos/hero-loop";

  return (
    <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden">
      <div className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl" style={{ backgroundImage: `url(${HERO_VIDEO_PLACEHOLDER})` }} />
      <canvas ref={canvasRef} className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")} />
      {size && (
        // Fuente de los cuadros: 2×2 px y casi transparente, solo para decodificar.
        <video
          ref={videoRef}
          className="pointer-events-none absolute top-0 left-0 size-[2px] opacity-[0.01]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
        >
          <source src={`${base}.webm`} type="video/webm" />
          <source src={`${base}.mp4`} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
