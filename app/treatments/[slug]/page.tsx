import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TreatmentDetailPage from "@/components/treatments/TreatmentDetailPage";
import { clinic, getTreatmentBySlug, treatmentSlugs } from "@/lib/data/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// All ten treatments are static content, so every detail page is prerendered
// at build time. Anything outside this set 404s.
export function generateStaticParams() {
  return treatmentSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = getTreatmentBySlug(slug);
  if (!t) return {};

  return {
    title: `${t.name} — ${clinic.name}`,
    description: t.tagline,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  if (!getTreatmentBySlug(slug)) notFound();

  return <TreatmentDetailPage slug={slug} />;
}
