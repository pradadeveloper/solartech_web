import type { Metadata } from "next";
import { site } from "@/content/site";
import type { Faq } from "@/content/faq";

type PageSeo = {
  /** ≤ 60 caracteres, sin el sufijo de marca (se agrega con el template del layout). */
  title: string;
  /** ≤ 155 caracteres, con keyword y CTA. */
  description: string;
  /** Ruta con slash final, p. ej. "/servicios/ppa/". */
  path: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
};

/** Metadata estándar por página: canonical, Open Graph (es_CO) y Twitter card. */
export function pageMetadata({ title, description, path, image, noindex, type = "website" }: PageSeo): Metadata {
  if (process.env.NODE_ENV !== "production") {
    if (title.length > 60) console.warn(`[seo] title > 60 caracteres en ${path}: "${title}"`);
    if (description.length > 155) console.warn(`[seo] description > 155 caracteres en ${path}`);
  }
  // Imagen generada en /og/ (ver src/lib/og.tsx); por defecto la general del sitio.
  const ogImage = image ?? "/og/site.png";
  const ogImages = { images: [{ url: ogImage, width: 1200, height: 630 }] };
  const twitterImages = { images: [ogImage] };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type, locale: site.locale, siteName: site.name, ...ogImages },
    twitter: { card: "summary_large_image", title, description, ...twitterImages },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

const orgId = `${site.url}/#organization`;

/** Organization + LocalBusiness global (se inyecta en el layout raíz). */
export function organizationJsonLd() {
  const { contact } = site;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": orgId,
        name: site.name,
        legalName: site.legalName,
        url: site.url,
        logo: `${site.url}/images/logo/solartech-logo-color.png`,
        image: `${site.url}/images/proyectos/proyecto-absorbentes-de-colombia-cartagena.webp`,
        description: site.description,
        telephone: contact.phone,
        email: contact.email,
        priceRange: "$$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: contact.address.street,
          addressLocality: contact.address.city,
          addressRegion: contact.address.region,
          postalCode: contact.address.postalCode,
          addressCountry: contact.address.country,
        },
        geo: { "@type": "GeoCoordinates", latitude: contact.geo.lat, longitude: contact.geo.lng },
        openingHoursSpecification: contact.hours.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes,
        })),
        areaServed: { "@type": "Country", name: "Colombia" },
        sameAs: Object.values(site.social),
        parentOrganization: { "@type": "Organization", name: site.parent.name, url: site.parent.url },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: "es-CO",
        publisher: { "@id": orgId },
      },
    ],
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${site.url}${c.path}`,
    })),
  };
}

export function faqJsonLd(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceJsonLd({ name, description, path }: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${site.url}${path}`,
    serviceType: "Energía solar fotovoltaica",
    provider: { "@id": orgId },
    areaServed: { "@type": "Country", name: "Colombia" },
  };
}
