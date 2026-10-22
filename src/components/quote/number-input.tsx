"use client";

import { Input } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type Props = Omit<React.ComponentProps<"input">, "value" | "onChange" | "type"> & {
  value: string | number | undefined;
  onValueChange: (digits: string) => void;
  prefix?: string;
  suffix?: string;
};

/** Campo numérico con separador de miles colombiano. Entrega solo dígitos. */
export function NumberInput({ value, onValueChange, prefix, suffix, className, ...props }: Props) {
  const digits = String(value ?? "").replace(/\D/g, "");
  const display = digits ? Number(digits).toLocaleString("es-CO") : "";
  return (
    <div className="relative">
      {prefix && <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-mono text-fg-subtle">{prefix}</span>}
      <Input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={display}
        onChange={(e) => onValueChange(e.target.value.replace(/\D/g, "").slice(0, 12))}
        className={cn("font-mono tabular", prefix && "pl-9", suffix && "pr-16", className)}
        {...props}
      />
      {suffix && <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-fg-subtle">{suffix}</span>}
    </div>
  );
}
