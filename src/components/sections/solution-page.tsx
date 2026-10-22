import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { Section, Card } from "@/components/sections/section";
import { ProjectCard } from "@/components/sections/project-card";
import { ProcessSteps } from "@/components/sections/process-steps";
import { FaqList } from "@/components/sections/faq-list";
import { CtaBand } from "@/components/sections/cta-band";
import { ButtonLink } from "@/components/ui/button";
import { getProject, type Project } from "@/content/projects";
import { getService } from "@/content/services";
import { site, whatsappUrl } from "@/content/site";
import type { Solution } from "@/content/solutions";

export function SolutionPage({ solution: s }: { solution: Solution }) {
  const projects = s.projectSlugs.map(getProject).filter((p): p is Project => Boolean(p));

  return (
    <>
      <PageHeader
        eyebrow={s.eyebrow}
        title={s.h1}
        description={<p>{s.intro}</p>}
        crumbs={[
          { name: "Soluciones", path: "/soluciones/" },
          { name: s.name, path: s.path },
        ]}
        actions={
          <>
            <ButtonLink href="/cotizador/" size="lg" data-event="cta_cotizar_solucion">
              Calcular mi ahorro
              <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
            <ButtonLink href={whatsappUrl(s.whatsappMessage)} external variant="secondary" size="lg" data-event="whatsapp_click">
              Hablar con un asesor
            </ButtonLink>
          </>
        }
        aside={
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-border">
            <Image src={s.image} alt={s.imageAlt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <ul className="absolute right-4 bottom-4 left-4 flex flex-wrap gap-2">
              {s.useCases.map((u) => (
                <li key={u} className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  {u}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <Section id="retos" eyebrow="El reto" title="Lo que hoy le cuesta la energía a tu operación">
        <ul className="grid gap-4 md:grid-cols-3">
          {s.pains.map((p) => (
            <li key={p.title}>
              <Card className="h-full">
                <TriangleAlert aria-hidden className="size-5 text-copper-text" />
                <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-fg-muted">{p.text}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="solucion" tone="muted" eyebrow="La solución" title="Cómo te ayuda la energía solar">
        <ul className="grid gap-4 sm:grid-cols-2">
          {s.benefits.map((b) => (
            <li key={b.title} className="flex gap-4 rounded-3xl border border-border bg-surface p-6">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-positive-soft">
                <Check aria-hidden className="size-4 text-positive" />
              </span>
              <div>
                <h3 className="font-bold">{b.title}</h3>
                <p className="mt-1.5 text-sm text-fg-muted">{b.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {projects.length > 0 && (
        <Section
          id="casos"
          eyebrow="Casos de éxito"
          title={projects.length > 1 ? "Proyectos que ya están generando ahorro" : "Un proyecto que ya está generando ahorro"}
          action={
            <ButtonLink href="/proyectos/" variant="secondary">
              Ver todos los proyectos
            </ButtonLink>
          }
        >
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="modelos" tone={projects.length > 0 ? "muted" : "default"} eyebrow="Modelos" title="Elige cómo quieres hacerlo">
        <ul className={`grid gap-4 ${s.models.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {s.models.map((key) => {
            const svc = getService(key);
            return (
              <li key={key}>
                <Link href={svc.path} className="group flex h-full flex-col rounded-3xl border border-border bg-surface p-6 transition-colors hover:border-copper/60">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-extrabold">{svc.shortName}</h3>
                    <ArrowUpRight aria-hidden className="size-5 text-fg-subtle group-hover:text-copper-text" />
                  </div>
                  <p className="mt-1 text-sm font-semibold text-copper-text">{svc.tagline}</p>
                  <p className="mt-3 text-sm text-fg-muted">{svc.summary}</p>
                  <p className="mt-auto pt-6 font-mono text-sm">
                    <span className="text-fg-muted">{svc.highlight.label}: </span>
                    <span className="font-semibold tabular">{svc.highlight.value}</span>
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
        {s.slug === "hogares" && (
          <p className="mt-6 text-sm text-fg-muted">
            ¿Prefieres comprar los equipos por tu cuenta? Encuentra paneles, inversores y baterías en la{" "}
            <a href={site.equipmentStore} target="_blank" rel="noopener noreferrer" className="font-semibold text-copper-text underline underline-offset-2">
              tienda de Ferragro
            </a>
            .
          </p>
        )}
      </Section>

      <Section id="proceso" eyebrow="Proceso" title="De tu factura a tu planta solar en 5 pasos">
        <ProcessSteps />
      </Section>

      <Section id="preguntas" tone="muted" eyebrow="Preguntas frecuentes" title={`Preguntas sobre energía solar: ${s.name.toLowerCase()}`}>
        <FaqList items={s.faqs} />
      </Section>

      <CtaBand whatsappMessage={s.whatsappMessage} />
    </>
  );
}
