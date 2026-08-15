"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Reveal } from "@/components/site/Reveal";
import { doctors } from "@/lib/data/site";

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
    <section id="doctors" className="relative overflow-hidden bg-secondary py-24 md:py-32">
      {/* warm radial glow for depth */}
      <div
        className="pointer-events-none absolute -right-1/4 top-0 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl"
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

        <div className="mt-12 grid items-center gap-10 md:mt-16 md:grid-cols-2 md:gap-16">
          {/* Portrait placeholder (rotates) */}
          <div className="relative">
            <div className="pointer-events-none absolute -left-3 -top-3 h-full w-full rounded-2xl border border-gold/25" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-bone/15 bg-espresso-deep/60">
              <AnimatePresence mode="wait" custom={dir}>
                <m.div
                  key={doc.name}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: EASE }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-gold/40 bg-bone/5">
                    <span className="font-serif text-3xl text-gold">{doc.initials}</span>
                  </div>
                  <div className="mt-5 flex flex-col items-center gap-1">
                    <ImageIcon className="h-5 w-5 text-bone/40" />
                    <span className="font-sans text-[0.64rem] uppercase tracking-[0.24em] text-bone/45">
                      Portrait image
                    </span>
                  </div>
                </m.div>
              </AnimatePresence>
              {/* name overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso-deep/90 to-transparent p-6">
                <p className="font-serif text-xl text-bone">{doc.name}</p>
                <p className="font-sans text-xs uppercase tracking-[0.2em] text-gold/90">{doc.specialty}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="min-h-[300px]">
            <AnimatePresence mode="wait" custom={dir}>
              <m.div
                key={doc.name}
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
            <div className="mt-10 flex items-center gap-6">
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
          </div>
        </div>
      </div>
    </section>
  );
};
