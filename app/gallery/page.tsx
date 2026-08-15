import type { Metadata } from "next";
import { GalleryExperience } from "./_components/GalleryExperience";
import { clinic } from "@/lib/data/site";

export const metadata: Metadata = {
  title: `Gallery — ${clinic.name}`,
  description:
    "An infinite, draggable wall of imagery from the clinic — treatments, specialists and interiors.",
};

// No next/dynamic here. The route is already its own client bundle, so the
// grid and the motion drag engine cannot load from any other page — and nothing
// prefetches this route, because the nav navigates with router.push rather than
// next/link. `ssr: false` would be worse than useless: it would strip the dark
// surface out of the initial HTML and flash the site's bone background before
// hydration.
export default function GalleryPage() {
  return <GalleryExperience />;
}
