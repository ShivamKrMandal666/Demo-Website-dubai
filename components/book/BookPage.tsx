import { Suspense } from "react";
import { Check } from "lucide-react";
import { ConsultationForm } from "@/components/consultation/ConsultationForm";
import { PrefilledConsultationForm } from "@/components/consultation/PrefilledConsultationForm";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MapSection } from "@/components/home/MapSection";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Reveal } from "@/components/site/Reveal";
import { FadeUp } from "@/components/site/FadeUp";
import { MediaImage } from "@/components/site/MediaImage";
import { requestAssurances } from "@/lib/data/consultation";
import { backgrounds } from "@/lib/images";

// Rendered by app/book/page.tsx — the destination of every booking CTA on the
// site. Same form as /contact; the difference is that a CTA can name a
// treatment or a doctor in the query string and arrive with it selected.
export default function BookPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Deliberately shorter than the 62vh heroes on the browse routes:
            /book is a task, and the first field should not start below the
            fold. */}
        <section id="top" className="relative flex h-[42svh] min-h-[340px] items-center overflow-hidden">
          {/* LCP element for this route — fetched eagerly. */}
          <MediaImage
            src={backgrounds.hero1}
            alt=""
            priority
            sizes="100vw"
            className="bg-center animate-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-gradient-hero-bottom" />
          <div className="container relative z-10 mx-auto">
            <FadeUp>
              <SectionLabel onDark>Book a Consultation</SectionLabel>
            </FadeUp>
            <FadeUp delay={80}>
              <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-[1.05] tracking-editorial text-bone text-balance sm:text-5xl">
                Request your consultation
              </h1>
            </FadeUp>
            <FadeUp delay={160}>
              <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-bone/80">
                Share a few details and a coordinator will call to agree a time
                that suits you.
              </p>
            </FadeUp>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container mx-auto">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                {/* The boundary is what keeps this route in the static
                    prerender: `useSearchParams` inside PrefilledConsultationForm
                    would otherwise force the whole page to render per request.
                    The fallback is the real form rather than a skeleton, so the
                    prerendered HTML ships a complete, usable form and there is
                    no swap to look at. */}
                <Suspense fallback={<ConsultationForm />}>
                  <PrefilledConsultationForm />
                </Suspense>
              </div>

              <aside className="lg:col-span-5">
                <Reveal delay={0.1} x={24} y={0}>
                  <div className="rounded-3xl border border-border bg-muted/50 p-8 shadow-soft md:p-10">
                    <SectionLabel>What happens next</SectionLabel>
                    <ul className="mt-7 space-y-5">
                      {requestAssurances.map((line) => (
                        <li key={line} className="flex items-start gap-3">
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          <span className="font-sans text-sm leading-relaxed text-muted-foreground">
                            {line}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-8 border-t border-border pt-6 font-sans text-sm leading-relaxed text-muted-foreground">
                      Consultations are unhurried and honest. If a treatment is
                      not right for you, we will say so.
                    </p>
                  </div>
                </Reveal>
              </aside>
            </div>
          </div>
        </section>

        <MapSection />
      </main>
      <Footer />
    </div>
  );
}
