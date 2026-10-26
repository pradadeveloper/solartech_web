"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { CalendarCheck, CalendarPlus, Check, Download, Loader2, MapPin, MessageCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/field";
import { EXPECTED_REFERRALS, MEETING_MINUTES, MEETING_MODES, MEETING_SLOTS, PARTNER_PROFILES, upcomingBusinessDays } from "@/content/referrals";
import { site, whatsappUrl } from "@/content/site";
import { referralMeetingSchema } from "@/lib/referral-schema";
import { bogotaToDate, formatMeetingDay, formatMeetingTime, googleCalendarUrl, icsFile, type CalendarEvent } from "@/lib/calendar";
import { pushEvent } from "@/lib/analytics";
import { useReferralEvent } from "@/lib/referral-events";
import { cn } from "@/lib/utils";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
type Mode = (typeof MEETING_MODES)[number]["value"];

const shortDay = new Intl.DateTimeFormat("es-CO", { weekday: "short", day: "numeric", month: "short", timeZone: "America/Bogota" });

/** "mar", "27", "oct" para una ficha de día (sin puntos ni la palabra "de"). */
function dayParts(date: string) {
  const parts = shortDay.formatToParts(bogotaToDate(date, "12:00"));
  const get = (type: Intl.DateTimeFormatPartTypes) => (parts.find((p) => p.type === type)?.value ?? "").replace(/\./g, "");
  return { wd: get("weekday"), num: get("day"), mon: get("month") };
}

const empty = {
  nombre: "",
  email: "",
  celular: "",
  empresa: "",
  ciudad: "",
  perfil: "",
  referidosEsperados: "",
  mensaje: "",
  consentimiento: false,
};

