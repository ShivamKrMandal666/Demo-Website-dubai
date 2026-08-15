"use client";

// ---------------------------------------------------------------------------
// Infinite drag + wheel grid (21st.dev `infinite-drag-scroll`), ported for this
// route. Route-local by design — see cx.ts for why nothing here lives in
// components/ui.
//
// How the "infinite" surface works: GridBody stamps the same block of tiles
// four times into a 2-column grid, so the rendered content is exactly twice the
// block in each axis. Dragging moves x/y freely, and a change subscriber wraps
// each offset at half the container size — which lands on a pixel-identical
// copy, so the seam is invisible and the surface never ends.
//
// Note the column count is even on purpose: `even:mt-[60%]` staggers by DOM
// parity, so an even column count keeps the same columns offset on every row
// rather than alternating row by row.
//
// Deltas from the published source, all deliberate:
//  - `m` + a nested LazyMotion(domMax), because the root provider is
//    LazyMotion(domAnimation, strict) — see GalleryExperience.tsx.
//  - Tailwind v4 classes translated to v3.4 (`border-10` -> `border-[10px]`,
//    `h-54` -> `h-[13.5rem]`, `rounded-sm` -> `rounded-[2px]`; `rounded-sm` is
//    a site token here, not a 2px radius).
//  - The tile entrance is a CSS keyframe, not a Motion variant — the reason is
//    in gallery.module.css, and it is why GridItem is a plain div.
//  - cva calls hoisted out of render, `will-change` dropped from tiles,
//    ResizeObserver added, `isDragging` moved to a ref. Rationale at each site.
// ---------------------------------------------------------------------------
import { createContext, memo, useContext, useEffect, useRef, type ReactNode } from "react";
import { animate, cubicBezier, useMotionValue, wrap } from "motion/react";
import * as m from "motion/react-m";
import { cva } from "class-variance-authority";
import { cx } from "./cx";
import styles from "./gallery.module.css";
import { GALLERY_COLUMNS } from "../_data/gallery-images";

export type GridVariant = "default" | "masonry" | "polaroid";

const GridVariantContext = createContext<GridVariant | undefined>(undefined);

const EASE_OUT = cubicBezier(0.18, 0.71, 0.11, 1);

// Hoisted to module scope. In the published source these are built inside
// GridItem/GridBody, which meant re-running cva on every tile of every copy on
// every render.
const gridItemStyles = cva("h-full w-full overflow-hidden hover:cursor-pointer", {
  variants: {
    variant: {
      default: "rounded-[2px]",
      masonry: "rounded-[2px] even:mt-[60%]",
      polaroid:
        "border-[10px] border-b-[28px] border-white shadow-xl transition-transform duration-300 ease-out even:mt-[60%] even:rotate-3 odd:-rotate-2 hover:rotate-0",
    },
  },
  defaultVariants: { variant: "default" },
});

// INVARIANT: block padding is exactly half the gap.
//
// GridBody stamps four copies of this block into a 2x2 grid with no gap between
// them, so at every seam two half-gaps of padding meet and add up to one full
// gap. That is the whole illusion — break the ratio and the seam shows up as a
// band visibly wider or narrower than the interior gaps. gap-14(56px)/p-7(28px)
// and md:gap-28(112px)/md:p-14(56px) both hold.
//
// `masonry` shipped as `gap-x-* px-*` — horizontal only, no vertical gap and no
// vertical padding — which is why rows were touching. It gets the same
// both-axis treatment as `default`; the variant's actual difference is the
// `even:mt-[60%]` offset on the item, not the gutters.
const gridBodyStyles = cva("grid h-fit w-fit items-start", {
  variants: {
    variant: {
      default: "gap-14 p-7 md:gap-28 md:p-14",
      masonry: "gap-14 p-7 md:gap-28 md:p-14",
      polaroid: "gap-14 p-7 md:gap-28 md:p-14",
    },
  },
  defaultVariants: { variant: "default" },
});

// Entrance stagger: settle column by column, rather than the source's
// `delay: Math.random() + 1.5`. Deterministic so the server and client agree,
// and short enough that nothing is held back noticeably. The animation itself
// is CSS — see gallery.module.css for why it is not a Motion variant.
const staggerDelay = (index: number) => `${(index % GALLERY_COLUMNS) * 0.05}s`;

