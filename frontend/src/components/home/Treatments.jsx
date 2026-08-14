import { ImageIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Reveal, RevealStagger, RevealItem } from "@/components/site/Reveal";
import { treatments } from "@/data/site";
import { textures } from "@/lib/assets";

const TreatmentCard = ({ t, className }) => (
  <RevealItem className={cn("h-full", className)}>
    <article
      className={cn(
        "group relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-elegant",
      )}
    >
      {/* Placeholder image area (client-supplied foreground) */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-muted to-accent/15 p-6">
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-foreground/15 px-7 py-8 text-center">
          <ImageIcon className="h-6 w-6 text-primary/55" />
          <span className="font-sans text-[0.66rem] uppercase tracking-[0.2em] text-muted-foreground">
            Treatment image
          </span>
        </div>
        <span className="absolute left-5 top-4 font-serif text-sm text-foreground/40">
          {String(t.n).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-6 pt-5">
        <h3 className={cn("font-serif text-foreground", t.feature ? "text-2xl md:text-3xl" : "text-xl md:text-2xl")}>
          {t.name}
        </h3>
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
        <span className="mt-2 inline-flex items-center gap-2 font-sans text-xs font-medium uppercase tracking-[0.18em] text-primary">
          Discover
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  </RevealItem>
);

export const Treatments = () => (
  <section id="treatments" className="relative overflow-hidden py-24 md:py-32">
    {/* subtle linen texture background */}
    <div
      className="absolute inset-0 bg-muted bg-cover bg-center opacity-60"
      style={{ backgroundImage: `url(${textures.treatments})` }}
      aria-hidden="true"
    />
    <div className="absolute inset-0 bg-background/50" aria-hidden="true" />

    <div className="container relative z-10 mx-auto">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <Reveal><SectionLabel>Signature Treatments</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-serif text-3xl leading-tight tracking-editorial text-foreground text-balance sm:text-4xl lg:text-5xl">
              A curated menu of medical-grade artistry
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-sm font-sans text-base leading-relaxed text-muted-foreground">
            Each protocol is tailored, evidence-led and delivered with an
            unhurried, couture approach across the face and body.
          </p>
        </Reveal>
      </div>

      {/* Varied bento grid — one feature card + smaller supporting cards */}
      <RevealStagger
        stagger={0.1}
        className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-3 md:auto-rows-[minmax(0,220px)]"
      >
        <TreatmentCard t={treatments[0]} className="md:col-span-2 md:row-span-2" />
        <TreatmentCard t={treatments[1]} />
        <TreatmentCard t={treatments[2]} />
        <TreatmentCard t={treatments[3]} />
        <TreatmentCard t={treatments[4]} className="md:col-span-2" />
      </RevealStagger>
    </div>
  </section>
);
