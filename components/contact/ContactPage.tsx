import { ConsultationForm } from "@/components/consultation/ConsultationForm";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MapSection } from "@/components/home/MapSection";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Reveal } from "@/components/site/Reveal";
import { FadeUp } from "@/components/site/FadeUp";
import { ScrollButton } from "@/components/site/ScrollButton";
import { MediaImage } from "@/components/site/MediaImage";
import { backgrounds } from "@/lib/images";

// Rendered by app/contact/page.tsx. A server component — the form is the only
// interactive part and it is a client leaf, so the page shell, the hero and the
// contact details all stay on the server.
//
// Same skeleton as /treatments and /doctors: hero, one content band, MapSection
// last inside <main>, Footer outside it.
export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Hero — reuses an existing optimized background. hero3 is the one
            slideshow image not yet serving as a page hero (hero2 is /doctors,
            treatments-hero is /treatments). */}
        <section id="top" className="relative flex h-[62vh] min-h-[460px] items-center overflow-hidden">
          {/* LCP element for this route — fetched eagerly. */}
          <MediaImage
            src={backgrounds.hero3}
            alt=""
            priority
            sizes="100vw"
            className="bg-center animate-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-gradient-hero-bottom" />
          {/* Above the fold, so the entrance is CSS `FadeUp`, not Motion
              `Reveal` — see the note in components/site/FadeUp.tsx. */}
          <div className="container relative z-10 mx-auto">
            <FadeUp>
              <SectionLabel onDark>Get in Touch</SectionLabel>
            </FadeUp>
            <FadeUp delay={80}>
              <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.05] tracking-editorial text-bone text-balance sm:text-5xl lg:text-6xl">
                Start with a <span className="italic text-gold">conversation</span>
              </h1>
            </FadeUp>
            <FadeUp delay={160}>
              <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-bone/80 sm:text-lg">
                Tell us what you would like to address and we will match you with
                the clinician best placed to advise. No obligation, no pressure —
                a conversation first, always.
              </p>
            </FadeUp>
            <FadeUp delay={240}>
              <div className="mt-8 flex flex-wrap gap-4">
                <ScrollButton to="#enquiry" variant="hero" size="xl" className="rounded-full">
                  Send an enquiry
                </ScrollButton>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Enquiry — form on the wide column, actionable details beside it.
            `#enquiry`, not `#contact`: the Footer held that id until this page
            existed, and two of them on one document is not a thing. */}
        <section id="enquiry" className="py-20 md:py-28">
          <div className="container mx-auto">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <Reveal>
                  <SectionLabel>Enquiries</SectionLabel>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2 className="mt-6 font-serif text-3xl leading-tight tracking-editorial text-foreground text-balance sm:text-4xl">
                    Send us a note
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-muted-foreground">
                    Treatment and doctor are optional here — leave them blank if
                    you are still deciding, and we will point you in the right
                    direction.
                  </p>
                </Reveal>
                <Reveal delay={0.15}>
                  <ConsultationForm submitLabel="Send Enquiry" className="mt-10" />
                </Reveal>
              </div>

              <div className="lg:col-span-5">
                <Reveal delay={0.1} x={24} y={0}>
                  <ContactDetails />
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <MapSection />
      </main>
      <Footer />
    </div>
  );
}
