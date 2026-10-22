import { cn } from "@/lib/utils";

/** Tipografía para textos largos (legales, artículos) sin @tailwindcss/typography. */
export function Prose({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-3xl text-base leading-relaxed text-fg-muted",
        "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-fg",
        "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-fg",
        "[&_p]:my-4 [&_strong]:font-semibold [&_strong]:text-fg",
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6",
        "[&_li]:marker:text-copper-text",
        "[&_a]:font-medium [&_a]:text-copper-text [&_a]:underline [&_a]:underline-offset-2",
        "[&>*:first-child]:mt-0",
        className,
      )}
      {...props}
    />
  );
}
