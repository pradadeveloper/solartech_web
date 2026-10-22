import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { footerNav, site } from "@/content/site";

const socialLabels: Record<keyof typeof site.social, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  facebook: "Facebook",
};

export function Footer() {
  const { contact } = site;
  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface">
      <div aria-hidden className="glow-copper pointer-events-none absolute inset-x-0 -top-40 h-80 opacity-60" />
      <Container className="relative">
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-fg-muted">
              {site.tagline}. Parte del grupo {site.parent.name}. Diseñamos, construimos y operamos sistemas solares rentables en Colombia.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-fg-muted">
              <li>
                <a href={`tel:${contact.phone}`} data-event="phone_click" className="inline-flex items-center gap-2 font-mono tabular hover:text-fg">
                  <Phone aria-hidden className="size-4 text-copper-text" />
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 hover:text-fg">
                  <Mail aria-hidden className="size-4 text-copper-text" />
                  {contact.email}
                </a>
              </li>
              <li className="inline-flex items-start gap-2">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-copper-text" />
                <span>
                  {contact.address.street}, {contact.address.city}, {contact.address.region}
                </span>
              </li>
            </ul>
          </div>

          {footerNav.map((group) => (
            <div key={group.title}>
              <p className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">{group.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {group.items.map((item) => (
                  <li key={item.href}>
                    {item.external ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-fg-muted hover:text-fg">
                        {item.label}
                        <ArrowUpRight aria-hidden className="size-3.5" />
                      </a>
                    ) : (
                      <Link href={item.href} className="text-fg-muted hover:text-fg">
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-border py-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
          </p>
          <ul className="flex gap-4">
            {(Object.keys(site.social) as (keyof typeof site.social)[]).map((key) => (
              <li key={key}>
                <a href={site.social[key]} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                  {socialLabels[key]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
