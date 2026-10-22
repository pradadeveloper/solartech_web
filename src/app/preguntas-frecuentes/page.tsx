import Link from "next/link";
import { PageHeader } from "@/components/sections/page-header";
import { FaqList } from "@/components/sections/faq-list";
import { CtaBand } from "@/components/sections/cta-band";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/seo/json-ld";
import { faqs, type Faq } from "@/content/faq";
import { getService } from "@/content/services";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Preguntas frecuentes sobre paneles solares",
  description: "Resolvemos tus dudas sobre paneles solares: ahorro, mantenimiento, permisos, PPA, EPC y gestión de plantas. Calcula tu ahorro en 1 minuto.",
  path: "/preguntas-frecuentes/",
});

const groups: { id: string; title: string; href?: string; items: Faq[] }[] = [
  { id: "general", title: "Energía solar en general", items: faqs },
  { id: "ppa", title: "PPA · Energía sin inversión", href: "/servicios/ppa/", items: getService("ppa").faqs },
  { id: "epc", title: "EPC · Proyectos llave en mano", href: "/servicios/epc/", items: getService("epc").faqs },
  { id: "gestion", title: "Gestión de plantas · O&M", href: "/servicios/gestion-de-plantas/", items: getService("gestion-de-plantas").faqs },
];

export default function PreguntasFrecuentesPage() {
  const all = groups.flatMap((g) => g.items);
  return (
    <>
      <PageHeader
        eyebrow="Centro de ayuda"
        title="Preguntas frecuentes sobre paneles solares"
        description="Todo lo que necesitas saber antes de invertir en energía solar: funcionamiento, ahorro, mantenimiento y modelos de negocio."
        crumbs={[{ name: "Preguntas frecuentes", path: "/preguntas-frecuentes/" }]}
      />

      <Container className="grid gap-12 py-16 lg:grid-cols-[220px_1fr] lg:py-24">
        <nav aria-label="Temas" className="lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">Temas</p>
          <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {groups.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="block rounded-full border border-border px-3 py-1.5 text-sm text-fg-muted hover:text-fg lg:rounded-xl lg:border-0 lg:px-3 lg:py-2 lg:hover:bg-surface-2">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-16">
          {groups.map((g) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="scroll-mt-24">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <h2 id={`${g.id}-title`} className="text-2xl font-extrabold sm:text-3xl">
                  {g.title}
                </h2>
                {g.href && (
                  <Link href={g.href} className="text-sm font-semibold text-copper-text hover:underline">
                    Ver el servicio →
                  </Link>
                )}
              </div>
              <FaqList items={g.items} schema={false} />
            </section>
          ))}
        </div>
      </Container>

      <JsonLd data={faqJsonLd(all)} />
      <CtaBand title="¿Tienes otra pregunta?" text="Escríbenos por WhatsApp o calcula tu ahorro con el cotizador. Un asesor revisará tu caso sin compromiso." />
    </>
  );
}
