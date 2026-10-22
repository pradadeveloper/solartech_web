"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { pushEvent } from "@/lib/analytics";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);
  const networks = [
    { name: "WhatsApp", href: `https://wa.me/?text=${text}%20${encoded}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}` },
    { name: "X", href: `https://x.com/intent/post?url=${encoded}&text=${text}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      pushEvent("share", { method: "copy_link", content_type: "article" });
    } catch {}
  }

  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">Compartir</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {networks.map((n) => (
          <li key={n.name}>
            <a
              href={n.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => pushEvent("share", { method: n.name, content_type: "article" })}
              className="inline-flex h-8 items-center rounded-full border border-border-strong px-3 text-xs font-semibold text-fg-muted hover:border-copper-text hover:text-fg"
            >
              {n.name}
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border-strong px-3 text-xs font-semibold text-fg-muted hover:border-copper-text hover:text-fg"
          >
            {copied ? <Check aria-hidden className="size-3.5 text-positive" /> : <Link2 aria-hidden className="size-3.5" />}
            {copied ? "Copiado" : "Copiar enlace"}
          </button>
        </li>
      </ul>
    </div>
  );
}
