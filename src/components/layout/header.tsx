"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { mainNav, type NavItem } from "@/content/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200",
        scrolled || mobileOpen ? "border-border bg-bg/85 backdrop-blur-xl" : "border-transparent bg-bg/0",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="Solartech, ir al inicio" className="shrink-0">
          <Logo priority className="h-6 w-[160px] sm:h-7 sm:w-[188px]" />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.label}>{item.children ? <NavDropdown item={item} pathname={pathname} /> : <NavLink item={item} pathname={pathname} />}</li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/cotizador/" size="sm" className="hidden sm:inline-flex" data-event="cta_cotizar_header">
            Cotiza gratis
          </ButtonLink>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-fg hover:bg-surface-2 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {mobileOpen && <MobileMenu />}
    </header>
  );
}

function isActive(href: string, pathname: string) {
  return href !== "/" && pathname.startsWith(href);
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const className = cn(
    "inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium transition-colors",
    isActive(item.href, pathname) ? "text-fg" : "text-fg-muted hover:text-fg",
  );
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {item.label}
        <ArrowUpRight aria-hidden className="size-3.5" />
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} aria-current={isActive(item.href, pathname) ? "page" : undefined}>
      {item.label}
    </Link>
  );
}

function NavDropdown({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        closeTimer.current = setTimeout(() => setOpen(false), 120);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium transition-colors",
          isActive(item.href, pathname) || open ? "text-fg" : "text-fg-muted hover:text-fg",
        )}
      >
        {item.label}
        <ChevronDown aria-hidden className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 w-[360px] -translate-x-1/2 pt-2">
          <ul className="rounded-2xl border border-border bg-surface p-2 shadow-2xl shadow-black/30">
            {item.children!.map((child) => (
              <li key={child.href}>
                <Link href={child.href} className="group block rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-2">
                  <span className="block text-sm font-semibold text-fg group-hover:text-copper-text">{child.label}</span>
                  {child.description && <span className="mt-0.5 block text-xs text-fg-muted">{child.description}</span>}
                </Link>
              </li>
            ))}
            <li className="mt-1 border-t border-border pt-1">
              <Link href={item.href} className="block rounded-xl px-3 py-2 text-xs font-semibold text-fg-muted hover:text-fg">
                Ver todo en {item.label.toLowerCase()} →
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

function MobileMenu() {
  return (
    <nav id="mobile-menu" aria-label="Principal" className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-bg lg:hidden">
      <Container className="flex flex-col gap-6 py-6">
        {mainNav.map((item) =>
          item.children ? (
            <div key={item.label}>
              <Link href={item.href} className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">
                {item.label}
              </Link>
              <ul className="mt-2 grid gap-1">
                {item.children.map((child) => (
                  <li key={child.href}>
                    <Link href={child.href} className="block rounded-xl py-2 text-base font-semibold text-fg">
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : item.external ? (
            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-base font-semibold text-fg">
              {item.label} <ArrowUpRight aria-hidden className="size-4" />
            </a>
          ) : (
            <Link key={item.label} href={item.href} className="text-base font-semibold text-fg">
              {item.label}
            </Link>
          ),
        )}
        <ButtonLink href="/cotizador/" size="lg" className="mt-2 w-full" data-event="cta_cotizar_menu">
          Cotiza gratis en 1 minuto
        </ButtonLink>
      </Container>
    </nav>
  );
}
