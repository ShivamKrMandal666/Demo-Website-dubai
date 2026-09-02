import dynamic from "next/dynamic";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Treatments } from "@/components/home/Treatments";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaBand } from "@/components/home/CtaBand";
import { MapSection } from "@/components/home/MapSection";

// The doctors carousel is the heaviest client island on this route — five
// portraits crossfading under AnimatePresence, plus the `doctors` records it
// reads from lib/data/site. It is well below the fold, so its JS has no business
// in the first load.
//
// No `ssr: false`: that is not allowed from a server component in the App Router,
// and it would be the wrong call anyway. At the default `ssr: true` the section
// is still fully prerendered into the HTML, so there is no blank gap, no layout
// shift and nothing lost to crawlers — only the chunk that hydrates it is
// fetched separately, after the page above it is interactive.
//
// Every other section on this page is already a server component. Wrapping those
// would move no JS at all, so they are left alone deliberately.
const Doctors = dynamic(() =>
  import("@/components/home/Doctors").then((m) => m.Doctors),
);

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Treatments />
        <Doctors />
        <Testimonials />
        <CtaBand />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
}
