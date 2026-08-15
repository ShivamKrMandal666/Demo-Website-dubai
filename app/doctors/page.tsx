import type { Metadata } from "next";
import DoctorsPage from "@/components/doctors/DoctorsPage";
import { clinic } from "@/lib/data/site";

export const metadata: Metadata = {
  title: `Doctors — ${clinic.name}`,
  description:
    "Meet the five doctors of Maison Lumé — facial harmonisation, injectable artistry, skin and laser medicine, regenerative therapies and non-surgical rejuvenation.",
};

export default function Page() {
  return <DoctorsPage />;
}
