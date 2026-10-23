"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { FileUp, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError, Hint, Input, Label, Select, Textarea } from "@/components/ui/field";
import { NumberInput } from "@/components/quote/number-input";
import { clientTypes } from "@/components/quote/options";
import { hspByDepartment } from "@/config/quote-config";
import { CONTACT_PREFERENCES, contactLeadSchema, INVOICE_MAX_BYTES, INVOICE_TYPES } from "@/lib/lead-schema";
import { pushEvent } from "@/lib/analytics";
import type { z } from "zod";

type Values = z.input<typeof contactLeadSchema>;
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Formulario de contacto → POST /api/leads (source: contacto) → CRM de asesores (solartech_app) → /gracias/.
 * Pide lo mínimo que el CRM exige para registrar el lead: tipo de proyecto, ubicación y factura.
 */
export function ContactForm() {
  const router = useRouter();
  const [invoice, setInvoice] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [slow, setSlow] = useState(false);
  const slowTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(contactLeadSchema),
    defaultValues: {
      source: "contacto",
      clientType: "empresa",
      departamento: "Antioquia",
      municipio: "Medellín",
      billCop: "",
      nombre: "",
      empresa: "",
      nit: "",
      email: "",
      celular: "",
      preferenciaContacto: "WhatsApp",
      mensaje: "",
    },
  });
  const [departamento, clientType, billCop] = useWatch({ control, name: ["departamento", "clientType", "billCop"] });
  const municipios = useMemo(() => hspByDepartment.find((d) => d.departamento === departamento)?.municipios ?? [], [departamento]);

  async function onSubmit(values: Values) {
    setSubmitError(null);
    if (TURNSTILE_SITE_KEY && !token) return setSubmitError("Espera un momento mientras verificamos que no eres un robot.");
    const body = new FormData();
    body.set("payload", JSON.stringify({ ...values, empresa: values.clientType === "hogar" ? "" : values.empresa }));
    body.set("website", honeypot);
    body.set("landing_page", window.location.pathname);
    body.set("referrer", document.referrer);
    if (invoice) body.set("factura", invoice);
    if (token) body.set("cf-turnstile-response", token);
    // El CRM puede tardar en responder (servidor despertando): avisamos para que no cierren.
    slowTimer.current = setTimeout(() => setSlow(true), 6000);
    try {
      const res = await fetch("/api/leads/", { method: "POST", body });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        for (const issue of json.issues ?? []) setError(issue.path as keyof Values, { message: issue.message });
        throw new Error(json.error ?? "No pudimos enviar tu mensaje.");
      }
      pushEvent("generate_lead", { lead_source: "contacto", has_invoice: Boolean(invoice), client_type: values.clientType, official_quote: Boolean(json.official) });
      router.push("/gracias/");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "No pudimos enviar tu mensaje.");
    } finally {
      clearTimeout(slowTimer.current);
      setSlow(false);
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
          <Label htmlFor="c-tipo">Tipo de proyecto</Label>
          <Select id="c-tipo" {...register("clientType")} aria-invalid={Boolean(errors.clientType)}>
            {clientTypes.map((c) => (
              <option key={c.value} value={c.value}>
                {c.title} · {c.description}
              </option>
            ))}
          </Select>
          <FieldError message={errors.clientType?.message} />
        </div>
        {clientType !== "hogar" && (
          <div>
            <Label htmlFor="c-empresa">
              Empresa o finca <span className="font-normal text-fg-subtle">(opcional)</span>
            </Label>
            <Input id="c-empresa" autoComplete="organization" {...register("empresa")} />
          </div>
        )}
        <div className={clientType === "hogar" ? "sm:col-span-2" : undefined}>
          <Label htmlFor="c-nit">
            {clientType === "hogar" ? "Cédula" : "NIT o cédula"} <span className="font-normal text-fg-subtle">(opcional)</span>
          </Label>
          <Input id="c-nit" inputMode="numeric" {...register("nit")} />
          <Hint>Si ya hablaste con un asesor, te conecta con él.</Hint>
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
        <div>
          <Label htmlFor="c-departamento">Departamento</Label>
          <Select id="c-departamento" {...register("departamento", { onChange: () => setValue("municipio", "") })} aria-invalid={Boolean(errors.departamento)}>
            {hspByDepartment.map((d) => (
              <option key={d.departamento} value={d.departamento}>
                {d.departamento}
              </option>
            ))}
          </Select>
          <FieldError message={errors.departamento?.message} />
        </div>
        <div>
          <Label htmlFor="c-municipio">Municipio</Label>
          <Select id="c-municipio" {...register("municipio")} aria-invalid={Boolean(errors.municipio)}>
            <option value="">Selecciona…</option>
            {municipios.map((m) => (
              <option key={m.nombre} value={m.nombre}>
                {m.nombre}
              </option>
            ))}
          </Select>
          <FieldError message={errors.municipio?.message} />
        </div>
        <div>
          <Label htmlFor="c-factura">Factura mensual de energía</Label>
          <NumberInput
            id="c-factura"
            prefix="$"
            suffix="COP"
            placeholder="5.000.000"
            value={billCop as string | undefined}
            onValueChange={(d) => setValue("billCop", d, { shouldValidate: Boolean(errors.billCop) })}
            aria-invalid={Boolean(errors.billCop)}
          />
          <Hint>Un valor aproximado está bien.</Hint>
          <FieldError message={errors.billCop?.message} />
        </div>
        <div>
          <Label htmlFor="c-preferencia">¿Cómo prefieres que te contactemos?</Label>
          <Select id="c-preferencia" {...register("preferenciaContacto")}>
            {CONTACT_PREFERENCES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="c-mensaje">
            Mensaje <span className="font-normal text-fg-subtle">(opcional)</span>
          </Label>
          <Textarea id="c-mensaje" placeholder="Cuéntanos sobre tu proyecto: uso de la energía, horarios, área disponible…" {...register("mensaje")} aria-invalid={Boolean(errors.mensaje)} />
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

      {isSubmitting && slow && (
        <p role="status" className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-fg-muted">
          <Loader2 aria-hidden className="mt-0.5 size-4 shrink-0 animate-spin text-copper-text" />
          Estamos registrando tu solicitud con un asesor. Puede tardar hasta un minuto; no cierres esta página.
        </p>
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
