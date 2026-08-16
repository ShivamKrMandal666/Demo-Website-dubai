import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Reveal, RevealStagger, RevealItem } from "@/components/site/Reveal";
import { MediaImage } from "@/components/site/MediaImage";
import { treatments, type TreatmentRecord } from "@/lib/data/site";
import { treatmentCardImage, textures } from "@/lib/images";

// The five treatments flagged `home: true` — the same generated card images
// the Treatments page uses, no separate asset set.
const homeTreatments = treatments.filter((t) => t.home);

// Bento placement, index-aligned with `homeTreatments`. The first card is the
// feature (2×2); the last spans two columns. `sizes` follows the span so the
// browser never downloads a 66vw image for a 33vw slot.
const bento: { className?: string; sizes: string }[] = [
  { className: "md:col-span-2 md:row-span-2", sizes: "(min-width: 768px) 66vw, 100vw" },
  { sizes: "(min-width: 768px) 33vw, 100vw" },
  { sizes: "(min-width: 768px) 33vw, 100vw" },
  { sizes: "(min-width: 768px) 33vw, 100vw" },
  { className: "md:col-span-2", sizes: "(min-width: 768px) 66vw, 100vw" },
];

const TreatmentCard = ({
  t,
  className,
  sizes,
  eager,
}: {
  t: TreatmentRecord;
  className?: string;
  sizes: string;
  eager?: boolean;
}) => (
  <RevealItem className={cn("h-full", className)}>
    <Link
      href={`/treatments/${t.slug}`}
      className="group relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-elegant"
    >
      <div className="relative flex-1 overflow-hidden">
        <MediaImage
          src={treatmentCardImage(t.slug)}
          alt={t.name}
          eager={eager}
          sizes={sizes}
          className="transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-espresso-deep/55 via-transparent to-transparent"
          aria-hidden="true"
        />
        <span className="absolute left-5 top-4 rounded-full bg-espresso-deep/45 px-2.5 py-1 font-serif text-xs text-bone/90 backdrop-blur-sm">
          {String(t.n).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-6 pt-5">
        <h3 className="font-serif text-xl text-foreground md:text-2xl">{t.name}</h3>
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">{t.short}</p>
        <span className="mt-2 inline-flex items-center gap-2 font-sans text-xs font-medium uppercase tracking-[0.18em] text-primary">
          Discover
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  </RevealItem>
);

export const Treatments = () => (
  <section id="treatments" className="relative overflow-hidden py-24 md:py-32">
    {/* subtle linen texture background */}
    <div className="absolute inset-0 bg-muted opacity-60" aria-hidden="true">
      <Image src={textures.treatments} alt="" fill sizes="100vw" className="object-cover" />
    </div>
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
        {homeTreatments.map((t, i) => (
          <TreatmentCard
            key={t.slug}
            t={t}
            className={bento[i]?.className}
            sizes={bento[i]?.sizes ?? "(min-width: 768px) 33vw, 100vw"}
            // The 2x2 feature card is the largest image in this section and the
            // first one a visitor scrolls into from the hero.
            eager={i === 0}
          />
        ))}
      </RevealStagger>

      <Reveal delay={0.05} className="mt-12 flex justify-center">
        <Link
          href="/treatments"
          className="group inline-flex items-center gap-2 font-sans text-xs font-medium uppercase tracking-[0.18em] text-primary transition-colors duration-300 hover:text-foreground"
        >
          View all ten treatments
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </div>
  </section>
);
