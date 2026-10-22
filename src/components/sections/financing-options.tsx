import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { financingOptions } from "@/content/sales-deck";
import { partners } from "@/content/partners";
import { whatsappUrl } from "@/content/site";
import { cn } from "@/lib/utils";

const leasingMessage = "Hola Solartech. Quiero información sobre financiar mi proyecto solar con leasing.";

/** EPC · PPA · Leasing: las tres formas de pagar el proyecto (presentación industria). */
export function FinancingOptions({ highlight }: { highlight?: (typeof financingOptions)[number]["key"] }) {
  const banks = partners.filter((p) => p.kind === "financiación").map((p) => p.name);
  return (
    <ul className="grid gap-4 lg:grid-cols-3">
      {financingOptions.map((o) => {
        const isLeasing = o.key === "leasing";
        const href = isLeasing ? whatsappUrl(leasingMessage) : o.href;
        return (
          <li key={o.key}>
            <div className={cn("flex h-full flex-col rounded-3xl border bg-surface p-6 sm:p-8", highlight === o.key ? "border-copper/60" : "border-border")}>
              <h3 className="text-xl font-extrabold">{o.name}</h3>
              <ul className="mt-5 space-y-3">
                {o.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-positive-soft">
                      <Check aria-hidden className="size-3.5 text-positive" />
                    </span>
                    <span className="text-fg-muted">{point}</span>
                  </li>
                ))}
              </ul>
              {isLeasing && <p className="mt-5 text-xs text-fg-subtle">Con la banca aliada: {banks.join(", ")}.</p>}
              <div className="mt-auto pt-6">
                {isLeasing ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" data-event="whatsapp_click" className="inline-flex items-center gap-1 text-sm font-semibold text-copper-text hover:underline">
                    Consultar leasing
                    <ArrowUpRight aria-hidden className="size-4" />
                  </a>
                ) : (
                  <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-copper-text hover:underline">
                    Ver {o.key.toUpperCase()}
                    <ArrowUpRight aria-hidden className="size-4" />
                  </Link>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
