import { FileWarning } from "lucide-react";

/** Aviso discreto para páginas legales pendientes de revisión. */
export function DraftNotice() {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-copper/40 bg-copper-soft px-3 py-1 text-xs font-medium text-copper-text">
      <FileWarning aria-hidden className="size-3.5" />
      Borrador pendiente de revisión legal
    </p>
  );
}
