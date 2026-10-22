import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SolutionPage } from "@/components/sections/solution-page";
import { getSolution, solutions } from "@/content/solutions";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ segmento: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((s) => ({ segmento: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const solution = getSolution((await params).segmento);
  if (!solution) return {};
  return pageMetadata({ ...solution.seo, path: solution.path, image: solution.image });
}

export default async function SegmentoPage({ params }: { params: Params }) {
  const solution = getSolution((await params).segmento);
  if (!solution) notFound();
  return <SolutionPage solution={solution} />;
}
