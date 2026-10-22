import { cn } from "@/lib/utils";

const control =
  "h-12 w-full rounded-xl border border-border-strong bg-surface-2 px-4 text-base text-fg placeholder:text-fg-subtle transition-colors outline-none focus:border-copper-text focus:ring-2 focus:ring-copper/30 aria-[invalid=true]:border-red-500/70";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={cn("mb-2 block text-sm font-semibold text-fg", className)} {...props} />;
}

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(control, className)} {...props} />;
}

export function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select className={cn(control, "appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10", className)} style={{ backgroundImage: "var(--select-chevron)" }} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(control, "h-auto min-h-32 py-3", className)} {...props} />;
}

export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-red-500 dark:text-red-400">
      {message}
    </p>
  );
}

export function Hint({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("mt-1.5 text-xs text-fg-subtle", className)}>{children}</p>;
}

type ChoiceProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
};

/** Opción tipo tarjeta (radio accesible). */
export function ChoiceCard({ name, value, checked, onChange, title, description, icon, className }: ChoiceProps) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-copper/50",
        checked ? "border-copper bg-copper-soft" : "border-border-strong bg-surface-2 hover:border-fg-subtle",
        className,
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      {icon && <span className={cn("mt-0.5 shrink-0", checked ? "text-copper-text" : "text-fg-muted")}>{icon}</span>}
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        {description && <span className="mt-0.5 block text-xs text-fg-muted">{description}</span>}
      </span>
    </label>
  );
}
