"use client";

import { useEffect } from "react";
import { pushEvent } from "@/lib/analytics";

/** Envía al dataLayer los clics en elementos con data-event (enlaces de WhatsApp,
    teléfono y CTAs renderizados en el servidor). */
export function ClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-event]");
      if (!el) return;
      pushEvent(el.dataset.event!, { page: window.location.pathname, label: el.textContent?.trim().slice(0, 80) });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
