import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const copFormatter = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const numberFormatter = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 });

export function formatCOP(value: number) {
  return copFormatter.format(value);
}

/** $55M, $1,5M, $1.344M — formato compacto (millones) para tarjetas de cifras. */
export function formatCOPCompact(value: number) {
  if (Math.abs(value) >= 1_000_000_000) return `$${formatNumber(value / 1_000_000, 0)}M`;
  if (Math.abs(value) >= 1_000_000) return `$${numberFormatter.format(value / 1_000_000)}M`;
  return formatCOP(value);
}

export function formatNumber(value: number, fractionDigits = 1) {
  return new Intl.NumberFormat("es-CO", { maximumFractionDigits: fractionDigits }).format(value);
}

export function absoluteUrl(path: string, base: string) {
  return new URL(path, base).toString();
}