/** Agendamiento de la reunión del programa de referidos: modalidad, día hábil, hora y datos. */
export function ReferralBooking() {
  const [days, setDays] = useState<string[]>([]);
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<Mode>("virtual");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [token, setToken] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState<{ id: string; event: CalendarEvent } | null>(null);
  const [profileFlash, setProfileFlash] = useState(false);

  // "Agendar como…" desde la sección de perfiles llena el perfil y lo resalta un momento.
  useReferralEvent("referral:profile", (perfil) => {
    setValues((v) => ({ ...v, perfil }));
    setProfileFlash(true);
    setTimeout(() => setProfileFlash(false), 1600);
  });

  // Días y franjas ocupadas se calculan al cargar: la página es estática.
  useEffect(() => {
    const next = upcomingBusinessDays();
    setDays(next);
    setDate(next[0]);
    fetch("/api/referidos/")
      .then((r) => r.json())
      .then((d: { taken?: string[] }) => setTaken(new Set(d.taken ?? [])))
      .catch(() => {});
  }, []);

  const isTaken = (d: string, t: string) => taken.has(bogotaToDate(d, t).toISOString());
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const payload = { ...values, modalidad: mode, fecha: date, hora: time, empresa: values.empresa || undefined, mensaje: values.mensaje || undefined };
    const parsed = referralMeetingSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    if (TURNSTILE_SITE_KEY && !token) return setSubmitError("Espera un momento mientras verificamos que no eres un robot.");
    setErrors({});
    setSending(true);
    try {
      const res = await fetch("/api/referidos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, website: honeypot, "cf-turnstile-response": token }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrors(Object.fromEntries((json.issues ?? []).map((i: { path: string; message: string }) => [i.path, i.message])));
        if (res.status === 409) setTaken((t) => new Set(t).add(bogotaToDate(date, time).toISOString()));
        throw new Error(json.error ?? "No pudimos agendar tu cita.");
      }
      pushEvent("generate_lead", { lead_source: "referidos", meeting_mode: mode });
      const { street, city } = site.contact.address;
      setDone({
        id: json.id,
        event: {
          title: "Solartech · Programa de Referidos Comerciales",
          details: `Reunión para conocer la modalidad de referidos de Solartech. Contacto: ${site.contact.phoneDisplay}`,
          location: mode === "presencial" ? `${street}, ${city}` : "Videollamada (te enviaremos el enlace)",
          date,
          time,
          minutes: MEETING_MINUTES,
        },
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "No pudimos agendar tu cita.");
    } finally {
      setSending(false);
    }
  }

  if (done) return <Confirmation event={done.event} id={done.id} mode={mode} name={values.nombre} />;

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          No llenar este campo
          <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
      </div>

      {/* Cuándo y cómo */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <fieldset>
          <legend className="text-sm font-semibold">¿Cómo prefieres la reunión?</legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {MEETING_MODES.map((m) => {
              const on = mode === m.value;
              const Icon = m.value === "virtual" ? Video : MapPin;
              return (
                <label
                  key={m.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-copper/50",
                    on ? "border-copper bg-copper-soft" : "border-border-strong bg-surface-2 hover:border-fg-subtle",
                  )}
                >
                  <input type="radio" name="modalidad" value={m.value} checked={on} onChange={() => setMode(m.value)} className="sr-only" />
                  <Icon aria-hidden className={cn("mt-0.5 size-5 shrink-0", on ? "text-copper-text" : "text-fg-muted")} />
                  <span>
                    <span className="block text-sm font-semibold">{m.label}</span>
                    <span className="block text-xs text-fg-muted">{m.detail}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-sm font-semibold">Elige el día</legend>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {days.length === 0
              ? Array.from({ length: 12 }, (_, i) => <span key={i} className="h-[70px] animate-pulse rounded-xl bg-surface-2" />)
              : days.map((d) => {
                  const on = d === date;
                  const { wd, num, mon } = dayParts(d);
                  return (
                    <label
                      key={d}
                      className={cn(
                        "grid cursor-pointer place-items-center rounded-xl border px-1 py-2 text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-copper/50",
                        on ? "border-copper bg-copper text-white" : "border-border-strong bg-surface-2 hover:border-fg-subtle",
                      )}
                    >
                      <input
                        type="radio"
                        name="fecha"
                        value={d}
                        checked={on}
                        onChange={() => {
                          setDate(d);
                          if (time && isTaken(d, time)) setTime("");
                        }}
                        className="sr-only"
                      />
                      <span className={cn("text-[11px] capitalize", on ? "text-white/80" : "text-fg-muted")}>{wd}</span>
                      <span className="font-mono text-lg leading-tight font-semibold tabular">{num}</span>
                      <span className={cn("text-[11px]", on ? "text-white/80" : "text-fg-muted")}>{mon}</span>
                    </label>
                  );
                })}
          </div>
          <FieldError message={errors.fecha} />
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-sm font-semibold">Elige la hora · {MEETING_MINUTES} minutos, hora de Colombia</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {MEETING_SLOTS.map((t) => {
              const busy = date ? isTaken(date, t) : false;
              const on = t === time;
              return (
                <label
                  key={t}
                  className={cn(
                    "rounded-xl border px-2 py-2.5 text-center font-mono text-sm tabular transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-copper/50",
                    busy ? "cursor-not-allowed border-border bg-surface-2 text-fg-subtle line-through" : "cursor-pointer",
                    !busy && (on ? "border-copper bg-copper text-white" : "border-border-strong bg-surface-2 hover:border-fg-subtle"),
                  )}
                >
                  <input type="radio" name="hora" value={t} checked={on} disabled={busy} onChange={() => setTime(t)} className="sr-only" />
                  {formatMeetingTime(t)}
                  {busy && <span className="sr-only"> (ocupada)</span>}
                </label>
              );
            })}
          </div>
          <FieldError message={errors.hora} />
        </fieldset>

        {date && time && (
          <p className="mt-6 flex items-start gap-2 rounded-2xl bg-positive-soft p-4 text-sm">
            <CalendarCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-positive" />
            <span>
              Tu reunión: <strong className="capitalize">{formatMeetingDay(date)}</strong> a las <strong>{formatMeetingTime(time)}</strong> ·{" "}
              {mode === "virtual" ? "videollamada" : "presencial en Itagüí"}.
            </span>
          </p>
        )}
      </div>

      {/* Tus datos */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="r-nombre" label="Nombre completo" error={errors.nombre} className="sm:col-span-2">
            <Input id="r-nombre" autoComplete="name" value={values.nombre} onChange={set("nombre")} aria-invalid={Boolean(errors.nombre)} />
          </Field>
          <Field id="r-email" label="Correo electrónico" error={errors.email}>
            <Input id="r-email" type="email" autoComplete="email" value={values.email} onChange={set("email")} aria-invalid={Boolean(errors.email)} />
          </Field>
          <Field id="r-celular" label="Celular / WhatsApp" error={errors.celular}>
            <Input id="r-celular" type="tel" inputMode="tel" autoComplete="tel" value={values.celular} onChange={set("celular")} aria-invalid={Boolean(errors.celular)} />
          </Field>
          <Field id="r-empresa" label="Empresa (opcional)">
            <Input id="r-empresa" autoComplete="organization" value={values.empresa} onChange={set("empresa")} />
          </Field>
          <Field id="r-ciudad" label="Ciudad" error={errors.ciudad}>
            <Input id="r-ciudad" autoComplete="address-level2" value={values.ciudad} onChange={set("ciudad")} aria-invalid={Boolean(errors.ciudad)} />
          </Field>
          <Field id="r-perfil" label="Tu perfil" error={errors.perfil}>
            <Select
              id="r-perfil"
              value={values.perfil}
              onChange={set("perfil")}
              aria-invalid={Boolean(errors.perfil)}
              className={cn("transition-shadow duration-500", profileFlash && "border-copper ring-4 ring-copper/30")}
            >
              <option value="">Selecciona…</option>
              {PARTNER_PROFILES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
          </Field>
          <Field id="r-referidos" label="¿Cuántos clientes podrías referir?" error={errors.referidosEsperados}>
            <Select id="r-referidos" value={values.referidosEsperados} onChange={set("referidosEsperados")} aria-invalid={Boolean(errors.referidosEsperados)}>
              <option value="">Selecciona…</option>
              {EXPECTED_REFERRALS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
          </Field>
          <Field id="r-mensaje" label="¿Algo que debamos saber? (opcional)" className="sm:col-span-2">
            <Textarea id="r-mensaje" value={values.mensaje} onChange={set("mensaje")} placeholder="Tu experiencia, el tipo de clientes que conoces, tu zona…" className="min-h-24" maxLength={1000} />
          </Field>
        </div>

        <label className="mt-5 flex items-start gap-3 text-sm text-fg-muted">
          <input type="checkbox" checked={values.consentimiento} onChange={set("consentimiento")} className="mt-0.5 size-4 shrink-0 accent-[var(--copper)]" aria-invalid={Boolean(errors.consentimiento)} />
          <span>
            Autorizo a Solartech el tratamiento de mis datos personales para agendar esta reunión y contactarme sobre el programa de referidos, conforme a la{" "}
            <Link href="/politica-de-privacidad/" target="_blank" className="text-copper-text underline underline-offset-2">
              política de tratamiento de datos
            </Link>{" "}
            (Ley 1581 de 2012).
          </span>
        </label>
        <FieldError message={errors.consentimiento} />

        {TURNSTILE_SITE_KEY && (
          <div className="mt-4">
            <Turnstile siteKey={TURNSTILE_SITE_KEY} onSuccess={setToken} onExpire={() => setToken(null)} options={{ theme: "auto", language: "es", size: "flexible" }} />
          </div>
        )}

        {submitError && (
          <p role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            {submitError}
          </p>
        )}

        <Button type="submit" size="lg" className="mt-6 w-full" disabled={sending}>
          {sending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <CalendarCheck aria-hidden className="size-4" />}
          {sending ? "Agendando…" : "Agendar mi reunión"}
        </Button>
      </div>
    </form>
  );
}

function Field({ id, label, error, className, children }: { id: string; label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

function Confirmation({ event, id, mode, name }: { event: CalendarEvent; id: string; mode: Mode; name: string }) {
  const download = () => {
    const url = URL.createObjectURL(new Blob([icsFile(event, id)], { type: "text/calendar;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "reunion-solartech-referidos.ics" });
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div role="status" className="rounded-3xl border border-copper/40 bg-surface p-6 sm:p-10">
      <span className="grid size-12 place-items-center rounded-full bg-positive text-white">
        <Check aria-hidden className="size-6" />
      </span>
      <h3 className="mt-5 text-2xl font-extrabold">¡Listo, {name.split(" ")[0]}! Recibimos tu solicitud</h3>
      <p className="mt-2 max-w-2xl text-fg-muted">
        Reunión el <strong className="text-fg capitalize">{formatMeetingDay(event.date)}</strong> a las <strong className="text-fg">{formatMeetingTime(event.time)}</strong> (
        {mode === "virtual" ? "videollamada" : "presencial en Itagüí"}). Un asesor te confirmará la cita
        {mode === "virtual" ? " y te enviará el enlace de la videollamada" : ""}. También te llegó un correo con los detalles.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full bg-copper px-5 text-sm font-semibold text-white hover:bg-copper-hover">
          <CalendarPlus aria-hidden className="size-4" />
          Agregar a Google Calendar
        </a>
        <button type="button" onClick={download} className="inline-flex h-11 items-center gap-2 rounded-full border border-border-strong px-5 text-sm font-semibold hover:border-copper-text">
          <Download aria-hidden className="size-4" />
          Outlook / Apple (.ics)
        </button>
        <a
          href={whatsappUrl(`Hola Solartech, soy ${name}. Agendé una reunión del programa de referidos para el ${formatMeetingDay(event.date)} a las ${formatMeetingTime(event.time)}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border-strong px-5 text-sm font-semibold hover:border-copper-text"
        >
          <MessageCircle aria-hidden className="size-4" />
          Escribir por WhatsApp
        </a>
      </div>
    </div>
  );
}
