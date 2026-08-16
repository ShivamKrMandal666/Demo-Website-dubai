import Image from "next/image";
import { Check, Globe, GraduationCap, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookButton } from "@/components/site/BookButton";
import { ScrollButton } from "@/components/site/ScrollButton";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MapSection } from "@/components/home/MapSection";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Reveal, RevealStagger, RevealItem } from "@/components/site/Reveal";
import { FadeUp } from "@/components/site/FadeUp";
import { clinic, doctors } from "@/lib/data/site";
import { backgrounds, textures, doctorPortrait } from "@/lib/images";

// How a consultation actually runs — the same three-card pattern the treatment
// detail pages use for their results timeline.
const process = [
  {
    title: "The consultation",
    text: "An unhurried hour. We assess, discuss what you want to feel rather than fix, and tell you honestly if the answer is no treatment at all.",
  },
  {
    title: "A considered plan",
    text: "Complex plans are reviewed by the full team before anything is booked. You leave knowing the sequence, the cost and the realistic outcome.",
  },
  {
    title: "Aftercare that follows up",
    text: "Every treatment carries a review appointment. Results are refined against how your skin actually responded, not against a standard schedule.",
  },
];

// Rendered by app/doctors/page.tsx. A server component: the in-page scroll CTA
// is the only interactive part and it lives in the ScrollButton client leaf, so
// none of this markup ships. `BookButton` is a plain link, so it stays here too.
export default function DoctorsPage() {
  const stats = [
    { value: String(clinic.established), label: "Established" },
    { value: "18", label: "Years, lead clinician" },
    { value: String(doctors.length), label: "Specialists" },
    { value: "12k+", label: "Treatments delivered" },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Hero — reuses an existing optimized background, same ken-burns
            treatment as /treatments. */}
        <section id="top" className="relative flex h-[62vh] min-h-[460px] items-center overflow-hidden">
          {/* LCP element for this route — fetched eagerly. */}
          <Image
            src={backgrounds.hero2}
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
              <SectionLabel onDark>Our Specialists</SectionLabel>
            </FadeUp>
            <FadeUp delay={80}>
              <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.05] tracking-editorial text-bone text-balance sm:text-5xl lg:text-6xl">
                Medicine practised with <span className="italic text-gold">restraint</span>
              </h1>
            </FadeUp>
            <FadeUp delay={160}>
              <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-bone/80 sm:text-lg">
                Five doctors, one standard. Every plan at Maison Lumé is drawn by a
                clinician who would rather decline a treatment than deliver one you
                did not need.
              </p>
            </FadeUp>
            <FadeUp delay={240}>
              <div className="mt-8 flex flex-wrap gap-4">
                <BookButton variant="gold" size="xl" className="rounded-full" />
                <ScrollButton to="#team" variant="hero" size="xl" className="rounded-full">
                  Meet the doctors
                </ScrollButton>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Ethos + the numbers behind it */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 bg-muted opacity-60" aria-hidden="true">
            <Image src={textures.about} alt="" fill sizes="100vw" className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-background/60" aria-hidden="true" />
          <div className="container relative z-10 mx-auto">
            <div className="grid gap-10 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-5">
                <Reveal>
                  <SectionLabel>The team</SectionLabel>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2 className="mt-6 font-serif text-3xl leading-tight tracking-editorial text-foreground text-balance sm:text-4xl lg:text-5xl">
                    A small team, on purpose
                  </h2>
                </Reveal>
              </div>
              <div className="md:col-span-6 md:col-start-7">
                <Reveal delay={0.1}>
                  <p className="font-sans text-base leading-relaxed text-muted-foreground">
                    We have stayed deliberately small. Five doctors means every patient
                    is known by the person treating them, every complex case is
                    discussed by the whole team, and nobody is handed between
                    clinicians halfway through a plan.
                  </p>
                </Reveal>
                <Reveal delay={0.15}>
                  <p className="mt-5 font-sans text-base leading-relaxed text-muted-foreground">
                    All five hold full medical registration and treat aesthetics as
                    medicine — assessed, evidenced and reviewed.
                  </p>
                </Reveal>
              </div>
            </div>

            <RevealStagger stagger={0.08} className="mt-14 grid grid-cols-2 gap-5 md:mt-20 md:grid-cols-4">
              {stats.map((s) => (
                <RevealItem key={s.label} className="h-full">
                  <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-elegant">
                    <p className="font-serif text-4xl text-foreground">{s.value}</p>
                    <p className="mt-2 font-sans text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        </section>

        {/* The five profiles — alternating sides */}
        <section id="team" className="py-20 md:py-28">
          <div className="container mx-auto">
            <div className="max-w-2xl">
              <Reveal>
                <SectionLabel>Meet the doctors</SectionLabel>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-6 font-serif text-3xl leading-tight tracking-editorial text-foreground text-balance sm:text-4xl lg:text-5xl">
                  The doctors behind every considered result
                </h2>
              </Reveal>
            </div>

            <div className="mt-14 space-y-20 md:mt-20 md:space-y-28">
              {doctors.map((doc, i) => {
                const flipped = i % 2 === 1;
                const firstName = doc.name.replace(/^Dr\.\s*/, "").split(" ")[0];

                return (
                  <article key={doc.slug} className="grid gap-10 md:grid-cols-12 md:gap-14">
                    {/* Portrait */}
                    <Reveal
                      x={flipped ? 30 : -30}
                      y={0}
                      className={cn("md:col-span-5", flipped && "md:order-2 md:col-start-8")}
                    >
                      <div className="relative">
                        <div
                          className={cn(
                            "pointer-events-none absolute -top-3 hidden h-full w-full rounded-3xl border border-gold/30 sm:block",
                            flipped ? "-right-3" : "-left-3",
                          )}
                          aria-hidden="true"
                        />
                        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-muted shadow-elegant">
                          {/* Not `priority` — the hero above is this route's
                              declared LCP element. */}
                          <Image
                            src={doctorPortrait(doc.slug)}
                            alt={doc.name}
                            fill
                            sizes="(min-width: 768px) 40vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </Reveal>

                    {/* Details */}
                    <Reveal
                      x={flipped ? -30 : 30}
                      y={0}
                      delay={0.05}
                      className={cn("md:col-span-6", flipped ? "md:order-1" : "md:col-start-7")}
                    >
                      <span className="font-serif text-4xl text-gold/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-3 font-serif text-3xl leading-tight tracking-editorial text-foreground sm:text-4xl">
                        {doc.name}
                      </h3>
                      <p className="mt-3 font-sans text-xs uppercase tracking-[0.22em] text-primary">
                        {doc.credentials}
                      </p>

                      <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground">
                        {doc.bio}
                      </p>
                      <p className="mt-4 font-sans text-base leading-relaxed text-muted-foreground">
                        {doc.approach}
                      </p>

                      {/* Focus areas */}
                      <div className="mt-8">
                        <p className="flex items-center gap-2 font-sans text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                          <Stethoscope className="h-3.5 w-3.5 text-primary" />
                          Clinical focus
                        </p>
                        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                          {doc.focus.map((f) => (
                            <li key={f} className="flex items-start gap-3">
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Check className="h-3 w-3" />
                              </span>
                              <span className="font-sans text-sm text-foreground/90">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Training */}
                      <div className="mt-8">
                        <p className="flex items-center gap-2 font-sans text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                          <GraduationCap className="h-3.5 w-3.5 text-primary" />
                          Training
                        </p>
                        <ul className="mt-3 space-y-1.5">
                          {doc.training.map((t) => (
                            <li key={t} className="font-sans text-sm text-muted-foreground">
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Micro-facts + tags */}
                      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                        <div>
                          <p className="font-sans text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                            In practice
                          </p>
                          <p className="mt-1 font-sans text-sm text-foreground">
                            {doc.years} years
                          </p>
                        </div>
                        <div>
                          <p className="flex items-center gap-2 font-sans text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                            <Globe className="h-3.5 w-3.5 text-primary" />
                            Languages
                          </p>
                          <p className="mt-1 font-sans text-sm text-foreground">
                            {doc.languages.join(" · ")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {doc.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border bg-muted/60 px-4 py-1.5 font-sans text-xs tracking-wide text-foreground/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Named CTA, but the same destination — /book opens
                          with this doctor already selected. */}
                      <BookButton
                        doctor={doc.slug}
                        label={`Consult with ${firstName}`}
                        variant="gold"
                        size="lg"
                        className="mt-8 rounded-full"
                      />
                    </Reveal>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* How we work */}
        <section className="relative overflow-hidden bg-secondary py-20 md:py-28">
          <div
            className="pointer-events-none absolute -left-1/4 bottom-0 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.3), transparent 65%)" }}
            aria-hidden="true"
          />
          <div className="container relative z-10 mx-auto">
            <div className="max-w-2xl">
              <Reveal>
                <SectionLabel onDark>How we work</SectionLabel>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-6 font-serif text-3xl leading-tight tracking-editorial text-bone text-balance sm:text-4xl lg:text-5xl">
                  The same three steps, every patient
                </h2>
              </Reveal>
            </div>
            <RevealStagger stagger={0.1} className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
              {process.map((p, i) => (
                <RevealItem key={p.title} className="h-full">
                  <div className="h-full rounded-2xl border border-bone/15 bg-bone/5 p-7 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-gold/40">
                    <span className="font-serif text-4xl text-gold/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 font-serif text-xl text-bone">{p.title}</h3>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-bone/70">{p.text}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        </section>

        {/* CTA band */}
        <section className="relative overflow-hidden">
          {/* Stays a CSS background on purpose: `bg-fixed` (the desktop
              parallax) has no next/image equivalent. */}
          <div
            className="absolute inset-0 bg-cover bg-center md:bg-fixed"
            style={{ backgroundImage: `url(${textures.ctaBand.src})` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-espresso-deep/75" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso-deep/85 to-transparent" aria-hidden="true" />
          <div className="container relative z-10 mx-auto py-20 md:py-28">
            <div className="max-w-xl">
              <Reveal>
                <SectionLabel onDark>Ready when you are</SectionLabel>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-6 font-serif text-3xl leading-tight tracking-editorial text-bone text-balance sm:text-4xl lg:text-5xl">
                  Choose your doctor, or let us choose for you
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-bone/80">
                  Tell us what you would like to address and we will match you with
                  the clinician best placed to advise — no pressure, only expertise.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <BookButton variant="gold" size="xl" className="mt-8 rounded-full" />
              </Reveal>
            </div>
          </div>
        </section>

        <MapSection />
      </main>
      <Footer />
    </div>
  );
}
