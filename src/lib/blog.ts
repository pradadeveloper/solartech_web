import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { z } from "zod";
import { categories } from "@/content/blog/taxonomy";

// Posts en src/content/blog/posts/<slug>.mdx. El frontmatter se valida al compilar:
// un post con datos incompletos rompe el build en vez de publicarse mal.
const POSTS_DIR = path.join(process.cwd(), "src/content/blog/posts");

const categorySlugs = categories.map((c) => c.slug) as [string, ...string[]];

const frontmatterSchema = z.object({
  title: z.string().min(10),
  metaTitle: z.string().max(48),
  description: z.string().min(50).max(155),
  excerpt: z.string().min(20),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  author: z.string(),
  category: z.enum(categorySlugs),
  tags: z.array(z.string()).default([]),
  keyword: z.string(),
  image: z.string().startsWith("/images/"),
  imageAlt: z.string().min(10, "imageAlt es obligatorio y debe ser descriptivo"),
  service: z.enum(["ppa", "epc", "gestion-de-plantas"]),
  related: z.array(z.string()).default([]),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  draft: z.boolean().default(false),
  noindex: z.boolean().default(false),
});

export type Heading = { depth: 2 | 3; text: string; id: string };

export type PostMeta = z.infer<typeof frontmatterSchema> & {
  slug: string;
  readingMinutes: number;
  headings: Heading[];
};

export type Post = PostMeta & { content: string };

/** Quita formato Markdown de un título para la tabla de contenidos. */
function plainText(md: string) {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}

/** Mismos ids que genera rehype-slug (github-slugger) para que la TOC enlace bien. */
function extractHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  for (const match of content.matchAll(/^(#{2,3})\s+(.+)$/gm)) {
    const text = plainText(match[2]);
    headings.push({ depth: match[1].length as 2 | 3, text, id: slugger.slug(text) });
  }
  return headings;
}

function readPost(file: string): Post {
  const slug = file.replace(/(\.revision)?\.mdx$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Frontmatter inválido en ${file}: ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
  }
  const words = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return { ...parsed.data, slug, content, readingMinutes: Math.max(1, Math.round(words / 200)), headings: extractHeadings(content) };
}

let cache: Post[] | null = null;

/** Todos los posts publicados, del más reciente al más antiguo.
    Revisión editorial (solo en `npm run dev`, nunca en producción):
    - `draft: true` en el frontmatter: post nuevo pendiente de aprobación.
    - `<slug>.revision.mdx`: versión ampliada de un post publicado; en desarrollo reemplaza a
      `<slug>.mdx` para compararla. Al aprobarla, se renombra sobre el original. */
export function getAllPosts(): Post[] {
  const dev = process.env.NODE_ENV === "development";
  if (!cache || dev) {
    const files = fs.existsSync(POSTS_DIR) ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx")) : [];
    const revisions = new Set(files.filter((f) => f.endsWith(".revision.mdx")).map((f) => f.replace(/\.revision\.mdx$/, "")));
    cache = files
      .filter((f) => (f.endsWith(".revision.mdx") ? dev : !(dev && revisions.has(f.replace(/\.mdx$/, "")))))
      .map(readPost)
      .filter((p) => !p.draft || dev)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  return cache;
}

export function getPost(slug: string) {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(category: string) {
  return getAllPosts().filter((p) => p.category === category);
}

/** Categorías con al menos un post (las vacías no se publican: serían páginas delgadas). */
export function getActiveCategories() {
  const used = new Set(getAllPosts().map((p) => p.category));
  return categories.filter((c) => used.has(c.slug));
}

/** 2 relacionados: los del frontmatter y, si faltan, los más recientes de la misma categoría. */
export function getRelatedPosts(post: PostMeta, count = 2) {
  const all = getAllPosts().filter((p) => p.slug !== post.slug);
  const picked = post.related.map((slug) => all.find((p) => p.slug === slug)).filter((p): p is Post => Boolean(p));
  for (const p of all) {
    if (picked.length >= count) break;
    if (p.category === post.category && !picked.includes(p)) picked.push(p);
  }
  for (const p of all) {
    if (picked.length >= count) break;
    if (!picked.includes(p)) picked.push(p);
  }
  return picked.slice(0, count);
}

export const POSTS_PER_PAGE = 9;
