import Image from "next/image";
import { cn } from "@/lib/utils";

/** Logo blanco (vector) en tema oscuro y logo a color en tema claro.
    Se alterna con CSS para evitar parpadeos de hidratación. */
export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className={cn("relative inline-block h-7 w-[188px]", className)}>
      <Image
        src="/images/logo/solartech-logo-blanco.svg"
        alt="Solartech Energy Systems"
        fill
        priority={priority}
        sizes="200px"
        className="hidden object-contain object-left dark:block"
      />
      <Image
        src="/images/logo/solartech-logo-color.png"
        alt="Solartech Energy Systems"
        fill
        priority={priority}
        sizes="200px"
        className="object-contain object-left dark:hidden"
      />
    </span>
  );
}
