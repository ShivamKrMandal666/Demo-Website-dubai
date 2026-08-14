import { useParams, Navigate, Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  CalendarDays,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Reveal, RevealStagger, RevealItem } from "@/components/site/Reveal";
import { getTreatmentBySlug, treatments } from "@/data/site";
import { treatmentCardImage, treatmentHeroImage } from "@/lib/images";

export default function TreatmentDetail() {
  const { slug } = useParams();
  const t = getTreatmentBySlug(slug);
  if (!t) return <Navigate to="/treatments" replace />;

  const book = () =>
    toast("Booking request received", {
      description: `We'll confirm your ${t.name} consultation shortly.`,
    });

  const others = treatments.filter((x) => x.slug !== t.slug).slice(0, 3);
  const facts = [
    { Icon: Clock, label: "Duration", value: t.duration },
    { Icon: CalendarDays, label: "Sessions", value: t.sessions },
    { Icon: Sparkles, label: "Downtime", value: t.downtime },
    { Icon: TrendingUp, label: "Results", value: t.results },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Hero — unique background per treatment */}
        <section id="top" className="relative flex h-[60vh] min-h-[440px] items-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center animate-kenburns"
            style={{ backgroundImage: `url(${treatmentHeroImage(t.slug)})` }}
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-gradient-hero-bottom" />
          <div className="container relative z-10 mx-auto">
            <Reveal>
              <Link
                to="/treatments"
                className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-bone/70 transition-colors hover:text-gold"
              >
                <ArrowLeft className="h-4 w-4" /> All Treatments
              </Link>
            </Reveal>
            <Reveal delay={0.06} className="mt-5">
              <SectionLabel onDark>Treatment</SectionLabel>
            </Reveal>
            <Reveal delay={0.12}>
              <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.05] tracking-editorial text-bone text-balance sm:text-5xl lg:text-6xl">
                {t.name}
              </h1>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-bone/80 sm:text-lg">
                {t.tagline}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Treatment image block — medium, gently overlapping the hero */}
        <section className="relative z-10 -mt-16 md:-mt-24">
          <div className="container mx-auto">
            <Reveal y={40}>
              <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border shadow-elegant">
                <img
                  src={treatmentCardImage(t.slug)}
                  alt={t.name}
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Full details */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            <div className="grid gap-12 md:grid-cols-12 md:gap-16">
              {/* Main copy */}
              <div className="md:col-span-7">
                <Reveal>
                  <SectionLabel>What it is</SectionLabel>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2 className="mt-5 font-serif text-3xl leading-tight tracking-editorial text-foreground sm:text-4xl">
                    Understanding {t.name}
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="mt-5 font-sans text-base leading-relaxed text-muted-foreground">
                    {t.overview}
                  </p>
                </Reveal>

                <Reveal className="mt-10">
                  <SectionLabel>How it works</SectionLabel>
                </Reveal>
                <Reveal delay={0.05}>
                  <p className="mt-5 font-sans text-base leading-relaxed text-muted-foreground">
                    {t.how}
                  </p>
                </Reveal>

                <div className="mt-10">
                  <h3 className="font-serif text-2xl text-foreground">Key benefits</h3>
                  <RevealStagger stagger={0.08} className="mt-5 grid gap-3 sm:grid-cols-2">
                    {t.benefits.map((b) => (
                      <RevealItem key={b}>
                        <div className="flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-soft">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          <span className="font-sans text-sm text-foreground/90">{b}</span>
                        </div>
                      </RevealItem>
                    ))}
                  </RevealStagger>
                </div>
              </div>

              {/* Quick facts aside */}
              <div className="md:col-span-5">
                <Reveal x={30} y={0}>
                  <div className="rounded-2xl border border-border bg-card p-7 shadow-elegant md:sticky md:top-24">
                    <h3 className="font-serif text-xl text-foreground">At a glance</h3>
                    <div className="mt-5 space-y-4">
                      {facts.map(({ Icon, label, value }) => (
                        <div
                          key={label}
                          className="flex items-start gap-4 border-b border-border/60 pb-4 last:border-0 last:pb-0"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                              {label}
                            </p>
                            <p className="mt-0.5 font-sans text-sm text-foreground">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button onClick={book} variant="gold" size="lg" className="mt-7 w-full rounded-full">
                      Book an Appointment <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Reveal>
              </div>
            </div>

            {/* Results timeline */}
            <div className="mt-16 md:mt-20">
              <Reveal>
                <SectionLabel>Results timeline</SectionLabel>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-5 font-serif text-3xl leading-tight tracking-editorial text-foreground sm:text-4xl">
                  What to expect
                </h2>
              </Reveal>
              <RevealStagger stagger={0.1} className="mt-8 grid gap-5 md:grid-cols-3">
                {t.timeline.map((s, i) => (
                  <RevealItem key={s.phase} className="h-full">
                    <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-elegant">
                      <span className="font-serif text-4xl text-gold/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-3 font-sans text-xs uppercase tracking-[0.2em] text-primary">
                        {s.phase}
                      </p>
                      <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                        {s.text}
                      </p>
                    </div>
                  </RevealItem>
                ))}
              </RevealStagger>
            </div>
          </div>
        </section>

        {/* CTA band over the treatment's hero image */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center md:bg-fixed"
            style={{ backgroundImage: `url(${treatmentHeroImage(t.slug)})` }}
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
                  Book your {t.name} consultation
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-bone/80">
                  Speak with our specialists about whether {t.name} is right for you —
                  no pressure, only expertise.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <Button onClick={book} variant="gold" size="xl" className="mt-8 rounded-full">
                  Book an Appointment <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Continue exploring */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            <Reveal className="mb-8 flex items-end justify-between gap-4">
              <div>
                <SectionLabel>Continue exploring</SectionLabel>
                <h2 className="mt-5 font-serif text-2xl leading-tight text-foreground sm:text-3xl">
                  Other treatments
                </h2>
              </div>
              <Button asChild variant="outlineSage" size="sm" className="shrink-0 rounded-full">
                <Link to="/treatments">View all</Link>
              </Button>
            </Reveal>
            <RevealStagger stagger={0.1} className="grid gap-6 sm:grid-cols-3">
              {others.map((o) => (
                <RevealItem key={o.slug} className="h-full">
                  <Link
                    to={`/treatments/${o.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-elegant"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={treatmentCardImage(o.slug)}
                        alt={o.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-serif text-lg text-foreground">{o.name}</h3>
                      <span className="mt-auto inline-flex items-center gap-2 pt-4 font-sans text-xs font-medium uppercase tracking-[0.18em] text-primary">
                        Know more
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
