import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/sections/section";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqList } from "@/components/sections/faq-list";
import { BlogListing } from "@/components/blog/blog-listing";
import { MdxContent } from "@/components/blog/mdx-content";
import { PostCard } from "@/components/blog/post-card";
import { TableOfContents } from "@/components/blog/toc";
import { ShareButtons } from "@/components/blog/share-buttons";
import { formatPostDate } from "@/components/blog/format";
import { toCardData } from "@/components/blog/blog-listing";
import { getActiveCategories, getAllPosts, getPost, getPostsByCategory, getRelatedPosts, type Post } from "@/lib/blog";
import { getAuthor, getCategory } from "@/content/blog/taxonomy";
import { getService } from "@/content/services";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

// Una sola ruta dinámica atiende posts (/blog/<post>/) y categorías (/blog/<categoria>/):
// Next no permite dos segmentos dinámicos hermanos con nombres distintos.
export const dynamicParams = false;

export function generateStaticParams() {
  return [...getAllPosts().map((p) => ({ slug: p.slug })), ...getActiveCategories().map((c) => ({ slug: c.slug }))];
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (post) {
    const meta = pageMetadata({
      title: post.metaTitle,
      description: post.description,
      path: `/blog/${post.slug}/`,
      type: "article",
      noindex: post.noindex,
      image: `/og/blog/${post.slug}.png`,
    });
    return {
      ...meta,
      openGraph: {
        ...meta.openGraph,
        type: "article",
        publishedTime: post.date.toISOString(),
        modifiedTime: (post.updated ?? post.date).toISOString(),
        authors: [getAuthor(post.author).name],
        section: getCategory(post.category)?.name,
        tags: post.tags,
      },
    };
  }
  const category = getCategory(slug);
  if (!category) return {};
  return pageMetadata({
    title: `${category.name}: guías y artículos`,
    description: category.description,
    path: `/blog/${category.slug}/`,
    image: `/og/blog/${category.slug}.png`,
  });
}

export default async function BlogSlugPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (post) return <PostView post={post} />;
  const category = getCategory(slug);
  if (category && getPostsByCategory(slug).length) return <CategoryView slug={slug} />;
  notFound();
}

function CategoryView({ slug }: { slug: string }) {
  const category = getCategory(slug)!;
  const posts = getPostsByCategory(slug);
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title={category.name}
        description={category.description}
        crumbs={[
          { name: "Blog", path: "/blog/" },
          { name: category.name, path: `/blog/${slug}/` },
        ]}
      />
      <Section className="pt-12 lg:pt-14">
        <BlogListing posts={posts} activeCategory={slug} basePath={`/blog/${slug}/`} />
      </Section>
      <CtaBand />
    </>
  );
}

