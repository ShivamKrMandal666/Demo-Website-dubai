import type { Metadata } from "next";
import BookPage from "@/components/book/BookPage";
import { clinic } from "@/lib/data/site";

export const metadata: Metadata = {
  title: `Book a Consultation — ${clinic.name}`,
  description:
    "Request a consultation at Maison Lumé. Tell us your preferred treatment, doctor and time, and a coordinator will confirm within 24 hours.",
  // CTAs link here with ?treatment= and ?doctor=, which are prefill hints and
  // not distinct pages — they should not fragment the canonical.
  alternates: { canonical: "/book" },
};

export default function Page() {
  return <BookPage />;
}
