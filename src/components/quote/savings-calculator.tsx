"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, Building2, Home, Sprout } from "lucide-react";
import { Label, Select } from "@/components/ui/field";
import { NumberInput } from "@/components/quote/number-input";
import { clientTypes } from "@/components/quote/options";
import { hspByDepartment, type ClientType } from "@/config/quote-config";
import { computeQuote, QuoteError, referenceTariff } from "@/lib/quote-engine";
import { pushEvent } from "@/lib/analytics";
import { buttonClass } from "@/components/ui/button";
import { cn, formatCOP, formatCOPCompact, formatNumber } from "@/lib/utils";

const iconFor = { empresa: Building2, agro: Sprout, hogar: Home } as const;
const QUICK_BILLS = [1_000_000, 5_000_000, 15_000_000, 40_000_000];

/** Calculadora rápida: factura → ahorro estimado, en vivo. Sin datos de contacto.
    La inversión y el retorno se ven en el cotizador completo (usa los mismos cálculos). */
export function SavingsCalculator() {
  const [clientType, setClientType] = useState<ClientType>("empresa");
  const [departamento, setDepartamento] = useState("Antioquia");
  const [municipio, setMunicipio] = useState("Medellín");
  const [bill, setBill] = useState("5000000");
  const started = useRef(false);

  const municipios = useMemo(() => hspByDepartment.find((d) => d.departamento === departamento)?.municipios ?? [], [departamento]);
  const tariff = referenceTariff(departamento);

  const outcome = useMemo(() => {
    const billCop = Number(bill);
    if (!billCop || !municipio) return { error: "Ingresa el valor de tu factura." } as const;
    try {
      return { quote: computeQuote({ clientType, departamento, municipio, billCop, tariffCopKwh: tariff, batteries: false, modelInterest: "no_se" }) } as const;
    } catch (err) {
      return { error: err instanceof QuoteError ? err.message : "No pudimos calcular con estos datos." } as const;
    }
  }, [bill, clientType, departamento, municipio, tariff]);

  function start() {
    if (started.current) return;
    started.current = true;
    pushEvent("quote_start", { location: "calculadora_ahorro" });
  }

  const q = "quote" in outcome ? outcome.quote : null;
  const cotizadorHref = `/cotizador/?${new URLSearchParams({ tipo: clientType, dep: departamento, mun: municipio, factura: bill })}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <form onChange={start} onSubmit={(e) => e.preventDefault()} className="rounded-3xl border border-border bg-surface p-5 sm:p-8" aria-label="Datos para calcular tu ahorro">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">¿Para quién es?</legend>
          <div className="grid grid-cols-3 gap-2">
            {clientTypes.map((c) => {
              const Icon = iconFor[c.value];
              const checked = clientType === c.value;
              return (
                <label
                  key={c.value}
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-copper/50",
                    checked ? "border-copper bg-copper-soft text-fg" : "border-border-strong bg-surface-2 text-fg-muted hover:text-fg",
                  )}
                >
                  <input type="radio" name="tipo" value={c.value} checked={checked} onChange={() => setClientType(c.value)} className="sr-only" />
                  <Icon aria-hidden className={cn("size-5", checked && "text-copper-text")} />
                  {c.title}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="calc-dep">Departamento</Label>
            <Select
              id="calc-dep"
              value={departamento}
              onChange={(e) => {
                const dep = e.target.value;
                setDepartamento(dep);
                setMunicipio(hspByDepartment.find((d) => d.departamento === dep)?.municipios[0]?.nombre ?? "");
              }}
            >
              {hspByDepartment.map((d) => (
                <option key={d.departamento}>{d.departamento}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="calc-mun">Municipio</Label>
            <Select id="calc-mun" value={municipio} onChange={(e) => setMunicipio(e.target.value)}>
              {municipios.map((m) => (
                <option key={m.nombre}>{m.nombre}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-5">
          <Label htmlFor="calc-bill">Tu factura de energía mensual</Label>
          <NumberInput id="calc-bill" prefix="$" suffix="COP" value={bill} onValueChange={setBill} />
          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK_BILLS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  start();
                  setBill(String(v));
                }}
                className={cn(
                  "h-8 rounded-full border px-3 font-mono text-xs tabular transition-colors",
                  Number(bill) === v ? "border-copper bg-copper-soft text-fg" : "border-border-strong text-fg-muted hover:text-fg",
                )}
              >
                {formatCOPCompact(v)}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-fg-subtle">
            Calculamos con una tarifa de referencia de {formatCOP(tariff)}/kWh para {departamento}. En el cotizador puedes poner la de tu factura.
          </p>
        </div>
      </form>

      <section aria-live="polite" aria-label="Tu ahorro estimado" className="relative overflow-hidden rounded-3xl border border-copper/40 bg-surface p-5 sm:p-8">
        <div aria-hidden className="glow-copper pointer-events-none absolute inset-x-0 -top-24 h-48" />
        {q ? (
          <div className="relative">
            <p className="text-sm text-fg-muted">Podrías ahorrar cada mes</p>
            <p className="mt-1 font-mono text-4xl font-semibold tracking-tight text-positive tabular sm:text-5xl">
              {formatCOPCompact(q.savings.monthlyCop * 0.9)} – {formatCOPCompact(q.savings.monthlyCop * 1.1)}
            </p>
            <p className="mt-2 text-sm text-fg-muted">
              Unos <span className="font-mono font-semibold text-fg tabular">{formatCOPCompact(q.savings.yearlyCop)}</span> al año, que crecen con el alza de la tarifa.
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
              {[
                ["Sistema", `${formatNumber(q.system.kwp)} kWp`],
                ["Paneles", `${q.system.panels}`],
                ["Área", `${formatNumber(q.system.areaM2, 0)} m²`],
                ["Cobertura", `${Math.round(q.energy.coverage * 100)} %`],
              ].map(([label, value]) => (
                <div key={label} className="bg-surface-2 p-4">
                  <dt className="text-[11px] text-fg-muted">{label}</dt>
                  <dd className="mt-1 font-mono text-lg font-semibold whitespace-nowrap tabular">{value}</dd>
                </div>
              ))}
            </dl>

            {q.ppa.available && (
              <p className="mt-5 rounded-2xl bg-positive-soft p-4 text-sm">
                <strong>Sin invertir (PPA):</strong> pagarías la energía solar a {formatCOP(q.ppa.tariffCopKwh)}/kWh y ahorrarías cerca de{" "}
                <span className="font-mono font-semibold tabular">{formatCOPCompact(q.ppa.monthlySavingsCop)}</span> al mes.
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={cotizadorHref} className={buttonClass({ size: "lg" })} onClick={() => pushEvent("cta_cotizar", { location: "calculadora_ahorro" })}>
                Ver inversión y retorno
                <ArrowRight aria-hidden className="size-4" />
              </Link>
              <p className="text-xs text-fg-subtle">Te llevamos al cotizador con estos datos. Toma menos de un minuto.</p>
            </div>
          </div>
        ) : (
          <p className="relative py-10 text-center text-fg-muted">{"error" in outcome ? outcome.error : null}</p>
        )}
      </section>
    </div>
  );
}
