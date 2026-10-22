import { blogOg, projectOg, siteOg } from "@/lib/og";
import { getActiveCategories, getAllPosts } from "@/lib/blog";
import { hasProjectPage, projects } from "@/content/projects";

// /og/site.png · /og/blog/<slug>.png · /og/proyectos/<slug>.png — generadas en el build.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { path: ["site.png"] },
    ...getAllPosts().map((p) => ({ path: ["blog", `${p.slug}.png`] })),
    ...getActiveCategories().map((c) => ({ path: ["blog", `${c.slug}.png`] })),
    ...projects.filter(hasProjectPage).map((p) => ({ path: ["proyectos", `${p.slug}.png`] })),
  ];
}

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const [kind, file] = (await params).path;
  if (kind === "site.png") return siteOg();
  const slug = file?.replace(/\.png$/, "") ?? "";
  const image = kind === "blog" ? blogOg(slug) : kind === "proyectos" ? projectOg(slug) : null;
  return image ?? new Response("Not found", { status: 404 });
}
