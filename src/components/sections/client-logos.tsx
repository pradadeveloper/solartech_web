import Image from "next/image";
import { clients, type Client } from "@/content/clients";
import { cn } from "@/lib/utils";

/** Logos de empresas clientes sobre fichas blancas (se leen igual en tema oscuro y claro).
    `marquee`: dos filas que se desplazan en sentidos opuestos y se pausan al pasar el mouse;
    con movimiento reducido quedan como cuadrícula fija. `grid`: todos los logos, quietos.
    En ambos casos cada logo aparece una vez con su `alt` (la copia del carrusel va oculta). */
export function ClientLogos({ variant = "marquee" }: { variant?: "marquee" | "grid" }) {
  if (variant === "grid") {
    return (
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {clients.map((c) => (
          <li key={c.name}>
            <LogoTile client={c} />
          </li>
        ))}
      </ul>
    );
  }

  const half = Math.ceil(clients.length / 2);
  const rows = [clients.slice(0, half), clients.slice(half)];
  return (
    <div className="group/marquee space-y-3 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] motion-reduce:[mask-image:none]">
      {rows.map((row, r) => (
        <div key={r} className="overflow-hidden motion-reduce:overflow-visible">
          <div
            className={cn(
              "flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none",
              r === 1 && "[animation-direction:reverse]",
            )}
            style={{ animationDuration: `${row.length * 3.2}s` }}
          >
            {/* El desplazamiento es -50 %: la segunda copia, idéntica, empalma sin salto. El espacio
                entre copias va como padding de cada una para que ambas midan exactamente lo mismo. */}
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1 || undefined}
                className={cn("flex shrink-0 gap-3 pr-3 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0", copy === 1 && "motion-reduce:hidden")}
              >
                {row.map((c) => (
                  <li key={c.name} className="w-36 shrink-0 sm:w-44">
                    <LogoTile client={c} decorative={copy === 1} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LogoTile({ client: c, decorative = false }: { client: Client; decorative?: boolean }) {
  return (
    <div className="flex h-20 items-center justify-center rounded-2xl bg-white px-4 py-3 ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5 sm:h-24">
      <Image
        src={c.logo}
        alt={decorative ? "" : c.name}
        width={c.width}
        height={c.height}
        loading="lazy"
        sizes="176px"
        className="h-auto max-h-full w-auto max-w-full object-contain"
      />
    </div>
  );
}
