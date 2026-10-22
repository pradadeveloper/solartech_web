import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BlogIndex } from "@/components/blog/blog-index";
import { getActiveCategories, type Post } from "@/lib/blog";

export function toCardData(p: Post) {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    image: p.image,
    imageAlt: p.imageAlt,
    category: p.category,
    date: p.date.toISOString(),
    readingMinutes: p.readingMinutes,
    tags: p.tags,
    keyword: p.keyword,
  };
}

type Props = { posts: Post[]; page?: number; totalPages?: number; basePath?: string; activeCategory?: string };

/** Listado del blog (índice, paginación y categorías comparten esta vista). */
export function BlogListing({ posts, page = 1, totalPages = 1, basePath = "/blog/", activeCategory }: Props) {
  const pageHref = (n: number) => (n === 1 ? basePath : `${basePath}pagina/${n}/`);
  return (
    <>
      <BlogIndex posts={posts.map(toCardData)} categories={getActiveCategories()} activeCategory={activeCategory} />
      {totalPages > 1 && (
        <nav aria-label="Paginación" className="mt-12 flex items-center justify-between gap-4">
          {page > 1 ? (
            <Link href={pageHref(page - 1)} rel="prev" className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted hover:text-fg">
              <ArrowLeft aria-hidden className="size-4" /> Anteriores
            </Link>
          ) : (
            <span />
          )}
          <span className="font-mono text-xs text-fg-subtle tabular">
            Página {page} de {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={pageHref(page + 1)} rel="next" className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted hover:text-fg">
              Siguientes <ArrowRight aria-hidden className="size-4" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}
