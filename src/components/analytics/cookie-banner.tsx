"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CONSENT_STORAGE_KEY, updateConsent, type ConsentChoice } from "@/lib/analytics";

type Stored = { analytics: ConsentChoice; marketing: ConsentChoice; date: string };

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      setVisible(!localStorage.getItem(CONSENT_STORAGE_KEY));
    } catch {
      setVisible(true);
    }
  }, []);

  function save(choice: { analytics: ConsentChoice; marketing: ConsentChoice }) {
    const stored: Stored = { ...choice, date: new Date().toISOString() };
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored));
    } catch {}
    updateConsent(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div role="dialog" aria-live="polite" aria-label="Preferencias de cookies" className="fixed inset-x-4 bottom-4 z-50 sm:right-auto sm:left-6 sm:max-w-md">
      <div className="rounded-2xl border border-border-strong bg-surface p-5 shadow-2xl shadow-black/40">
        <p className="text-sm font-semibold">Usamos cookies</p>
        <p className="mt-1.5 text-sm text-fg-muted">
          Las usamos para medir el uso del sitio y, si lo aceptas, para mostrarte publicidad relevante. Puedes rechazarlas sin afectar tu navegación.{" "}
          <Link href="/politica-de-privacidad/" className="text-copper-text underline underline-offset-2">
            Política de privacidad
          </Link>
          .
        </p>

        {customizing && (
          <div className="mt-4 space-y-3 rounded-xl bg-surface-2 p-3 text-sm">
            <label className="flex items-center justify-between gap-3">
              <span>Analítica (Google Analytics)</span>
              <input type="checkbox" className="size-4 accent-[var(--copper)]" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Marketing (Google Ads, Meta)</span>
              <input type="checkbox" className="size-4 accent-[var(--copper)]" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {customizing ? (
            <Button size="sm" onClick={() => save({ analytics: analytics ? "granted" : "denied", marketing: marketing ? "granted" : "denied" })}>
              Guardar preferencias
            </Button>
          ) : (
            <>
              <Button size="sm" onClick={() => save({ analytics: "granted", marketing: "granted" })}>
                Aceptar todas
              </Button>
              <Button size="sm" variant="secondary" onClick={() => save({ analytics: "denied", marketing: "denied" })}>
                Rechazar
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setCustomizing(true)}>
                Configurar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
