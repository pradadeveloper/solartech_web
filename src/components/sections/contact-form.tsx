"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { FileUp, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/field";
import { contactLeadSchema, INVOICE_MAX_BYTES, INVOICE_TYPES } from "@/lib/lead-schema";
import { pushEvent } from "@/lib/analytics";
import type { z } from "zod";

type Values = z.input<typeof contactLeadSchema>;
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Formulario de contacto → POST /api/leads (source: contacto) → /gracias/. */
export function ContactForm() {
  const router = useRouter();
  const [invoice, setInvoice] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(contactLeadSchema),
    defaultValues: { source: "contacto", nombre: "", email: "", celular: "", mensaje: "", empresa: "" },
  });

  async function onSubmit(values: Values) {
    setSubmitError(null);
    if (TURNSTILE_SITE_KEY && !token) return setSubmitError("Espera un momento mientras verificamos que no eres un robot.");
    const body = new FormData();
    body.set("payload", JSON.stringify(values));
    body.set("website", honeypot);
    body.set("landing_page", window.location.pathname);
    body.set("referrer", document.referrer);
    if (invoice) body.set("factura", invoice);
    if (token) body.set("cf-turnstile-response", token);
    try {
      const res = await fetch("/api/leads/", { method: "POST", body });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        for (const issue of json.issues ?? []) setError(issue.path as keyof Values, { message: issue.message });
        throw new Error(json.error ?? "No pudimos enviar tu mensaje.");
      }
      pushEvent("generate_lead", { lead_source: "contacto", has_invoice: Boolean(invoice) });
      router.push("/gracias/");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "No pudimos enviar tu mensaje.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 rounded-3xl border border-border bg-surface p-6 sm:p-8" aria-labelledby="contact-form-title">
      <h2 id="contact-form-title" className="text-2xl font-extrabold">
        Escríbenos
      </h2>
      <p className="mt-2 text-fg-muted">Déjanos tus datos y un asesor te contactará. Si tienes tu factura de energía a mano, súbela: acelera tu propuesta.</p>

      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          No llenar este campo
          <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-nombre">Nombre completo</Label>
          <Input id="c-nombre" autoComplete="name" {...register("nombre")} aria-invalid={Boolean(errors.nombre)} />
          <FieldError message={errors.nombre?.message} />
        </div>
        <div>
          <Label htmlFor="c-empresa">
            Empresa <span className="font-normal text-fg-subtle">(opcional)</span>
          </Label>
          <Input id="c-empresa" autoComplete="organization" {...register("empresa")} />
        </div>
        <div>
          <Label htmlFor="c-email">Correo electrónico</Label>
          <Input id="c-email" type="email" autoComplete="email" {...register("email")} aria-invalid={Boolean(errors.email)} />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="c-celular">Celular / WhatsApp</Label>
          <Input id="c-celular" type="tel" autoComplete="tel" inputMode="tel" {...register("celular")} aria-invalid={Boolean(errors.celular)} />
          <FieldError message={errors.celular?.message} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="c-mensaje">Mensaje</Label>
          <Textarea id="c-mensaje" placeholder="Cuéntanos sobre tu proyecto: tipo de empresa, ciudad, consumo aproximado…" {...register("mensaje")} aria-invalid={Boolean(errors.mensaje)} />
          <FieldError message={errors.mensaje?.message} />
        </div>
        <div className="sm:col-span-2">
          {invoice ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-positive/40 bg-positive-soft px-4 py-3 text-sm">
              <span className="truncate">{invoice.name}</span>
              <button type="button" onClick={() => setInvoice(null)} aria-label="Quitar factura" className="text-fg-muted hover:text-fg">
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border-strong bg-surface-2 px-4 py-4 text-sm text-fg-muted transition-colors hover:border-copper-text has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-copper/50">
              <FileUp aria-hidden className="size-5 text-copper-text" />
              <span>Sube tu última factura de energía (opcional) · PDF, JPG o PNG, máx. 10 MB</span>
              <input
                type="file"
                accept={INVOICE_TYPES.join(",")}
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (f.size > INVOICE_MAX_BYTES || !INVOICE_TYPES.includes(f.type)) return setFileError("El archivo debe ser PDF, JPG o PNG de máximo 10 MB.");
                  setFileError(null);
                  setInvoice(f);
                  pushEvent("file_upload", { file_type: f.type, location: "contacto" });
                }}
              />
            </label>
          )}
          <FieldError message={fileError ?? undefined} />
        </div>
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm text-fg-muted">
        <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-[var(--copper)]" {...register("consentimiento")} aria-invalid={Boolean(errors.consentimiento)} />
        <span>
          Autorizo a Solartech el tratamiento de mis datos personales para atender mi solicitud, conforme a la{" "}
          <Link href="/politica-de-privacidad/" target="_blank" className="text-copper-text underline underline-offset-2">
            política de tratamiento de datos
          </Link>{" "}
          (Ley 1581 de 2012).
        </span>
      </label>
      <FieldError message={errors.consentimiento?.message} />

      {TURNSTILE_SITE_KEY && (
        <div className="mt-4">
          <Turnstile siteKey={TURNSTILE_SITE_KEY} onSuccess={setToken} onExpire={() => setToken(null)} options={{ theme: "auto", language: "es" }} />
        </div>
      )}

      {submitError && (
        <p role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {submitError}
        </p>
      )}

      <Button type="submit" size="lg" className="mt-6" disabled={isSubmitting}>
        {isSubmitting && <Loader2 aria-hidden className="size-4 animate-spin" />}
        Enviar mensaje
      </Button>
    </form>
  );
}
