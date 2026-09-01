import type { Metadata } from "next";
import TreatmentsPage from "@/components/treatments/TreatmentsPage";
import { clinic } from "@/lib/data/site";

// `alternates.canonical` is inherited from the root layout, which sets "/" for
// the shared demo link — so every route that does not restate its own would
// declare itself a duplicate of the homepage. Same reason /book has always had
// one. `openGraph`/`twitter` are deliberately NOT set here: the social card is
// the Neptune B2B demo pitch and every route inherits it whole.
export const metadata: Metadata = {
  title: `Treatments — ${clinic.name}`,
  description:
    "The full menu of medical-grade aesthetic treatments at Maison Lumé — injectables, laser and skin resurfacing, regenerative aesthetics, body contouring and more.",
  alternates: { canonical: "/treatments" },
};

export default function Page() {
  return <TreatmentsPage />;
}
