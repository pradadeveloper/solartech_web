"use client";

import { useState } from "react";
import { CalendarCheck, Download, Info, Leaf, Loader2, MessageCircle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Delta, Eyebrow } from "@/components/ui/badge";
import { CashflowChart } from "@/components/quote/cashflow-chart";
import type { QuoteSteps } from "@/lib/lead-schema";
import type { QuoteResult } from "@/lib/quote-engine";
import { whatsappUrl } from "@/content/site";
import { pushEvent } from "@/lib/analytics";
import { cn, formatCOP, formatCOPCompact, formatNumber } from "@/lib/utils";

type Props = { result: QuoteResult; input: QuoteSteps; name: string };

export const QUOTE_DISCLAIMER = "Pre-cotización referencial. La propuesta final requiere visita técnica y análisis de factura.";

export function QuoteResults({ result: r, input, name }: Props) {
  const [withTax, setWithTax] = useState(r.tax.eligible);
  const [downloading, setDownloading] = useState(false);
  const firstName = name.split(" ")[0];
  const payback = withTax && r.payback.yearsWithTax ? r.payback.yearsWithTax : r.payback.years;

  const summary = `sistema de ${formatNumber(r.system.kwp)} kWp en ${input.municipio}, ahorro estimado de ${formatCOP(r.savings.monthlyCop)} al mes`;
  const whatsappAdvisor = whatsappUrl(`Hola Solartech, soy ${name}. Hice una pre-cotización en la web: ${summary}. Quiero hablar con un asesor.`);
  const whatsappVisit = whatsappUrl(`Hola Solartech, soy ${name}. Quiero agendar la visita técnica para mi proyecto (${summary}).`);

  async function downloadPdf() {
    setDownloading(true);
    try {
      const res = await fetch("/api/quote-pdf/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input, name }) });
      if (!res.ok) throw new Error();
      const url = URL.createObjectURL(await res.blob());
      const a = Object.assign(document.createElement("a"), { href: url, download: "pre-cotizacion-solartech.pdf" });
      a.click();
      URL.revokeObjectURL(url);
      pushEvent("pdf_download", { kwp: r.system.kwp });
    } catch {
      alert("No pudimos generar el PDF. También te lo enviamos a tu correo.");
    } finally {
      setDownloading(false);
    }
  }

  const kpis = [
    { label: "Sistema solar", value: `${formatNumber(r.system.kwp)} kWp`, sub: `${r.system.panels} paneles de ${r.system.panelWp} W` },
    { label: "Área requerida", value: `${formatNumber(r.system.areaM2, 0)} m²`, sub: `Cubre ${Math.round(r.energy.coverage * 100)} % de tu consumo` },
    { label: "Generación", value: `${formatNumber(r.energy.generationKwhMonth, 0)} kWh`, sub: "por mes" },
    { label: "Ahorro a 25 años", value: formatCOPCompact(r.savings.lifetimeCop), sub: "con alza de tarifa y degradación", positive: true },
    { label: "CO₂ evitado", value: `${formatNumber(r.environment.co2TonYear)} t/año`, sub: `≈ ${formatNumber(r.environment.trees, 0)} árboles` },
    r.tax.eligible
      ? { label: "Beneficio tributario", value: formatCOPCompact(r.tax.taxSavingCop), sub: "Deducción Ley 1715 (estimado)", positive: true }
      : { label: "Inversión por kWp", value: formatCOPCompact(r.investment.copPerKwp), sub: "antes de IVA" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-copper/40 bg-surface p-6 sm:p-8">
        <Eyebrow live>Pre-cotización lista</Eyebrow>
        <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
          {firstName}, tu planta solar podría ahorrarte <span className="text-positive">{formatCOP(r.savings.monthlyCop)}</span> al mes
        </h2>
        <p className="mt-3 text-fg-muted">Te enviamos este resumen y el PDF a tu correo. Un asesor te contactará para revisar tu factura.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-surface-2 p-5">
            <p className="text-xs text-fg-muted">Inversión estimada</p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular">
              {formatCOPCompact(r.investment.lowCop)} – {formatCOPCompact(r.investment.highCop)}
            </p>
            <p className="mt-1 text-xs text-fg-subtle">
              Rango ±15 %, IVA incluido{r.investment.batteryKwh > 0 ? ` · incluye ${r.investment.batteryKwh} kWh de baterías` : ""}
            </p>
          </div>
          <div className="rounded-2xl bg-surface-2 p-5">
            <p className="text-xs text-fg-muted">Retorno de la inversión</p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular">{payback ? `${formatNumber(payback)} años` : "Más de 25 años"}</p>
            <p className="mt-1 text-xs text-fg-subtle">{withTax && r.payback.yearsWithTax ? "Con beneficio tributario" : "Sin beneficio tributario"}</p>
          </div>
          <div className="rounded-2xl bg-surface-2 p-5">
            <p className="text-xs text-fg-muted">Ahorro anual (año 1)</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-positive tabular">{formatCOPCompact(r.savings.yearlyCop)}</p>
            <p className="mt-1 text-xs text-fg-subtle">Crece con el alza de la tarifa</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={whatsappAdvisor} external variant="whatsapp" size="lg" onClick={() => pushEvent("whatsapp_click", { location: "quote_result" })}>
            <MessageCircle aria-hidden className="size-4" />
            Hablar con un asesor
          </ButtonLink>
          <Button variant="secondary" size="lg" onClick={downloadPdf} disabled={downloading}>
            {downloading ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Download aria-hidden className="size-4" />}
            Descargar PDF
          </Button>
          <ButtonLink href={whatsappVisit} external variant="secondary" size="lg" onClick={() => pushEvent("whatsapp_click", { location: "quote_result_visit" })}>
            <CalendarCheck aria-hidden className="size-4" />
            Agendar visita técnica
          </ButtonLink>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">Flujo de caja acumulado</h3>
              <p className="mt-1 text-sm text-fg-muted">Compra del sistema (EPC) · 25 años</p>
            </div>
            {r.tax.eligible && (
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-fg-muted">
                <input type="checkbox" checked={withTax} onChange={(e) => setWithTax(e.target.checked)} className="size-4 accent-[var(--copper)]" />
                Incluir beneficio tributario
              </label>
            )}
          </div>
          <div className="mt-6">
            <CashflowChart data={r.cashFlow} withTax={withTax} />
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-3">
          {kpis.map((k) => (
            <li key={k.label} className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-[11px] text-fg-muted">{k.label}</p>
              <p className={cn("mt-1 font-mono text-lg font-semibold tabular", k.positive && "text-positive")}>{k.value}</p>
              <p className="mt-0.5 text-[11px] text-fg-subtle">{k.sub}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {r.ppa.available && (
          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
            <p className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">Alternativa sin inversión</p>
            <h3 className="mt-3 text-xl font-bold">PPA: inversión $0</h3>
            <p className="mt-2 text-sm text-fg-muted">Instalamos y operamos la planta. Pagas la energía solar con descuento sobre tu tarifa actual.</p>
            <dl className="mt-5 divide-y divide-border text-sm">
              <div className="flex justify-between py-2.5">
                <dt className="text-fg-muted">Tu tarifa actual</dt>
                <dd className="font-mono tabular">{formatCOP(input.tariffCopKwh)}/kWh</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-fg-muted">Tarifa solar PPA</dt>
                <dd className="flex items-center gap-2 font-mono tabular">
                  {formatCOP(r.ppa.tariffCopKwh)}/kWh <Delta>{Math.round(r.ppa.discount * 100)} %</Delta>
                </dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-fg-muted">Ahorro mensual estimado</dt>
                <dd className="font-mono text-positive tabular">{formatCOP(r.ppa.monthlySavingsCop)}</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-fg-muted">Ahorro en {r.ppa.termYears} años</dt>
                <dd className="font-mono text-positive tabular">{formatCOPCompact(r.ppa.termSavingsCop)}</dd>
              </div>
            </dl>
          </div>
        )}

        {r.similarProject && (
          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
            <p className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">Un proyecto parecido al tuyo</p>
            <h3 className="mt-3 text-xl font-bold">
              {r.similarProject.name} · {r.similarProject.city}
            </h3>
            <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-[11px] text-fg-muted">Potencia</dt>
                <dd className="mt-1 font-mono font-semibold tabular">{formatNumber(r.similarProject.kwp)} kWp</dd>
              </div>
              <div>
                <dt className="text-[11px] text-fg-muted">Ahorro / mes</dt>
                <dd className="mt-1 font-mono font-semibold text-positive tabular">
                  {r.similarProject.monthlySavingsCop !== null ? formatCOPCompact(r.similarProject.monthlySavingsCop) : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-fg-muted">{r.similarProject.paybackYears ? "Retorno real" : "Modelo"}</dt>
                <dd className="mt-1 font-mono font-semibold tabular">{r.similarProject.paybackYears ? `${formatNumber(r.similarProject.paybackYears)} años` : r.similarProject.model}</dd>
              </div>
            </dl>
            <p className="mt-5 flex items-start gap-2 text-xs text-fg-subtle">
              <Leaf aria-hidden className="mt-0.5 size-3.5 shrink-0 text-positive" />
              Cifras reales de un proyecto construido por Solartech.
            </p>
          </div>
        )}
      </div>

      <p className="flex items-start gap-2 rounded-2xl border border-border bg-surface-2 p-4 text-xs text-fg-muted">
        <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
        <span>
          {QUOTE_DISCLAIMER} El beneficio tributario es informativo: requiere certificación de la UPME y depende de tu situación como declarante de renta. Parámetros{" "}
          {r.version}.
        </span>
      </p>
    </div>
  );
}
