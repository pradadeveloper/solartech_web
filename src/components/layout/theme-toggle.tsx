"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/** Switch oscuro/claro. Los íconos se resuelven con CSS (clase .dark) para no
    depender del estado en el primer render. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!isDark}
      aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-7 w-[52px] shrink-0 items-center rounded-full border border-border-strong bg-surface-2 p-0.5 transition-colors",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute left-0.5 grid size-6 place-items-center rounded-full bg-copper text-white shadow transition-transform duration-200 translate-x-6 dark:translate-x-0"
      >
        <Moon className="hidden size-3.5 dark:block" />
        <Sun className="size-3.5 dark:hidden" />
      </span>
      <Sun aria-hidden className="ml-auto mr-1 hidden size-3.5 text-fg-subtle dark:block" />
      <Moon aria-hidden className="ml-1 size-3.5 text-fg-subtle dark:hidden" />
    </button>
  );
}
