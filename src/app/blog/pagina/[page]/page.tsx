import { notFound } from "next/navigation";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/sections/section";
import { BlogListing } from "@/components/blog/blog-listing";
import { getAllPosts, POSTS_PER_PAGE } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  const total = Math.ceil(getAllPosts().length / POSTS_PER_PAGE);
  // La página 1 es /blog/. Next exige al menos un parámetro en export estático: devolvemos los que existan.
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  return pageMetadata({
    title: `Blog de energía solar · Página ${page}`,
    description: "Más guías sobre paneles solares, costos, beneficios tributarios y mantenimiento de sistemas solares en Colombia.",
    path: `/blog/pagina/${page}/`,
  });
}

export default async function BlogPaginatedPage({ params }: { params: Promise<{ page: string }> }) {
  const page = Number((await params).page);
  const posts = getAllPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  if (!Number.isInteger(page) || page < 2 || page > totalPages) notFound();
  return (
    <>
      <PageHeader title={`Blog · Página ${page}`} crumbs={[{ name: "Blog", path: "/blog/" }, { name: `Página ${page}`, path: `/blog/pagina/${page}/` }]} />
      <Section className="pt-12 lg:pt-14">
        <BlogListing posts={posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)} page={page} totalPages={totalPages} />
      </Section>
    </>
  );
}
