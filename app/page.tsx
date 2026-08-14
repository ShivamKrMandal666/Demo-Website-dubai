import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Treatments } from "@/components/home/Treatments";
import { Doctors } from "@/components/home/Doctors";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaBand } from "@/components/home/CtaBand";
import { MapSection } from "@/components/home/MapSection";

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
