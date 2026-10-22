import { getAllPosts } from "@/lib/blog";
import { site } from "@/content/site";

export const dynamic = "force-static";

const escape = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

export function GET() {
  const posts = getAllPosts().filter((p) => !p.noindex);
  const items = posts
    .map(
      (p) => `    <item>
      <title>${escape(p.title)}</title>
      <link>${site.url}/blog/${p.slug}/</link>
      <guid isPermaLink="true">${site.url}/blog/${p.slug}/</guid>
      <description>${escape(p.excerpt)}</description>
      <pubDate>${p.date.toUTCString()}</pubDate>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog de ${site.name}</title>
    <link>${site.url}/blog/</link>
    <description>Guías de energía solar para empresas, agro y hogares en Colombia.</description>
    <language>es-CO</language>
    <atom:link href="${site.url}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
