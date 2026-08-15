import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ToastButton, BOOKING_TOAST } from "@/components/site/ToastButton";
import { ScrollButton } from "@/components/site/ScrollButton";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MapSection } from "@/components/home/MapSection";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Reveal, RevealStagger } from "@/components/site/Reveal";
import { FadeUp } from "@/components/site/FadeUp";
import { TreatmentGridCard } from "@/components/treatments/TreatmentGridCard";
import { treatments } from "@/lib/data/site";
import { backgrounds, textures } from "@/lib/images";

// Rendered by app/treatments/page.tsx. A server component: the booking toast
// and the in-page scroll CTA are the only interactive parts, and they live in
// the ToastButton / ScrollButton client leaves, so none of this markup ships
// to the browser.
export default function TreatmentsPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Hero — single static background image */}
        <section id="top" className="relative flex h-[62vh] min-h-[460px] items-center overflow-hidden">
          {/* LCP element for this route — fetched eagerly. */}
          <Image
            src={backgrounds.treatmentsHero}
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-cover bg-center animate-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-gradient-hero-bottom" />
          {/* Above the fold, so the entrance is CSS `FadeUp`, not Motion
              `Reveal` — see the note in components/site/FadeUp.tsx. */}
          <div className="container relative z-10 mx-auto">
            <FadeUp>
              <SectionLabel onDark>Our Treatments</SectionLabel>
            </FadeUp>
            <FadeUp delay={80}>
              <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.05] tracking-editorial text-bone text-balance sm:text-5xl lg:text-6xl">
                Treatments &amp; therapies, crafted around you
              </h1>
            </FadeUp>
            <FadeUp delay={160}>
              <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-bone/80 sm:text-lg">
                A complete menu of medical-grade aesthetic treatments — each tailored,
                evidence-led and delivered with an unhurried, couture approach.
              </p>
            </FadeUp>
            <FadeUp delay={240}>
              <div className="mt-8 flex flex-wrap gap-4">
                <ToastButton
                  title={BOOKING_TOAST.title}
                  description={BOOKING_TOAST.description}
                  variant="gold"
                  size="xl"
                  className="rounded-full"
                >
                  Book an Appointment <ArrowUpRight className="h-4 w-4" />
                </ToastButton>
                <ScrollButton to="#treatments" variant="hero" size="xl" className="rounded-full">
                  Explore the menu
                </ScrollButton>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Our Treatments — non-uniform grid */}
        <section id="treatments" className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 bg-muted opacity-60" aria-hidden="true">
            <Image src={textures.treatments} alt="" fill sizes="100vw" className="object-cover" />
          </div>
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
      </main>
      <Footer />
    </div>
  );
}
