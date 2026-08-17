import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { RevealItem } from "@/components/site/Reveal";
import { MediaImage } from "@/components/site/MediaImage";
import { treatmentCardImage } from "@/lib/images";
import type { TreatmentRecord, TreatmentSpan } from "@/lib/data/site";

// Non-uniform grid card for the Treatments page. `span` drives width on the
// md 6-col grid; aspect ratio varies with it so the layout never looks flat.
const spanClass: Record<TreatmentSpan, string> = {
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
};
// Gated to `md`, because `span` only means anything there. Applied at every
// width it made a stacked mobile column alternate between full-width squares and
// 16:10 letterboxes for no reason the reader can see — the variety is a function
// of the 6-col grid, so it starts when the grid does.
const aspectClass: Record<TreatmentSpan, string> = {
  2: "md:aspect-square",
  3: "md:aspect-[4/3]",
  4: "md:aspect-[16/10]",
};
// Column share of the 6-col md grid, so the browser picks the right source.
const sizesClass: Record<TreatmentSpan, string> = {
  2: "(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw",
  3: "(min-width: 768px) 50vw, (min-width: 640px) 50vw, 100vw",
  4: "(min-width: 768px) 66vw, (min-width: 640px) 50vw, 100vw",
};

// `eager` on the first row: those cards sit just under the 62vh hero, so
// waiting for them to intersect is what produced the pop on first scroll.
const EAGER_ROWS = 2;

export const TreatmentGridCard = ({ t, index }: { t: TreatmentRecord; index: number }) => (
  <RevealItem className={cn("h-full", spanClass[t.span] || "md:col-span-2")}>
    <Link
      href={`/treatments/${t.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-elegant"
    >
      <div className={cn("relative aspect-[4/3] overflow-hidden", aspectClass[t.span] || "md:aspect-square")}>
        <MediaImage
          src={treatmentCardImage(t.slug)}
          alt={t.name}
          eager={index < EAGER_ROWS}
          sizes={sizesClass[t.span] || "100vw"}
          className="transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-deep/55 via-transparent to-transparent" />
        <span className="absolute left-5 top-4 rounded-full bg-espresso-deep/45 px-2.5 py-1 font-serif text-xs text-bone/90 backdrop-blur-sm">
          {String(t.n).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-xl text-foreground md:text-2xl">{t.name}</h3>
        <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">{t.short}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 font-sans text-xs font-medium uppercase tracking-[0.18em] text-primary">
          Know More
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  </RevealItem>
);
