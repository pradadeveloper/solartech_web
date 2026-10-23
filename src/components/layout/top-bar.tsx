import { Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { site } from "@/content/site";

/** Barra superior: marca de Ferragro S.A.S, teléfono y switch de tema. */
export function TopBar() {
  return (
    <div className="border-b border-border bg-surface/80 text-xs text-fg-muted">
      <Container className="flex h-9 items-center justify-between gap-4">
        <p className="truncate">
          Marca solar registrada de{" "}
          <a href={site.parent.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-positive hover:underline">
            Ferragro S.A.S
          </a>
          <span className="hidden sm:inline"> · Proyectos solares en toda Colombia.</span>
        </p>
        <div className="flex items-center gap-4">
          <a
            href={`tel:${site.contact.phone}`}
            data-event="phone_click"
            className="hidden items-center gap-1.5 font-mono tabular hover:text-fg sm:inline-flex"
          >
            <Phone aria-hidden className="size-3.5" />
            {site.contact.phoneDisplay}
          </a>
          <div className="flex items-center gap-2">
            <span className="hidden font-mono text-[11px] tracking-wider uppercase md:inline">Tema</span>
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </div>
  );
}
