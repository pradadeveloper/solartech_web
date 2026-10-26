"use client";

import { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/** Botón flotante "Agenda tu reunión" en móvil: aparece después del encabezado y se esconde
    cuando el formulario de agendamiento está en pantalla. Deja libre el botón de WhatsApp. */
export function ReferralStickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPastHero(window.scrollY > 640));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const form = document.getElementById("agendar");
    const observer = form ? new IntersectionObserver(([e]) => setAtForm(e.isIntersecting), { rootMargin: "0px 0px -30% 0px" }) : null;
    if (form) observer?.observe(form);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, []);

  const visible = pastHero && !atForm;
  return (
    <a
      href="#agendar"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      data-event="referral_sticky_cta"
      className={cn(
        "fixed bottom-5 left-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-copper px-5 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_var(--copper)] transition-[opacity,transform] duration-300 lg:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <CalendarCheck aria-hidden className="size-4" />
      Agenda tu reunión
    </a>
  );
}
