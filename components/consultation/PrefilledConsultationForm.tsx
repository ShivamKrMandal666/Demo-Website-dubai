"use client";

import { useSearchParams } from "next/navigation";
import { ConsultationForm } from "@/components/consultation/ConsultationForm";
import { getDoctorBySlug, getTreatmentBySlug } from "@/lib/data/site";

// The query-string half of /book, kept in its own client leaf so the page
// itself stays a server component and `useSearchParams` sits under a single
// `<Suspense>` boundary — which is what keeps /book statically prerendered
// instead of falling back to dynamic rendering on every request.
//
// Slugs are resolved against the data rather than cast: an unknown, misspelled
// or absent value returns `undefined` and the select simply stays on its
// placeholder. A bad link is a 200 with an empty field, never an error.
export const PrefilledConsultationForm = ({
  className,
}: {
  className?: string;
}) => {
  const params = useSearchParams();
  const treatment = getTreatmentBySlug(params.get("treatment") ?? "")?.slug;
  const doctor = getDoctorBySlug(params.get("doctor") ?? "")?.slug;

  return (
    <ConsultationForm prefill={{ treatment, doctor }} className={className} />
  );
};
