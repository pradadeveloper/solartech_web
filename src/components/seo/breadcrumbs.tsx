import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";
import { cn } from "@/lib/utils";

/** Migas de pan visibles + BreadcrumbList. "Inicio" se agrega automáticamente. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const crumbs: Crumb[] = [{ name: "Inicio", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Migas de pan" className={cn("text-xs text-fg-subtle", className)}>
        <ol className="flex flex-wrap items-center gap-1">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={c.path} className="inline-flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="text-fg-muted">
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.path} className="hover:text-fg">
                      {c.name}
                    </Link>
                    <ChevronRight aria-hidden className="size-3" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
