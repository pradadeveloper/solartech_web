import { ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { Section } from "@/components/sections/section";
import { BusinessModels } from "@/components/sections/business-models";
import { ProjectCard } from "@/components/sections/project-card";
import { PortfolioPanel } from "@/components/sections/portfolio-panel";
import { TaxBenefits } from "@/components/sections/tax-benefits";
import { ProcessSteps } from "@/components/sections/process-steps";
import { Pillars } from "@/components/sections/pillars";
import { HowItWorks } from "@/components/sections/how-it-works";
import { ClientLogos } from "@/components/sections/client-logos";
import { FaqList } from "@/components/sections/faq-list";
import { CtaBand } from "@/components/sections/cta-band";
import { ButtonLink } from "@/components/ui/button";
import { projects } from "@/content/projects";
import { faqs } from "@/content/faq";
import { pageMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/blog";
import { PostCard } from "@/components/blog/post-card";
import { toCardData } from "@/components/blog/blog-listing";

export const metadata = {
  ...pageMetadata({
    title: "Paneles solares para empresas en Colombia",
    description: "Proyectos solares con retorno de 3 a 4 años: EPC llave en mano, PPA sin inversión y O&M. Parte del grupo Ferragro. Calcula tu ahorro gratis.",
    path: "/",
  }),
  // El home usa el título completo, sin el sufijo del template.
  title: { absolute: "Paneles solares para empresas en Colombia | Solartech" },
};

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 3);
  // Destacados: proyectos con ahorro y retorno documentados, de mayor a menor ahorro.
  const featured = projects
    .filter((p) => p.paybackYears !== null && p.monthlySavingsCop !== null)
    .sort((a, b) => (b.monthlySavingsCop ?? 0) - (a.monthlySavingsCop ?? 0))
    .slice(0, 6);

  return (
    <>
      <Hero />
      <TrustBar />

      <Section
        id="modelos"
        eyebrow="Modelos de negocio"
        title="Elige cómo quieres invertir en energía solar"
        description="Compra tu planta y quédate con todo el ahorro, o paga solo la energía sin invertir. Y si ya tienes una planta, la mantenemos produciendo al máximo."
        action={
          <ButtonLink href="/servicios/" variant="secondary">
            Comparar modelos
          </ButtonLink>
        }
      >
        <BusinessModels />
      </Section>

      <Section
        id="como-funciona-sistema"
        tone="muted"
        eyebrow="Cómo funciona"
        title="¿Cómo funciona un sistema solar?"
        description="Del panel a tu factura: la energía que generas se consume primero en tu instalación y lo que sobra se entrega a la red."
      >
        <HowItWorks />
      </Section>

      <Section
        id="proyectos"
        eyebrow="Casos de éxito"
        title="Empresas que ya convirtieron su factura en ahorro"
        description="Cifras reales de proyectos que diseñamos y construimos en Antioquia, la costa Caribe y el Eje Cafetero."
        action={
          <ButtonLink href="/proyectos/" variant="secondary">
            Ver todos los proyectos
            <ArrowUpRight aria-hidden className="size-4" />
          </ButtonLink>
        }
      >
        <div className="mb-10 max-w-2xl">
          <PortfolioPanel />
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="clientes"
        tone="muted"
        eyebrow="Clientes"
        title="Empresas que ya generan su energía con Solartech"
        description="Industria, comercio, colegios, hoteles, agro y copropiedades en todo el país."
      >
        <ClientLogos />
      </Section>

      <Section
        id="beneficios-tributarios"
        eyebrow="Ley 1715 · Ley 2099"
        title="El Estado te ayuda a pagar tu planta solar"
        description="Los proyectos de energía solar tienen incentivos tributarios que mejoran aún más su rentabilidad."
        action={
          <ButtonLink href="/beneficios-tributarios/" variant="secondary">
            Conocer los beneficios
          </ButtonLink>
        }
      >
        <TaxBenefits />
      </Section>

      <Section id="como-funciona" tone="muted" eyebrow="Cómo trabajamos" title="De tu factura a tu planta solar en 5 pasos">
        <ProcessSteps />
      </Section>

      <Section id="por-que-solar" eyebrow="Por qué energía solar" title="Cinco razones para generar tu propia energía">
        <Pillars />
      </Section>

      <Section
        id="preguntas"
        tone="muted"
        eyebrow="Preguntas frecuentes"
        title="Lo que más nos preguntan"
        action={
          <ButtonLink href="/preguntas-frecuentes/" variant="secondary">
            Ver todas
          </ButtonLink>
        }
      >
        <FaqList items={faqs.slice(0, 5)} />
      </Section>

      {latestPosts.length > 0 && (
        <Section
          id="blog"
          eyebrow="Blog"
          title="Aprende antes de invertir"
          action={
            <ButtonLink href="/blog/" variant="secondary">
              Ver el blog
            </ButtonLink>
          }
        >
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((p) => (
              <li key={p.slug}>
                <PostCard post={toCardData(p)} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
