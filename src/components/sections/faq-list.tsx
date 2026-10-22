import { Plus } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import type { Faq } from "@/content/faq";
import { faqJsonLd } from "@/lib/seo";

/** Acordeón accesible sin JS (<details>). Emite FAQPage salvo que se desactive
    (solo debe haber un FAQPage por URL). */
export function FaqList({ items, schema = true }: { items: Faq[]; schema?: boolean }) {
  return (
    <>
      <div className="divide-y divide-border rounded-3xl border border-border bg-surface">
        {items.map((f) => (
          <details key={f.q} className="group px-6 sm:px-8 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-semibold">
              <h3 className="text-base sm:text-lg">{f.q}</h3>
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-fg-muted transition-transform group-open:rotate-45 group-open:border-copper group-open:text-copper-text">
                <Plus aria-hidden className="size-4" />
              </span>
            </summary>
            <p className="-mt-1 pb-6 text-fg-muted">{f.a}</p>
          </details>
        ))}
      </div>
      {schema && <JsonLd data={faqJsonLd(items)} />}
    </>
  );
}
