"use client";

import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CashFlowPoint } from "@/lib/quote-engine";
import { formatCOP, formatCOPCompact } from "@/lib/utils";

/** Flujo de caja acumulado: inversión en el año 0 y punto de equilibrio. */
export function CashflowChart({ data, withTax }: { data: CashFlowPoint[]; withTax: boolean }) {
  const key = withTax ? "cumulativeWithTax" : "cumulative";
  const min = Math.min(...data.map((d) => d[key]));
  const max = Math.max(...data.map((d) => d[key]));
  const zeroOffset = max <= 0 ? 0 : min >= 0 ? 1 : max / (max - min);

  return (
    <div className="h-72 w-full sm:h-80" role="img" aria-label="Gráfica del flujo de caja acumulado durante 25 años">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="cashflow-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset={0} stopColor="var(--positive)" stopOpacity={0.35} />
              <stop offset={zeroOffset} stopColor="var(--positive)" stopOpacity={0.05} />
              <stop offset={zeroOffset} stopColor="var(--copper)" stopOpacity={0.05} />
              <stop offset={1} stopColor="var(--copper)" stopOpacity={0.35} />
            </linearGradient>
            <linearGradient id="cashflow-stroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset={zeroOffset} stopColor="var(--positive)" />
              <stop offset={zeroOffset} stopColor="var(--copper-text)" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: "var(--fg-subtle)", fontSize: 11 }} tickFormatter={(y) => (y % 5 === 0 ? `Año ${y}` : "")} interval={0} />
          <YAxis tickLine={false} axisLine={false} width={64} tick={{ fill: "var(--fg-subtle)", fontSize: 11 }} tickFormatter={(v) => formatCOPCompact(v)} />
          <ReferenceLine y={0} stroke="var(--fg-subtle)" strokeDasharray="4 4" />
          <Tooltip
            cursor={{ stroke: "var(--border-strong)" }}
            contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: 12, fontSize: 12 }}
            labelStyle={{ color: "var(--fg-muted)" }}
            labelFormatter={(y) => `Año ${y}`}
            formatter={(v) => [formatCOP(Number(v)), "Acumulado"]}
          />
          <Area type="monotone" dataKey={key} stroke="url(#cashflow-stroke)" strokeWidth={2.5} fill="url(#cashflow-fill)" isAnimationActive />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
