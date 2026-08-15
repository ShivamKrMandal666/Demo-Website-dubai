import type { Metadata } from "next";
import TreatmentsPage from "@/components/treatments/TreatmentsPage";
import { clinic } from "@/lib/data/site";

export const metadata: Metadata = {
  title: `Treatments — ${clinic.name}`,
  description:
    "The full menu of medical-grade aesthetic treatments at Maison Lumé — injectables, laser and skin resurfacing, regenerative aesthetics, body contouring and more.",
};

export default function Page() {
  return <TreatmentsPage />;
}
