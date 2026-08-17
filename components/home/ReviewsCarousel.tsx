"use client";

// ---------------------------------------------------------------------------
// The rotating half of the reviews section.
//
// A client leaf, so Testimonials itself stays a server component — the same
// split ToastButton uses. Everything static (backdrop, heading, Google rating
// block) is rendered on the server around this.
//
// The interaction is the Home Doctors carousel's: one interval, the same 5.5s
// beat, the same [index, direction] tuple, the same house easing curve and the
// same arrows / dots / timer-bar controls. What it does *not* copy is that
// section's mobile box sizing.
// ---------------------------------------------------------------------------
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Stars } from "@/components/site/Stars";
import { reviews } from "@/lib/data/site";

const DURATION = 5500;
const EASE = [0.22, 1, 0.36, 1] as const;

// How many cards are on screen at the widest breakpoint. Three slots are always
// rendered; CSS hides slots 2 and 3 below md.
const SLOTS = 3;

const slide = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
};

export const ReviewsCarousel = () => {
  const [[active, dir], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const len = reviews.length;

  // Auto-rotation is motion the visitor did not ask for, so it is the one thing
  // here that reduced motion switches off entirely — the arrows and dots still
  // work. Read once on mount rather than through a media-query hook: there is no
  // useMediaQuery in this codebase, and reading during render would disagree
  // with the server and fail hydration.
  const [autoplay, setAutoplay] = useState(false);
  useEffect(() => {
    setAutoplay(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const go = useCallback(
    (next: number, direction: number) => setState([(next + len) % len, direction]),
    [len],
  );

  // `active` in the deps is deliberate, and inherited from the Doctors carousel:
  // any manual step tears the interval down and starts a fresh one, so a click
  // buys a full beat rather than landing mid-cycle.
  useEffect(() => {
    if (!autoplay || paused) return;
    const id = setInterval(() => setState(([a]) => [(a + 1) % len, 1]), DURATION);
    return () => clearInterval(id);
  }, [len, active, autoplay, paused]);

  // Pointer and focus both pause: reading a review should not have it slide away
  // mid-sentence, and a keyboard user tabbing into a card needs the same grace.
  const hoverRef = useRef(false);
  const focusRef = useRef(false);
  const settlePause = () => setPaused(hoverRef.current || focusRef.current);

  return (
    <div
      className="mt-8"
      onMouseEnter={() => {
        hoverRef.current = true;
        settlePause();
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
        settlePause();
      }}
      onFocusCapture={() => {
        focusRef.current = true;
        settlePause();
      }}
      onBlurCapture={() => {
        focusRef.current = false;
        settlePause();
      }}
    >
      {/* Three slots always render; slots 2 and 3 are hidden below md. That is
          what makes this 1-up on mobile and 3-up on desktop without a JS
          breakpoint — a matchMedia-in-state version would disagree with the
          prerendered HTML on first paint. */}
      <div
        className="grid gap-5 md:grid-cols-3"
        role="group"
        aria-roledescription="carousel"
        aria-label="Google reviews"
        // Only announce while rotation is stopped — hovered, focused, or reduced
        // motion. A live region that swaps itself every 5.5s reads the whole set
        // aloud on a loop, which is worse than silence.
        aria-live={autoplay && !paused ? "off" : "polite"}
      >
        {Array.from({ length: SLOTS }, (_, slot) => {
          const review = reviews[(active + slot) % len];

          return (
            <div key={slot} className={cn(slot > 0 && "hidden md:block")}>
              <AnimatePresence mode="wait" custom={dir}>
                <m.div
                  key={review.id}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  // Staggered by slot so the row resolves left to right rather
                  // than snapping as one block.
                  transition={{ duration: 0.55, ease: EASE, delay: slot * 0.06 }}
                  className="h-full"
                >
                  <figure className="flex h-full min-h-[16rem] flex-col rounded-2xl border border-border bg-card/90 p-6 shadow-soft backdrop-blur-sm sm:p-7">
                    <div className="flex items-center justify-between gap-4">
                      <Quote className="h-7 w-7 shrink-0 text-gold" aria-hidden="true" />
                      <span className="font-sans text-xs text-muted-foreground">{review.when}</span>
                    </div>
                    <blockquote className="mt-4 font-serif text-lg leading-relaxed text-foreground/90">
                      “{review.quote}”
                    </blockquote>
                    <figcaption className="mt-auto pt-6">
                      <Stars value={review.rating} className="mb-3" />
                      <p className="font-sans text-sm font-medium text-foreground">{review.name}</p>
                      <p className="font-sans text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        {review.treatment}
                      </p>
                    </figcaption>
                  </figure>
                </m.div>
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous review"
            onClick={() => go(active - 1, -1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next review"
            onClick={() => go(active + 1, 1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots. The visible pip is 8px, but the button around it is a full 44px
            tap target — the bar itself is only 2px tall on the Doctors carousel,
            which is below every touch guideline. */}
        <div className="flex items-center">
          {reviews.map((r, i) => (
            <button
              key={r.id}
              type="button"
              aria-label={`Review ${i + 1} of ${len}`}
              aria-current={i === active}
              onClick={() => go(i, i > active ? 1 : -1)}
              className="group inline-flex h-11 w-4 items-center justify-center focus-visible:outline-none sm:w-5"
            >
              <span
                className={cn(
                  "h-2 rounded-full transition-all duration-500 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2",
                  i === active ? "w-6 bg-gold" : "w-2 bg-foreground/20 group-hover:bg-foreground/40",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Thin timer bar. scaleX rather than width — same visual, no layout work
          per frame. Keyed on `active` so each rotation restarts the fill. */}
      <div className="mx-auto mt-5 h-px w-full max-w-xs overflow-hidden bg-border">
        {autoplay && !paused && (
          <m.div
            key={active}
            className="h-full origin-left bg-gold/80"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: DURATION / 1000, ease: "linear" }}
          />
        )}
      </div>
    </div>
  );
};
