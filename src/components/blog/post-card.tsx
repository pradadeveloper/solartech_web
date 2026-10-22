import Image from "next/image";
import Link from "next/link";
import { getCategory } from "@/content/blog/taxonomy";
import { formatPostDate } from "@/components/blog/format";

export type PostCardData = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  category: string;
  date: string;
  readingMinutes: number;
};

export function PostCard({ post, headingLevel = "h3", priority = false }: { post: PostCardData; headingLevel?: "h2" | "h3"; priority?: boolean }) {
  const Heading = headingLevel;
  const category = getCategory(post.category);
  return (
    <Link
      href={`/blog/${post.slug}/`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-colors hover:border-copper/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper-text"
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          {category && <p className="font-mono text-[11px] tracking-[0.12em] text-copper-text uppercase">{category.name}</p>}
          <Heading className="mt-3 text-lg leading-snug font-bold group-hover:text-copper-text">{post.title}</Heading>
          <p className="mt-2 line-clamp-3 text-sm text-fg-muted">{post.excerpt}</p>
          <p className="mt-auto pt-5 font-mono text-xs text-fg-subtle tabular">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time> · {post.readingMinutes} min de lectura
          </p>
        </div>
      </article>
    </Link>
  );
}
