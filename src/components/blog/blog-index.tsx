"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PostCard, type PostCardData } from "@/components/blog/post-card";
import type { Category } from "@/content/blog/taxonomy";
import { cn } from "@/lib/utils";

type SearchablePost = PostCardData & { tags: string[]; keyword: string };

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Listado con buscador (en el navegador) y enlaces a categorías.
    El HTML del servidor trae todas las tarjetas, así que el contenido es indexable sin JS. */
export function BlogIndex({ posts, categories, activeCategory }: { posts: SearchablePost[]; categories: Category[]; activeCategory?: string }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return posts;
    return posts.filter((p) => normalize([p.title, p.excerpt, p.keyword, ...p.tags].join(" ")).includes(q));
  }, [posts, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Categorías del blog">
          <ul className="flex flex-wrap gap-2">
            <li>
              <CategoryChip href="/blog/" active={!activeCategory}>
                Todos
              </CategoryChip>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <CategoryChip href={`/blog/${c.slug}/`} active={activeCategory === c.slug}>
                  {c.name}
                </CategoryChip>
              </li>
            ))}
          </ul>
        </nav>
        <div className="relative w-full lg:max-w-xs">
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-fg-subtle" />
          <label htmlFor="blog-search" className="sr-only">
            Buscar en el blog
          </label>
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar artículos…"
            className="h-11 w-full rounded-full border border-border-strong bg-surface-2 pr-4 pl-11 text-sm outline-none placeholder:text-fg-subtle focus:border-copper-text focus:ring-2 focus:ring-copper/30"
          />
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {results.length} artículos
      </p>

      {results.length ? (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p, i) => (
            <li key={p.slug}>
              <PostCard post={p} headingLevel="h2" priority={i < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-2xl border border-border bg-surface p-8 text-center text-fg-muted">
          No encontramos artículos para “{query}”. Prueba con otra palabra o{" "}
          <Link href="/cotizador/" className="text-copper-text underline">
            calcula tu ahorro
          </Link>
          .
        </p>
      )}
    </div>
  );
}

function CategoryChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
        active ? "border-copper bg-copper-soft text-fg" : "border-border-strong text-fg-muted hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}
