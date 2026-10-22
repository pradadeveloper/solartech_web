"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Turnstile } from "@marsidev/react-turnstile";
import { ArrowLeft, ArrowRight, Building2, FileUp, Home, Loader2, Lock, Sprout, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChoiceCard, FieldError, Hint, Input, Label, Select } from "@/components/ui/field";
import { NumberInput } from "@/components/quote/number-input";
import { LiveEstimate } from "@/components/quote/live-estimate";
import { clientTypes, modelOptions, roofTypes, stepTitles } from "@/components/quote/options";
import { hspByDepartment, type ClientType } from "@/config/quote-config";
import { contactSchema, INVOICE_MAX_BYTES, INVOICE_TYPES, quoteStepsSchema, type QuoteSteps } from "@/lib/lead-schema";
import { computeQuote, QuoteError, referenceTariff, type ModelInterest, type QuoteResult, type RoofType } from "@/lib/quote-engine";
import { pushEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// Recharts solo se descarga al mostrar el resultado.
const QuoteResults = dynamic(() => import("@/components/quote/quote-results").then((m) => m.QuoteResults), {
  loading: () => <div className="h-96 animate-pulse rounded-3xl bg-surface-2" />,
});

export type FormValues = {
  clientType: ClientType | "";
  departamento: string;
  municipio: string;
  inputMode: "factura" | "kwh";
  billCop: string;
  consumptionKwh: string;
  tariffCopKwh: string;
  tariffTouched: boolean;
  roofType: RoofType | "";
  areaM2: string;
  batteries: boolean;
  modelInterest: ModelInterest;
  nombre: string;
  empresa: string;
  nit: string;
  email: string;
  celular: string;
  consentimiento: boolean;
  website: string; // honeypot
};

const iconFor = { empresa: Building2, agro: Sprout, hogar: Home } as const;
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function toStepsInput(v: FormValues) {
  return {
    clientType: v.clientType || undefined,
    departamento: v.departamento,
    municipio: v.municipio,
    billCop: v.inputMode === "factura" ? v.billCop : undefined,
    consumptionKwh: v.inputMode === "kwh" ? v.consumptionKwh : undefined,
    tariffCopKwh: v.tariffCopKwh,
    roofType: v.roofType || undefined,
    areaM2: v.areaM2,
    batteries: v.batteries,
    modelInterest: v.modelInterest,
  };
}

export function QuoteWizard() {
  const params = useSearchParams();
  const initialDep = hspByDepartment.some((d) => d.departamento === params.get("dep")) ? params.get("dep")! : "Antioquia";
  const initialType = (["empresa", "agro", "hogar"] as const).find((t) => t === params.get("tipo")) ?? "";

  const { register, setValue, getValues, control, setError, clearErrors, formState } = useForm<FormValues>({
    defaultValues: {
      clientType: initialType,
      departamento: initialDep,
      municipio: params.get("mun") ?? (initialDep === "Antioquia" ? "Medellín" : ""),
      inputMode: "factura",
      billCop: params.get("factura")?.replace(/\D/g, "") ?? "",
      consumptionKwh: "",
      tariffCopKwh: String(referenceTariff(initialDep)),
      tariffTouched: false,
      roofType: "",
      areaM2: "",
      batteries: false,
      modelInterest: "no_se",
      nombre: "",
      empresa: "",
      nit: "",
      email: "",
      celular: "",
      consentimiento: false,
      website: "",
    },
  });
  const values = useWatch({ control }) as FormValues;
  const errors = formState.errors;

  // Si viene del hero con el paso 1 completo, arranca en el paso 2.
  const [step, setStep] = useState(() => (initialType && params.get("mun") ? 1 : 0));
  const [invoice, setInvoice] = useState<File | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ result: QuoteResult; input: QuoteSteps } | null>(null);
  const started = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

  const municipios = useMemo(() => hspByDepartment.find((d) => d.departamento === values.departamento)?.municipios ?? [], [values.departamento]);

  // Tarifa de referencia por departamento mientras el usuario no la edite.
  useEffect(() => {
    if (!getValues("tariffTouched")) setValue("tariffCopKwh", String(referenceTariff(values.departamento)));
  }, [values.departamento, getValues, setValue]);

  // Precarga la pantalla de resultados (Recharts) mientras el usuario llena sus datos.
  useEffect(() => {
    if (step === 3) void import("@/components/quote/quote-results");
  }, [step]);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    pushEvent("quote_start", { location: "cotizador" });
  }

  // Estimación en vivo (gate suave: solo rango de ahorro hasta completar datos).
  const live = useMemo(() => {
    if (step < 1) return null;
    const parsed = quoteStepsSchema.safeParse(toStepsInput(values));
    if (!parsed.success) return null;
    try {
      return computeQuote(parsed.data);
    } catch {
      return null;
    }
  }, [values, step]);

  function validateStep(current: number): boolean {
    clearErrors();
    const v = getValues();
    if (current === 0) {
      const missing = [
        !v.clientType && (["clientType", "Elige el tipo de cliente"] as const),
        !v.departamento && (["departamento", "Elige el departamento"] as const),
        !v.municipio && (["municipio", "Elige el municipio"] as const),
      ].filter((m) => m !== false);
      for (const [field, message] of missing) setError(field, { message });
      return missing.length === 0;
    }
    if (current === 1) {
      const parsed = quoteStepsSchema.safeParse(toStepsInput(v));
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const field = issue.path[0] === "billCop" && v.inputMode === "kwh" ? "consumptionKwh" : (issue.path[0] as keyof FormValues);
          if (["billCop", "consumptionKwh", "tariffCopKwh"].includes(field)) setError(field, { message: issue.message });
        }
        return false;
      }
      try {
        computeQuote(parsed.data);
      } catch (err) {
        if (err instanceof QuoteError) {
          setError(v.inputMode === "kwh" ? "consumptionKwh" : "billCop", { message: err.message });
          return false;
        }
      }
      return true;
    }
    if (current === 3) {
      const parsed = contactSchema.safeParse(v);
      if (!parsed.success) {
        for (const issue of parsed.error.issues) setError(issue.path[0] as keyof FormValues, { message: issue.message });
        return false;
      }
    }
    return true;
  }

  function next() {
    if (!validateStep(step)) return;
    pushEvent(`quote_step_${step + 1}`, { step_name: stepTitles[step] });
    setStep((s) => s + 1);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submit() {
    if (!validateStep(3)) return;
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setSubmitError("Espera un momento mientras verificamos que no eres un robot.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    const v = getValues();
    const steps = quoteStepsSchema.parse(toStepsInput(v));
    const payload = { source: "cotizador", ...steps, nombre: v.nombre, empresa: v.empresa, nit: v.nit, email: v.email, celular: v.celular, consentimiento: v.consentimiento };

    const body = new FormData();
    body.set("payload", JSON.stringify(payload));
    body.set("website", v.website);
    body.set("landing_page", window.location.pathname);
    body.set("referrer", document.referrer);
    if (invoice) body.set("factura", invoice);
    if (turnstileToken) body.set("cf-turnstile-response", turnstileToken);

    try {
      const res = await fetch("/api/leads/", { method: "POST", body });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        for (const issue of json.issues ?? []) setError(issue.path as keyof FormValues, { message: issue.message });
        throw new Error(json.error ?? "No pudimos enviar tu solicitud.");
      }
      const r = json.result as QuoteResult;
      pushEvent("quote_complete", { client_type: steps.clientType, kwp: r.system.kwp });
      pushEvent("generate_lead", {
        value: r.savings.yearlyCop,
        currency: "COP",
        lead_priority: json.priority,
        client_type: steps.clientType,
        model_interest: steps.modelInterest,
      });
      setResult({ result: r, input: steps });
      requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "No pudimos enviar tu solicitud.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div ref={topRef} className="scroll-mt-28">
        <QuoteResults result={result.result} input={result.input} name={getValues("nombre")} />
      </div>
    );
  }

  return (
    <div ref={topRef} className="grid scroll-mt-28 gap-6 lg:grid-cols-[1.35fr_1fr]">
      <form
        noValidate
        onChange={markStarted}
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 3) next();
          else submit();
        }}
        className="rounded-3xl border border-border bg-surface p-5 sm:p-8"
        aria-labelledby="wizard-step-title"
      >
        <ProgressBar step={step} />

        <h2 id="wizard-step-title" className="mt-6 text-2xl font-extrabold">
          {["¿Para quién es el proyecto?", "¿Cuánto pagas de energía?", "¿Dónde lo instalaríamos?", "¿A dónde te enviamos la propuesta?"][step]}
        </h2>

        {/* Honeypot: invisible para personas. */}
        <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
          <label>
            No llenar este campo
            <input tabIndex={-1} autoComplete="off" {...register("website")} />
          </label>
        </div>

        <div className="mt-6 space-y-6">
          {step === 0 && (
            <>
              <fieldset>
                <legend className="mb-2 text-sm font-semibold">Tipo de cliente</legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {clientTypes.map((c) => {
                    const Icon = iconFor[c.value];
                    return (
                      <ChoiceCard
                        key={c.value}
                        name="clientType"
                        value={c.value}
                        checked={values.clientType === c.value}
                        onChange={(val) => setValue("clientType", val as ClientType, { shouldDirty: true })}
                        title={c.title}
                        description={c.description}
                        icon={<Icon aria-hidden className="size-5" />}
                      />
                    );
                  })}
                </div>
                <FieldError message={errors.clientType?.message} />
              </fieldset>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="departamento">Departamento</Label>
                  <Select
                    id="departamento"
                    {...register("departamento", { onChange: () => setValue("municipio", "") })}
                    aria-invalid={Boolean(errors.departamento)}
                  >
                    {hspByDepartment.map((d) => (
                      <option key={d.departamento} value={d.departamento}>
                        {d.departamento}
                      </option>
                    ))}
                  </Select>
                  <FieldError message={errors.departamento?.message} />
                </div>
                <div>
                  <Label htmlFor="municipio">Municipio</Label>
                  <Select id="municipio" {...register("municipio")} aria-invalid={Boolean(errors.municipio)}>
                    <option value="">Selecciona…</option>
                    {municipios.map((m) => (
                      <option key={m.nombre} value={m.nombre}>
                        {m.nombre}
                      </option>
                    ))}
                  </Select>
                  <Hint>¿No aparece? Elige el más cercano.</Hint>
                  <FieldError message={errors.municipio?.message} />
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div role="radiogroup" aria-label="Cómo quieres ingresar tu consumo" className="inline-flex rounded-full border border-border-strong bg-surface-2 p-1 text-sm">
                {(["factura", "kwh"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={values.inputMode === m}
                    onClick={() => setValue("inputMode", m)}
                    className={cn("rounded-full px-4 py-1.5 font-semibold transition-colors", values.inputMode === m ? "bg-copper text-white" : "text-fg-muted hover:text-fg")}
                  >
                    {m === "factura" ? "Valor de la factura" : "Consumo en kWh"}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {values.inputMode === "factura" ? (
                  <div>
                    <Label htmlFor="billCop">Factura mensual promedio</Label>
                    <NumberInput
                      id="billCop"
                      prefix="$"
                      suffix="COP"
                      placeholder="5.000.000"
                      value={values.billCop}
                      onValueChange={(d) => setValue("billCop", d)}
                      aria-invalid={Boolean(errors.billCop)}
                      aria-describedby="billCop-error"
                    />
                    <FieldError id="billCop-error" message={errors.billCop?.message} />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="consumptionKwh">Consumo mensual</Label>
                    <NumberInput
                      id="consumptionKwh"
                      suffix="kWh/mes"
                      placeholder="6.000"
                      value={values.consumptionKwh}
                      onValueChange={(d) => setValue("consumptionKwh", d)}
                      aria-invalid={Boolean(errors.consumptionKwh)}
                    />
                    <FieldError message={errors.consumptionKwh?.message} />
                  </div>
                )}
                <div>
                  <Label htmlFor="tariffCopKwh">Tarifa de energía</Label>
                  <NumberInput
                    id="tariffCopKwh"
                    prefix="$"
                    suffix="/kWh"
                    value={values.tariffCopKwh}
                    onValueChange={(d) => {
                      setValue("tariffCopKwh", d);
                      setValue("tariffTouched", true);
                    }}
                    aria-invalid={Boolean(errors.tariffCopKwh)}
                  />
                  <Hint>Valor de referencia para {values.departamento}. Ajústalo con el de tu factura.</Hint>
                  <FieldError message={errors.tariffCopKwh?.message} />
                </div>
              </div>

              <InvoiceUpload file={invoice} onChange={setInvoice} />
            </>
          )}

          {step === 2 && (
            <>
              <fieldset>
                <legend className="mb-2 text-sm font-semibold">
                  Tipo de techo o terreno <span className="font-normal text-fg-subtle">(opcional)</span>
                </legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {roofTypes.map((r) => (
                    <ChoiceCard key={r.value} name="roofType" value={r.value} checked={values.roofType === r.value} onChange={(val) => setValue("roofType", val as RoofType)} title={r.title} />
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="areaM2">
                    Área disponible <span className="font-normal text-fg-subtle">(opcional)</span>
                  </Label>
                  <NumberInput id="areaM2" suffix="m²" placeholder="800" value={values.areaM2} onValueChange={(d) => setValue("areaM2", d)} />
                  <Hint>Si no la sabes, déjala vacía: la medimos en la visita.</Hint>
                </div>
                <fieldset>
                  <legend className="mb-2 text-sm font-semibold">¿Necesitas respaldo con baterías?</legend>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { v: false, t: "No" },
                      { v: true, t: "Sí, ante cortes" },
                    ].map((o) => (
                      <ChoiceCard key={o.t} name="batteries" value={String(o.v)} checked={values.batteries === o.v} onChange={() => setValue("batteries", o.v)} title={o.t} />
                    ))}
                  </div>
                </fieldset>
              </div>
              <fieldset>
                <legend className="mb-2 text-sm font-semibold">¿Cómo prefieres invertir?</legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {modelOptions.map((m) => (
                    <ChoiceCard
                      key={m.value}
                      name="modelInterest"
                      value={m.value}
                      checked={values.modelInterest === m.value}
                      onChange={(val) => setValue("modelInterest", val as ModelInterest)}
                      title={m.title}
                      description={m.description}
                    />
                  ))}
                </div>
              </fieldset>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input id="nombre" autoComplete="name" {...register("nombre")} aria-invalid={Boolean(errors.nombre)} />
                  <FieldError message={errors.nombre?.message} />
                </div>
                {values.clientType !== "hogar" && (
                  <>
                    <div>
                      <Label htmlFor="empresa">
                        Empresa o finca <span className="font-normal text-fg-subtle">(opcional)</span>
                      </Label>
                      <Input id="empresa" autoComplete="organization" {...register("empresa")} />
                    </div>
                    <div>
                      <Label htmlFor="nit">
                        NIT <span className="font-normal text-fg-subtle">(opcional)</span>
                      </Label>
                      <Input id="nit" inputMode="numeric" {...register("nit")} />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={Boolean(errors.email)} />
                  <FieldError message={errors.email?.message} />
                </div>
                <div>
                  <Label htmlFor="celular">Celular / WhatsApp</Label>
                  <Input id="celular" type="tel" autoComplete="tel" inputMode="tel" placeholder="310 000 0000" {...register("celular")} aria-invalid={Boolean(errors.celular)} />
                  <FieldError message={errors.celular?.message} />
                </div>
              </div>

              <div>
                <label className="flex items-start gap-3 text-sm text-fg-muted">
                  <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-[var(--copper)]" {...register("consentimiento")} aria-invalid={Boolean(errors.consentimiento)} />
                  <span>
                    Autorizo a Solartech el tratamiento de mis datos personales para recibir mi pre-cotización y ser contactado por un asesor, conforme a la{" "}
                    <Link href="/politica-de-privacidad/" target="_blank" className="text-copper-text underline underline-offset-2">
                      política de tratamiento de datos
                    </Link>{" "}
                    (Ley 1581 de 2012).
                  </span>
                </label>
                <FieldError message={errors.consentimiento?.message} />
              </div>

              {TURNSTILE_SITE_KEY && (
                <Turnstile siteKey={TURNSTILE_SITE_KEY} onSuccess={setTurnstileToken} onExpire={() => setTurnstileToken(null)} options={{ theme: "auto", language: "es", size: "flexible" }} />
              )}
            </>
          )}
        </div>

        {submitError && (
          <p role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            {submitError}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft aria-hidden className="size-4" />
              Atrás
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-fg-subtle">
              <Lock aria-hidden className="size-3.5" />
              Menos de 60 segundos
            </span>
          )}
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 aria-hidden className="size-4 animate-spin" />
                Calculando…
              </>
            ) : step < 3 ? (
              <>
                Continuar
                <ArrowRight aria-hidden className="size-4" />
              </>
            ) : (
              "Ver mi pre-cotización"
            )}
          </Button>
        </div>
      </form>

      <LiveEstimate result={live} step={step} />
    </div>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div>
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">
        <span>
          Paso {step + 1} de {stepTitles.length}
        </span>
        <span>{stepTitles[step]}</span>
      </div>
      <div
        className="mt-3 grid grid-cols-4 gap-1.5"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={stepTitles.length}
        aria-valuenow={step + 1}
        aria-label="Progreso del cotizador"
      >
        {stepTitles.map((t, i) => (
          <span key={t} className={cn("h-1.5 rounded-full transition-colors", i <= step ? "bg-copper" : "bg-surface-3")} />
        ))}
      </div>
    </div>
  );
}

function InvoiceUpload({ file, onChange }: { file: File | null; onChange: (f: File | null) => void }) {
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">
        Sube tu última factura <span className="font-normal text-fg-subtle">(opcional, acelera tu propuesta)</span>
      </p>
      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-positive/40 bg-positive-soft px-4 py-3 text-sm">
          <span className="truncate">{file.name}</span>
          <button type="button" onClick={() => onChange(null)} aria-label="Quitar factura" className="text-fg-muted hover:text-fg">
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border-strong bg-surface-2 px-4 py-4 text-sm text-fg-muted transition-colors hover:border-copper-text has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-copper/50">
          <FileUp aria-hidden className="size-5 text-copper-text" />
          <span>PDF, JPG o PNG · máx. 10 MB</span>
          <input
            type="file"
            accept={INVOICE_TYPES.join(",")}
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              if (f.size > INVOICE_MAX_BYTES || !INVOICE_TYPES.includes(f.type)) {
                setError("El archivo debe ser PDF, JPG o PNG de máximo 10 MB.");
                return;
              }
              setError(null);
              onChange(f);
              pushEvent("file_upload", { file_type: f.type });
            }}
          />
        </label>
      )}
      <FieldError message={error ?? undefined} />
    </div>
  );
}
