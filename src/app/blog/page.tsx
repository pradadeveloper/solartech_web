import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/sections/section";
import { CtaBand } from "@/components/sections/cta-band";
import { BlogListing } from "@/components/blog/blog-listing";
import { getAllPosts, POSTS_PER_PAGE } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog de energía solar en Colombia",
  description: "Guías sobre paneles solares para empresas, costos, beneficios tributarios de la Ley 1715, mantenimiento y baterías. Aprende y calcula tu ahorro.",
  path: "/blog/",
});

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Energía solar, explicada para tomar mejores decisiones"
        description="Guías prácticas sobre costos, beneficios tributarios, tecnología y mantenimiento de sistemas solares en Colombia."
        crumbs={[{ name: "Blog", path: "/blog/" }]}
      />
      <Section className="pt-12 lg:pt-14">
        <BlogListing posts={posts.slice(0, POSTS_PER_PAGE)} totalPages={Math.ceil(posts.length / POSTS_PER_PAGE)} />
      </Section>
      <CtaBand />
    </>
  );
}