export function DraggableContainer({
  className,
  children,
  variant,
}: {
  className?: string;
  children: ReactNode;
  variant?: GridVariant;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Refs, not state: both are read inside listeners that would otherwise be
  // torn down and re-registered on every pointer press.
  const draggingRef = useRef(false);
  const sizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      sizeRef.current = { width, height };
    };
    measure();

    // The published source measures once. Tile dimensions change at the `md:`
    // breakpoint, so a stale measurement makes the wrap point drift off the
    // copy boundary and the seam becomes visible. Translating the element does
    // not change its measured width/height, so re-measuring mid-drag is safe.
    const observer = new ResizeObserver(measure);
    observer.observe(el);

    // Wrapping at half the grid lands on an identical copy of the same tile.
    const unsubscribeX = x.on("change", (latest) => {
      const { width } = sizeRef.current;
      if (width > 0) x.set(wrap(-(width / 2), 0, latest));
    });
    const unsubscribeY = y.on("change", (latest) => {
      const { height } = sizeRef.current;
      if (height > 0) y.set(wrap(-(height / 2), 0, latest));
    });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleWheel = (event: WheelEvent) => {
      // Registered `{ passive: false }` so this preventDefault actually binds.
      // The gallery owns the whole viewport: nothing behind it should scroll or
      // rubber-band. Lenis is separately stopped and fenced off with
      // `data-lenis-prevent`, but this also covers the reduced-motion path
      // where Lenis is never constructed at all.
      event.preventDefault();
      if (draggingRef.current) return;

      const target = y.get() - event.deltaY * 2.7;

      // Reduced motion still needs to reach the rest of the grid — it just gets
      // there without the 1.2s glide.
      if (reduceMotion.matches) {
        y.set(target);
        return;
      }

      animate(y, target, { type: "tween", duration: 1.2, ease: EASE_OUT });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      observer.disconnect();
      unsubscribeX();
      unsubscribeY();
      window.removeEventListener("wheel", handleWheel);
    };
  }, [x, y]);

  return (
    <GridVariantContext.Provider value={variant}>
      <div className="h-dvh overflow-hidden overscroll-none">
        <m.div
          ref={ref}
          className={cx(
            // `grid-cols-[repeat(2,1fr)]`, NOT Tailwind's `grid-cols-2`. That
            // shorthand compiles to `repeat(2, minmax(0, 1fr))`, whose 0 floor
            // lets the columns collapse below their content — and inside a
            // `w-fit` container there is no outer width to resolve the fraction
            // against, so the whole grid crushes and the tiles overlap. Bare
            // `1fr` means `minmax(auto, 1fr)`, which holds at min-content.
            "grid h-fit w-fit cursor-grab grid-cols-[repeat(2,1fr)] will-change-transform active:cursor-grabbing",
            className,
          )}
          drag
          dragMomentum
          dragTransition={{
            timeConstant: 200,
            power: 0.28,
            restDelta: 0,
            bounceStiffness: 0,
          }}
          // Drag callbacks rather than the source's onMouseDown/Up/Leave, which
          // never fire on touch — there the wheel handler stayed live mid-drag.
          onDragStart={() => {
            draggingRef.current = true;
          }}
          onDragEnd={() => {
            draggingRef.current = false;
          }}
          style={{ x, y }}
        >
          {children}
        </m.div>
      </div>
    </GridVariantContext.Provider>
  );
}

export function GridItem({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Position in the tile list — drives the staggered entrance. */
  index?: number;
}) {
  const variant = useContext(GridVariantContext);

  return (
    // A plain div, not m.div. The tile only ever animated on entrance, and that
    // is CSS now — so this keeps a Motion visual element per tile out of
    // hydration, and the drag transform stays where it belongs, on the one
    // container that actually moves.
    //
    // No `will-change-transform` here either, unlike the source: one promoted
    // compositor layer per tile, times four copies, is a real GPU memory
    // problem on mobile.
    <div
      className={cx(styles.tile, gridItemStyles({ variant, className }))}
      style={{ animationDelay: staggerDelay(index) }}
    >
      {children}
    </div>
  );
}

// Named function expression, not an anonymous arrow: `react/display-name` is an
// error under next/core-web-vitals, and this satisfies it without the trailing
// `GridBody.displayName = ...` assignment the source needs.
export const GridBody = memo(function GridBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const variant = useContext(GridVariantContext);

  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          // Only the first copy is announced; the other three are the same
          // images again, so a screen reader hears the set once, not 4x.
          aria-hidden={index > 0}
          className={cx(gridBodyStyles({ variant, className }))}
          // Bare `1fr`, for the same reason as the container above: a
          // `minmax(0, ...)` floor would let these columns collapse under the
          // tiles inside a `w-fit` grid.
          style={{ gridTemplateColumns: `repeat(${GALLERY_COLUMNS}, 1fr)` }}
        >
          {children}
        </div>
      ))}
    </>
  );
});
