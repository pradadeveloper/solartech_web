import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/sections/section";
import { CtaBand } from "@/components/sections/cta-band";
import { ButtonLink } from "@/components/ui/button";
import { solutions } from "@/content/solutions";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Soluciones de energía solar por sector",
  description: "Energía solar para empresas, agro, hogares y sistemas híbridos con baterías. Soluciones a la medida de tu consumo en Colombia. Calcula tu ahorro.",
  path: "/soluciones/",
});

export default function SolucionesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Soluciones"
        title="Energía solar diseñada para tu tipo de operación"
        description={
          <p>
            Una industria, una finca y un hogar consumen energía de forma distinta. Diseñamos cada sistema según tu perfil de consumo, tu espacio disponible y tu
            necesidad de respaldo.
          </p>
        }
        crumbs={[{ name: "Soluciones", path: "/soluciones/" }]}
        actions={
          <ButtonLink href="/cotizador/" size="lg" data-event="cta_cotizar_soluciones">
            Calcular mi ahorro
            <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        }
      />

      <Section id="segmentos" eyebrow="Por segmento" title="Encuentra la solución para tu caso">
        <ul className="grid gap-4 md:grid-cols-2">
          {solutions.map((s) => (
            <li key={s.slug}>
              <Link href={s.path} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-colors hover:border-copper/60">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-extrabold">{s.name}</h3>
                    <ArrowUpRight aria-hidden className="size-5 shrink-0 text-fg-subtle group-hover:text-copper-text" />
                  </div>
                  <p className="mt-3 text-sm text-fg-muted">{s.intro}</p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                    {s.useCases.slice(0, 3).map((u) => (
                      <li key={u} className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs">
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand />
    </>
  );
}
