"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, Building2, Home, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError, Label, Select } from "@/components/ui/field";
import { NumberInput } from "@/components/quote/number-input";
import { clientTypes } from "@/components/quote/options";
import { hspByDepartment, type ClientType } from "@/config/quote-config";
import { pushEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const iconFor = { empresa: Building2, agro: Sprout, hogar: Home } as const;

/** Paso 1 del cotizador embebido en el hero del home. Continúa en /cotizador/. */
export function QuoteStarter() {
  const router = useRouter();
  const [clientType, setClientType] = useState<ClientType>("empresa");
  const [departamento, setDepartamento] = useState("Antioquia");
  const [municipio, setMunicipio] = useState("Medellín");
  const [factura, setFactura] = useState("");
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  const municipios = useMemo(() => hspByDepartment.find((d) => d.departamento === departamento)?.municipios ?? [], [departamento]);

  function start() {
    if (started.current) return;
    started.current = true;
    pushEvent("quote_start", { location: "home_hero" });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!municipio) return setError("Elige tu municipio");
    pushEvent("quote_step_1", { location: "home_hero", client_type: clientType });
    const q = new URLSearchParams({ tipo: clientType, dep: departamento, mun: municipio });
    if (factura) q.set("factura", factura);
    router.push(`/cotizador/?${q}`);
  }

  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-px -z-10 rounded-[28px] bg-gradient-to-b from-copper/60 via-border to-transparent" />
      <form onSubmit={submit} onChange={start} className="rounded-[27px] bg-surface/95 p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-7" aria-labelledby="starter-title">
        <div className="flex items-center justify-between">
          <p id="starter-title" className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">
            Cotizador · Paso 1 de 4
          </p>
          <span className="font-mono text-[11px] text-positive">Gratis · 60 s</span>
        </div>
        <p className="mt-4 text-xl font-extrabold">Calcula cuánto ahorrarías</p>

        <fieldset className="mt-5">
          <legend className="sr-only">Tipo de cliente</legend>
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

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="starter-dep" className="text-xs">
              Departamento
            </Label>
            <Select
              id="starter-dep"
              value={departamento}
              onChange={(e) => {
                setDepartamento(e.target.value);
                setMunicipio("");
              }}
            >
              {hspByDepartment.map((d) => (
                <option key={d.departamento}>{d.departamento}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="starter-mun" className="text-xs">
              Municipio
            </Label>
            <Select id="starter-mun" value={municipio} onChange={(e) => {
                setMunicipio(e.target.value);
                setError(null);
              }} aria-invalid={Boolean(error)}>
              <option value="">Selecciona…</option>
              {municipios.map((m) => (
                <option key={m.nombre}>{m.nombre}</option>
              ))}
            </Select>
          </div>
        </div>
        <FieldError message={error ?? undefined} />

        <div className="mt-4">
          <Label htmlFor="starter-factura" className="text-xs">
            Factura de energía mensual
          </Label>
          <NumberInput id="starter-factura" prefix="$" suffix="COP" placeholder="5.000.000" value={factura} onValueChange={setFactura} />
        </div>

        <Button type="submit" size="lg" className="mt-5 w-full">
          Calcular mi ahorro
          <ArrowRight aria-hidden className="size-4" />
        </Button>
        <p className="mt-3 text-center text-[11px] text-fg-subtle">Sin compromiso. Resultado en pantalla.</p>
      </form>
    </div>
  );
}
