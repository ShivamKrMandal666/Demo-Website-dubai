"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import * as m from "motion/react-m";
import { ArrowUpRight, Award, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/site/SectionLabel";
import { heroImages } from "@/lib/images";
import { scrollToId } from "@/lib/smooth-scroll";

const EASE = [0.22, 1, 0.36, 1] as const;

export const Hero = () => {
  const [active, setActive] = useState(0);
  // Highest slide index mounted so far. Starts at 0 so the initial paint
  // fetches one image instead of all three, then runs one ahead of `active`
  // so the next slide is already decoded when its 1.6s crossfade starts.
  // Never decreases — once a slide is mounted it stays mounted, so stepping
  // backwards through the indicators does not refetch.
  const [warm, setWarm] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Warm the neighbour of whichever slide is showing. Wrapping back to 0 still
  // leaves every slide mounted, so a full cycle settles at "all loaded".
  useEffect(() => {
    const next = (active + 1) % heroImages.length;
    setWarm((w) => Math.max(w, active, next));
  }, [active]);

  const handleBook = () =>
    toast("Booking request received", {
      description: "Our concierge will confirm your appointment shortly.",
    });

  return (
    <section id="top" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {/* 60% — Background slideshow (crossfade + slow ken burns) */}
      <div className="absolute inset-0">
        {heroImages.map((src, i) => (
          <div
            key={src.src}
            className="absolute inset-0 transition-opacity ease-out [transition-duration:1600ms]"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            {/* Only the first slide is fetched up front — it is the LCP paint.
                The rest mount once `warm` has reached them, which happens one
                slide ahead of the crossfade so the next image is decoded
                before its fade begins and the transition never flashes. */}
            {i <= warm && (
              <Image
                src={src}
                alt=""
                aria-hidden="true"
                fill
                // Deliberately NOT `priority`. The LCP element on this route is
                // the <h1>, not this image, and a high-priority image preload
                // measurably delayed the render-blocking stylesheet (28ms ->
                // 96ms on throttled 4G), pushing FCP out. `fetchPriority=high`
                // is reserved for routes where the image really is the LCP.
                loading={i === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className="object-cover bg-center animate-kenburns"
              />
            )}
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-hero-bottom" />
      </div>

      {/* 30% — Content */}
      <div className="container relative z-20 mx-auto flex h-full flex-col justify-center">
        <div className="max-w-2xl">
          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
            <SectionLabel onDark>Aesthetic &amp; Cosmetic Artistry</SectionLabel>
          </m.div>

          <m.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
            className="mt-6 font-serif text-4xl leading-[1.04] tracking-editorial text-bone text-balance sm:text-5xl lg:text-6xl"
          >
            Where science meets the art of{" "}
            <span className="italic text-gold">natural</span> beauty
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.24, ease: EASE }}
            className="mt-6 max-w-lg font-sans text-base leading-relaxed text-bone/80 sm:text-lg"
          >
            A private clinic where medical precision and quiet luxury restore
            confidence — one refined, unhurried result at a time.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.36, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button onClick={handleBook} variant="gold" size="xl" className="rounded-full">
              Book an Appointment
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button onClick={() => scrollToId("#treatments")} variant="hero" size="xl" className="rounded-full">
              Explore Treatments
            </Button>
          </m.div>

          {/* Slide indicators */}
          <div className="mt-12 flex items-center gap-3">
            {heroImages.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setActive(i)}
                className="group h-1 overflow-hidden rounded-full bg-bone/25 transition-all duration-500"
                style={{ width: i === active ? 44 : 20 }}
              >
                <span
                  className={cn(
                    "block h-full rounded-full bg-gold transition-transform duration-500",
                    i === active ? "scale-x-100" : "scale-x-0",
                  )}
                  style={{ transformOrigin: "left" }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 10% — Trust marker / award badge */}
      <m.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
        className="absolute bottom-8 right-5 z-20 hidden sm:block md:bottom-12 md:right-10"
      >
        <div className="flex items-center gap-4 rounded-2xl border border-bone/20 bg-espresso-deep/45 px-5 py-4 backdrop-blur-md">
          <Award className="h-9 w-9 shrink-0 text-gold" />
          <div className="leading-tight">
            <p className="font-serif text-lg text-bone">Best Aesthetic Clinic</p>
            <p className="font-sans text-[0.68rem] uppercase tracking-[0.22em] text-bone/60">
              Aesthetics Awards · 2024
            </p>
          </div>
        </div>
      </m.div>

      {/* Scroll cue */}
      <div className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="font-sans text-[0.62rem] uppercase tracking-[0.3em] text-bone/60">Scroll</span>
        <ArrowDown className="h-4 w-4 animate-scroll-cue text-bone/70" />
      </div>
    </section>
  );
};