function PostView({ post }: { post: Post }) {
  const category = getCategory(post.category)!;
  const author = getAuthor(post.author);
  const service = getService(post.service);
  const related = getRelatedPosts(post);
  const url = `${site.url}/blog/${post.slug}/`;
  const updated = post.updated ?? post.date;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: `${site.url}${post.image}`,
    datePublished: post.date.toISOString(),
    dateModified: updated.toISOString(),
    inLanguage: "es-CO",
    mainEntityOfPage: url,
    keywords: [post.keyword, ...post.tags].join(", "),
    articleSection: category.name,
    author: { "@type": "Organization", name: author.name, url: author.linkedin },
    publisher: { "@id": `${site.url}/#organization` },
  };

  return (
    <article>
      <header className="relative isolate overflow-hidden border-b border-border">
        <div aria-hidden className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(80%_80%_at_30%_0%,#000_30%,transparent)]" />
        <div aria-hidden className="glow-copper absolute inset-x-0 -top-32 -z-10 h-96 opacity-80" />
        <Container className="pt-8 pb-12">
          <Breadcrumbs
            items={[
              { name: "Blog", path: "/blog/" },
              { name: category.name, path: `/blog/${category.slug}/` },
              { name: post.title, path: `/blog/${post.slug}/` },
            ]}
          />
          <div className="mt-8 max-w-3xl">
            <Link href={`/blog/${category.slug}/`} className="font-mono text-[11px] tracking-[0.12em] text-copper-text uppercase hover:underline">
              {category.name}
            </Link>
            <h1 className="mt-4 text-3xl leading-[1.1] font-extrabold sm:text-5xl">{post.title}</h1>
            <p className="mt-5 text-lg text-fg-muted">{post.excerpt}</p>
            <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-subtle">
              <span className="font-semibold text-fg-muted">{author.name}</span>
              <span>
                Actualizado el <time dateTime={updated.toISOString()}>{formatPostDate(updated)}</time>
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock aria-hidden className="size-3.5" />
                {post.readingMinutes} min de lectura
              </span>
            </p>
          </div>
          <div className="relative mt-10 aspect-[16/9] max-w-5xl overflow-hidden rounded-3xl border border-border">
            <Image src={post.image} alt={post.imageAlt} fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
          </div>
        </Container>
      </header>

      <Container className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
        <div className="min-w-0 max-w-3xl">
          {post.headings.length > 1 && (
            <details className="mb-10 rounded-2xl border border-border bg-surface p-5 lg:hidden">
              <summary className="cursor-pointer text-sm font-semibold">Contenido del artículo</summary>
              <ol className="mt-3 space-y-2 text-sm">
                {post.headings.map((h) => (
                  <li key={h.id} className={h.depth === 3 ? "pl-4" : undefined}>
                    <a href={`#${h.id}`} className="text-fg-muted hover:text-fg">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          )}
          <MdxContent source={post.content} />

          {post.faqs && post.faqs.length > 0 && (
            <section aria-labelledby="faq-title" className="mt-14">
              <h2 id="faq-title" className="mb-6 text-2xl font-extrabold">
                Preguntas frecuentes
              </h2>
              <FaqList items={post.faqs} />
            </section>
          )}

          <aside className="mt-14 flex gap-4 rounded-3xl border border-border bg-surface p-6">
            <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-2xl bg-copper-soft font-display text-lg font-extrabold text-copper-text">
              ST
            </span>
            <div>
              <p className="font-bold">{author.name}</p>
              <p className="text-sm text-fg-subtle">{author.role}</p>
              <p className="mt-2 text-sm text-fg-muted">{author.bio}</p>
            </div>
          </aside>

          {/* Enlazado interno obligatorio: 1 servicio + cotizador (CTA en el cuerpo y la banda final). */}
          <Link href={service.path} className="group mt-6 flex items-center justify-between gap-6 rounded-3xl border border-border bg-surface p-6 hover:border-copper/60">
            <div>
              <p className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">Servicio relacionado</p>
              <p className="mt-2 text-lg font-bold group-hover:text-copper-text">{service.name}</p>
              <p className="mt-1 text-sm text-fg-muted">{service.summary}</p>
            </div>
            <span className="shrink-0 rounded-2xl bg-surface-2 px-4 py-3 text-center">
              <span className="block text-[11px] text-fg-muted">{service.highlight.label}</span>
              <span className="mt-0.5 block font-mono text-lg font-semibold whitespace-nowrap tabular">{service.highlight.value}</span>
            </span>
          </Link>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-10">
            <TableOfContents headings={post.headings} />
            <ShareButtons url={url} title={post.title} />
          </div>
        </aside>
        <div className="lg:hidden">
          <ShareButtons url={url} title={post.title} />
        </div>
      </Container>

      {related.length > 0 && (
        <Section tone="muted" eyebrow="Sigue leyendo" title="Artículos relacionados">
          <ul className="grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <li key={p.slug}>
                <PostCard post={toCardData(p)} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand />
      <JsonLd data={articleJsonLd} />
    </article>
  );
}
