import Image from "next/image";
import { Container } from "@/components/ui/container";
import { partners } from "@/content/partners";

/** Aliados financieros y marcas en carrusel continuo. */
export function TrustBar() {
  // Se duplica la lista para que el desplazamiento sea continuo.
  const loop = [...partners, ...partners];
  return (
    <section aria-labelledby="aliados-title" className="border-y border-border bg-surface/50 py-8">
      <Container className="flex flex-col items-center gap-6 md:flex-row md:gap-10">
        <h2 id="aliados-title" className="shrink-0 text-center font-mono text-[11px] font-medium tracking-[0.12em] text-fg-subtle uppercase md:text-left">
          Aliados financieros
          <br className="hidden md:block" /> y marcas que instalamos
        </h2>
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          {/* Logos a color sobre ficha blanca: varios tienen texto oscuro y no se leerían sobre el fondo grafito. */}
          <ul className="flex w-max animate-marquee items-center gap-4 hover:[animation-play-state:paused]">
            {loop.map((p, i) => (
              <li
                key={`${p.name}-${i}`}
                aria-hidden={i >= partners.length}
                className="h-16 w-44 shrink-0 rounded-2xl bg-white px-5 py-3 ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span className="relative block h-full w-full">
                  <Image src={p.logo} alt={i < partners.length ? `${p.name} (${p.kind})` : ""} fill sizes="136px" className="object-contain" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
