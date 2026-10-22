import Link from "next/link";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary: "bg-copper text-white shadow-[0_8px_24px_-8px_var(--glow)] hover:bg-copper-hover",
  secondary: "border border-border-strong bg-surface/60 text-fg hover:border-copper-text hover:text-copper-text",
  ghost: "text-fg-muted hover:text-fg hover:bg-surface-2",
  whatsapp: "bg-whatsapp text-[#0b2e17] hover:brightness-95",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
} as const;

type StyleProps = { variant?: keyof typeof variants; size?: keyof typeof sizes };

export function buttonClass({ variant = "primary", size = "md" }: StyleProps = {}, className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({ variant, size, className, ...props }: StyleProps & React.ComponentProps<"button">) {
  return <button className={buttonClass({ variant, size }, className)} {...props} />;
}

type ButtonLinkProps = StyleProps & React.ComponentProps<typeof Link> & { external?: boolean };

export function ButtonLink({ variant, size, className, external, ...props }: ButtonLinkProps) {
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return <Link className={buttonClass({ variant, size }, className)} {...externalProps} {...props} />;
}
