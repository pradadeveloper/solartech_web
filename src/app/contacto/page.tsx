import { ArrowRight, ArrowUpRight, Clock, FileText, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { ContactForm } from "@/components/sections/contact-form";
import { Card, Section } from "@/components/sections/section";
import { ButtonLink } from "@/components/ui/button";
import { site, whatsappUrl } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contacto: cotiza tu proyecto de energía solar",
  description: "Habla con un asesor de Solartech por WhatsApp, teléfono o correo. Oficina en Itagüí, Antioquia. Sube tu factura y recibe tu pre-cotización.",
  path: "/contacto/",
});

const dayNames: Record<string, string> = {
  Monday: "lunes",
  Tuesday: "martes",
  Wednesday: "miércoles",
  Thursday: "jueves",
  Friday: "viernes",
  Saturday: "sábado",
  Sunday: "domingo",
};

export default function ContactoPage() {
  const { contact } = site;
  const address = `${contact.address.street}, ${contact.address.city}, ${contact.address.region}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${contact.address.street}, ${contact.address.city}, ${contact.address.region}, Colombia`)}`;
  const hours = contact.hours.map((h) => `${dayNames[h.days[0]]} a ${dayNames[h.days[h.days.length - 1]]}, ${h.opens} – ${h.closes}`);

  const channels = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: contact.phoneDisplay,
      text: "La forma más rápida de hablar con un asesor.",
      href: whatsappUrl("Hola Solartech. Vengo desde la página de contacto y quiero información para mi proyecto solar."),
      cta: "Escribir por WhatsApp",
      external: true,
      event: "whatsapp_click",
    },
    {
      icon: Phone,
      title: "Teléfono",
      value: contact.phoneDisplay,
      text: "Llámanos en horario de oficina.",
      href: `tel:${contact.phone}`,
      cta: "Llamar ahora",
      event: "phone_click",
    },
    {
      icon: Mail,
      title: "Correo",
      value: contact.email,
      text: "Envíanos tu factura o los detalles de tu proyecto.",
      href: `mailto:${contact.email}`,
      cta: "Enviar correo",
    },
    {
      icon: MapPin,
      title: "Oficina",
      value: `${contact.address.city}, ${contact.address.region}`,
      text: address,
      href: mapsUrl,
      cta: "Abrir en Google Maps",
      external: true,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contacto"
        title="Hablemos de tu proyecto de energía solar"
        description="Nuestros asesores te ayudan a encontrar la solución solar ideal para tu empresa, finca u hogar. Escoge el canal que prefieras."
        crumbs={[{ name: "Contacto", path: "/contacto/" }]}
      />

      <Section>
        <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <div className="relative isolate flex flex-col overflow-hidden rounded-3xl border border-copper/40 bg-surface p-6 sm:p-8">
            <div aria-hidden className="absolute -top-32 -right-32 -z-10 size-80 rounded-full bg-copper/25 blur-3xl" />
            <span className="grid size-12 place-items-center rounded-2xl bg-copper-soft text-copper-text">
              <FileText aria-hidden className="size-6" />
            </span>
            <h2 className="mt-6 text-2xl font-extrabold sm:text-3xl">¿Quieres una cotización?</h2>
            <p className="mt-3 text-fg-muted sm:text-lg">
              Usa nuestro cotizador: ingresa el valor de tu factura o súbela y recibe en menos de un minuto el tamaño del sistema, la inversión estimada, tu ahorro y el
              retorno.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 pt-2 lg:mt-auto">
              <ButtonLink href="/cotizador/" size="lg" data-event="cta_cotizar_contacto">
                Ir al cotizador
                <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {channels.map((c) => (
              <li key={c.title}>
                <Card className="flex h-full flex-col p-6 sm:p-6">
                  <c.icon aria-hidden className="size-5 text-copper-text" />
                  <h3 className="mt-4 font-bold">{c.title}</h3>
                  <p className="mt-1 font-mono text-sm break-words text-fg tabular">{c.value}</p>
                  <p className="mt-2 text-sm text-fg-muted">{c.text}</p>
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    {...(c.event ? { "data-event": c.event } : {})}
                    className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-copper-text hover:underline"
                  >
                    {c.cta}
                    <ArrowUpRight aria-hidden className="size-4" />
                  </a>
                </Card>
              </li>
            ))}
          </ul>
        </div>

        <ContactForm />

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card className="flex items-start gap-4 p-6 sm:p-6">
            <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-copper-text" />
            <div>
              <h2 className="font-bold">Horario de atención</h2>
              <ul className="mt-1 text-sm text-fg-muted">
                {hours.map((h) => (
                  <li key={h} className="first-letter:uppercase">
                    {h}
                  </li>
                ))}
              </ul>
              <p className="mt-1 text-xs text-fg-subtle">Por WhatsApp te respondemos lo antes posible.</p>
            </div>
          </Card>
          <Card className="flex flex-col items-start gap-4 p-6 sm:p-6">
            <div>
              <h2 className="font-bold">¿Buscas equipos solares?</h2>
              <p className="mt-1 text-sm text-fg-muted">Paneles, inversores y accesorios se venden a través de la tienda de Ferragro.</p>
            </div>
            <ButtonLink href={site.equipmentStore} external variant="secondary" size="sm">
              Ver tienda
              <ArrowUpRight aria-hidden className="size-4" />
            </ButtonLink>
          </Card>
        </div>
      </Section>
    </>
  );
}
