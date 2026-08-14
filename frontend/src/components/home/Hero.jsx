import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Award, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/site/SectionLabel";
import { heroImages } from "@/lib/assets";
import { scrollToId } from "@/hooks/useSmoothScroll";

const EASE = [0.22, 1, 0.36, 1];

export const Hero = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

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
            key={src}
            className="absolute inset-0 transition-opacity ease-out [transition-duration:1600ms]"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            <div
              className="h-full w-full bg-cover bg-center animate-kenburns"
              style={{ backgroundImage: `url(${src})` }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-hero-bottom" />
      </div>

      {/* 30% — Content */}
      <div className="container relative z-20 mx-auto flex h-full flex-col justify-center">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
            <SectionLabel onDark>Aesthetic & Cosmetic Artistry</SectionLabel>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
            className="mt-6 font-serif text-4xl leading-[1.04] tracking-editorial text-bone text-balance sm:text-5xl lg:text-6xl"
          >
            Where science meets the art of{" "}
            <span className="italic text-gold">natural</span> beauty
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.24, ease: EASE }}
            className="mt-6 max-w-lg font-sans text-base leading-relaxed text-bone/80 sm:text-lg"
          >
            A private clinic where medical precision and quiet luxury restore
            confidence — one refined, unhurried result at a time.
          </motion.p>

          <motion.div
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
          </motion.div>

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
      <motion.div
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
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="font-sans text-[0.62rem] uppercase tracking-[0.3em] text-bone/60">Scroll</span>
        <ArrowDown className="h-4 w-4 animate-scroll-cue text-bone/70" />
      </div>
    </section>
  );
};
