"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Reveal } from "@/components/site/Reveal";
import { MediaImage } from "@/components/site/MediaImage";
import { doctors } from "@/lib/data/site";
import { doctorPortrait } from "@/lib/images";

const DURATION = 5500;
const EASE = [0.22, 1, 0.36, 1] as const;

const slide = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
};

export const Doctors = () => {
  const [[active, dir], setState] = useState<[number, number]>([0, 0]);
  const len = doctors.length;

  const go = useCallback(
    (next: number, direction: number) => setState([(next + len) % len, direction]),
    [len],
  );

  useEffect(() => {
    const id = setInterval(() => setState(([a]) => [(a + 1) % len, 1]), DURATION);
    return () => clearInterval(id);
  }, [len, active]);

  const doc = doctors[active];

  return (
    <section id="doctors" className="relative overflow-hidden bg-secondary py-16 sm:py-24 md:py-32">
      {/* warm radial glow for depth. Sized down on mobile: a 600px blur-3xl layer
          is a real compositing cost on a phone for decoration that is mostly
          off-screen there anyway. */}
      <div
        className="pointer-events-none absolute -right-1/4 top-0 h-[320px] w-[320px] rounded-full opacity-40 blur-3xl md:h-[600px] md:w-[600px]"
        style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.35), transparent 65%)" }}
        aria-hidden="true"
      />
      <div className="container relative z-10 mx-auto">
        <Reveal><SectionLabel onDark>Our Specialists</SectionLabel></Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-2xl font-serif text-3xl leading-tight tracking-editorial text-bone text-balance sm:text-4xl lg:text-5xl">
            The doctors behind every considered result
          </h2>
        </Reveal>

        <div className="mt-10 grid items-center gap-8 sm:mt-12 sm:gap-10 md:mt-16 md:grid-cols-2 md:gap-16">
          {/* Portrait (rotates) */}
          <div className="relative">
            {/* Hidden below lg: the container gutter is 20px until then, so a
                -12px offset frame sits 8px off the viewport edge. Same guard,
                same breakpoint, as the profiles on /doctors. */}
            <div className="pointer-events-none absolute -left-3 -top-3 hidden h-full w-full rounded-2xl border border-gold/25 lg:block" aria-hidden="true" />
            {/* 4:5 is 437px tall at full mobile width — over half a phone screen
                for the portrait alone. Square below md, where the grid stops
                giving this the full container width.
                    The box has to stay in proportion to the source, not just be
                short: the portraits are 4:5, so a 4:3 box discarded 40% of their
                height and a centred crop opened mid-forehead. Square discards
                20%, and `object-top` spends all of it on the bottom of the frame
                — legs and furniture — so every head keeps its headroom. From md
                the box matches the source exactly and nothing is cropped. */}
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-bone/15 bg-espresso-deep/60 md:aspect-[4/5]">
              {/* All five portraits are in the DOM at once, crossfading on
                  opacity — the same approach the Hero slideshow uses. Inside
                  AnimatePresence only the active slide would be mounted, so
                  each rotation would fetch its portrait on arrival and pop.
                  The detail pane below keeps AnimatePresence and its slide.

                  All five are decorative: `opacity-0` does not remove an
                  element from the accessibility tree, so naming them here
                  would announce four hidden doctors alongside the active one.
                  The overlay below and the detail pane already name the active
                  doctor in text. */}
              {/* The crossfade opacity moved from the <img> to a wrapper: a
                  MediaImage renders its blur layer as a sibling of the image,
                  so fading only the image would leave five blurs stacked at
                  full opacity. This is the same wrapper pattern the Hero
                  slideshow uses. */}
              {doctors.map((d, i) => (
                <div
                  key={d.slug}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-700 ease-out",
                    i === active ? "opacity-100" : "opacity-0",
                  )}
                >
                  <MediaImage
                    src={doctorPortrait(d.slug)}
                    alt=""
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-top md:object-center"
                  />
                </div>
              ))}
              {/* name overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso-deep/90 to-transparent p-6">
                <p className="font-serif text-xl text-bone">{doc.name}</p>
                <p className="font-sans text-xs uppercase tracking-[0.2em] text-gold/90">{doc.specialty}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <AnimatePresence mode="wait" custom={dir}>
              {/* The floor belongs on the swapping pane, not on the wrapper: the
                  wrapper also holds the controls, timer and CTA, so its height
                  never dipped near a 300px floor at any breakpoint and the
                  carousel still jolted between doctors of different bio length. */}
              <m.div
                key={doc.name}
                className="min-h-[260px] sm:min-h-[280px]"
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: EASE }}
              >
                <p className="font-sans text-sm uppercase tracking-[0.22em] text-gold">{doc.credentials}</p>
                <h3 className="mt-3 font-serif text-3xl text-bone sm:text-4xl">{doc.name}</h3>
                <p className="mt-5 max-w-lg font-sans text-base leading-relaxed text-bone/70">{doc.bio}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {doc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-bone/20 bg-bone/5 px-4 py-1.5 font-sans text-xs tracking-wide text-bone/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </m.div>
            </AnimatePresence>

            {/* Controls + progress */}
            <div className="mt-8 flex items-center gap-6 md:mt-10">
              <div className="flex gap-2">
                <button
                  aria-label="Previous doctor"
                  onClick={() => go(active - 1, -1)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-bone/25 text-bone transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-accent-foreground"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  aria-label="Next doctor"
                  onClick={() => go(active + 1, 1)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-bone/25 text-bone transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-accent-foreground"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* dots */}
              <div className="flex items-center gap-2.5">
                {doctors.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Doctor ${i + 1}`}
                    onClick={() => go(i, i > active ? 1 : -1)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-500",
                      i === active ? "w-8 bg-gold" : "w-2 bg-bone/30 hover:bg-bone/50",
                    )}
                  />
                ))}
              </div>
            </div>

            {/* thin timer bar */}
            <div className="mt-5 h-px w-full max-w-xs overflow-hidden bg-bone/15">
              <m.div
                key={active}
                className="h-full bg-gold/80"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: DURATION / 1000, ease: "linear" }}
              />
            </div>

            <Button asChild variant="outlineBone" size="sm" className="mt-6 rounded-full md:mt-8">
              <Link href="/doctors">
                Meet the team
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
