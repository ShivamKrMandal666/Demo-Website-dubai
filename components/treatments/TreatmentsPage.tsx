"use client";

import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MapSection } from "@/components/home/MapSection";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Reveal, RevealStagger } from "@/components/site/Reveal";
import { TreatmentGridCard } from "@/components/treatments/TreatmentGridCard";
import { treatments } from "@/lib/data/site";
import { backgrounds, textures } from "@/lib/images";
import { scrollToId } from "@/lib/smooth-scroll";

// PARKED — not routed yet. See components/treatments/README.md.
export default function TreatmentsPage() {
  const book = () =>
    toast("Booking request received", {
      description: "Our concierge will confirm your appointment shortly.",
    });

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Hero — single static background image */}
        <section id="top" className="relative flex h-[62vh] min-h-[460px] items-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center animate-kenburns"
            style={{ backgroundImage: `url(${backgrounds.treatmentsHero})` }}
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-gradient-hero-bottom" />
          <div className="container relative z-10 mx-auto">
            <Reveal>
              <SectionLabel onDark>Our Treatments</SectionLabel>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.05] tracking-editorial text-bone text-balance sm:text-5xl lg:text-6xl">
                Treatments &amp; therapies, crafted around you
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-bone/80 sm:text-lg">
                A complete menu of medical-grade aesthetic treatments — each tailored,
                evidence-led and delivered with an unhurried, couture approach.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button onClick={book} variant="gold" size="xl" className="rounded-full">
                  Book an Appointment <ArrowUpRight className="h-4 w-4" />
                </Button>
                <Button onClick={() => scrollToId("#treatments")} variant="hero" size="xl" className="rounded-full">
                  Explore the menu
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Our Treatments — non-uniform grid */}
        <section id="treatments" className="relative overflow-hidden py-20 md:py-28">
          <div
            className="absolute inset-0 bg-muted bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url(${textures.treatments})` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-background/55" aria-hidden="true" />
          <div className="container relative z-10 mx-auto">
            <div className="max-w-2xl">
              <Reveal>
                <SectionLabel>The Full Menu</SectionLabel>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-6 font-serif text-3xl leading-tight tracking-editorial text-foreground text-balance sm:text-4xl lg:text-5xl">
                  Ten signature treatments, one considered philosophy
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 font-sans text-base leading-relaxed text-muted-foreground">
                  Explore each treatment in detail — from injectables and lasers to
                  regenerative and non-surgical sculpting.
                </p>
              </Reveal>
            </div>

            <RevealStagger
              stagger={0.08}
              className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16 md:grid-cols-6"
            >
              {treatments.map((t) => (
                <TreatmentGridCard key={t.slug} t={t} />
              ))}
            </RevealStagger>
          </div>
        </section>

        <MapSection />
        <Footer />
      </main>
    </div>
  );
}
