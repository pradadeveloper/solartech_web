import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { ArrowRight, Calculator, Lightbulb } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Prose } from "@/components/ui/prose";

/** Bloque insertable en los posts: lleva al cotizador. */
function CtaCotizador({ title = "Calcula tu ahorro en 1 minuto", text = "Ingresa tu factura de energía y recibe una pre-cotización con inversión, ahorro y retorno." }: { title?: string; text?: string }) {
  return (
    <aside className="not-prose my-10 flex flex-col gap-4 rounded-3xl border border-copper/40 bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-copper-soft text-copper-text">
          <Calculator aria-hidden className="size-5" />
        </span>
        <div>
          <p className="font-display text-lg font-extrabold text-fg">{title}</p>
          <p className="mt-1 text-sm text-fg-muted">{text}</p>
        </div>
      </div>
      {/* `!`: el Prose del artículo pinta todos los enlaces de cobre y subrayados. */}
      <ButtonLink href="/cotizador/" className="shrink-0 font-semibold! text-white! no-underline!" data-event="cta_cotizar_blog">
        Calcular mi ahorro
        <ArrowRight aria-hidden className="size-4" />
      </ButtonLink>
    </aside>
  );
}

function Callout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="my-8 rounded-2xl border border-border bg-surface-2 p-5">
      <p className="flex items-center gap-2 font-semibold text-fg">
        <Lightbulb aria-hidden className="size-4 text-copper-text" />
        {title ?? "Dato clave"}
      </p>
      <div className="mt-2 text-sm [&>p]:my-1">{children}</div>
    </div>
  );
}

function MdxLink({ href = "", children, ...props }: React.ComponentProps<"a">) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function MdxImage({ src = "", alt = "" }: React.ComponentProps<"img">) {
  return (
    <figure className="my-8">
      <Image src={String(src)} alt={alt} width={1200} height={675} sizes="(min-width: 768px) 768px, 100vw" className="h-auto w-full rounded-2xl" />
      {alt && <figcaption className="mt-2 text-center text-xs text-fg-subtle">{alt}</figcaption>}
    </figure>
  );
}

function Table(props: React.ComponentProps<"table">) {
  return (
    <div className="my-8 overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-left text-sm [&_td]:border-t [&_td]:border-border [&_td]:px-4 [&_td]:py-3 [&_th]:bg-surface-2 [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold [&_th]:text-fg" {...props} />
    </div>
  );
}

const components = { CtaCotizador, Callout, a: MdxLink, img: MdxImage, table: Table };

export function MdxContent({ source }: { source: string }) {
  return (
    <Prose className="max-w-none [&_h2]:scroll-mt-28 [&_h3]:scroll-mt-28">
      <MDXRemote source={source} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }} />
    </Prose>
  );
}
