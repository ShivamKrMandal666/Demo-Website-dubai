"use client";

// ---------------------------------------------------------------------------
// Infinite drag + wheel grid (21st.dev `infinite-drag-scroll`), ported for this
// route. Still route-local: nothing else on the site drags a surface, so there
// is no second consumer to justify promoting it into components/. Its *styling*
// is no longer local — tiles use the site's tokens like anywhere else.
//
// How the "infinite" surface works: GridBody stamps the same block of tiles into
// a grid of copies. Dragging moves x/y freely, and a change subscriber wraps each
// offset at exactly one block — which lands on a pixel-identical copy, so the
// seam is invisible and the surface never ends.
//
// COVERAGE INVARIANT: the copies left after the wrap must still fill the screen,
//   gridW - blockW >= viewportW   and   gridH - blockH >= viewportH
// or the far edge runs out mid-viewport and the visitor sees the page background.
// The published source hardcodes a 2x2 of copies, which silently assumes one
// block is at least as big as the screen. Ours is not: a mobile block is 800x358
// against an 812px-tall phone, so dragging up ran the wall out with ~450px to
// spare. The copy count is therefore derived from the measured block and the
// measured frame — see `measure()` below — never fixed.
//
// Note the column count is even on purpose: `even:mt-[60%]` staggers by DOM
// parity, so an even column count keeps the same columns offset on every row
// rather than alternating row by row.
//
// Deltas from the published source, all deliberate:
//  - `m` + a nested LazyMotion(domMax), because the root provider is
//    LazyMotion(domAnimation, strict) — see GalleryExperience.tsx.
//  - Tailwind v4 classes translated to v3.4 (`border-10` -> `border-[10px]`,
//    `h-54` -> `h-[13.5rem]`). The source's `rounded-sm` is gone entirely: tiles
//    now take the site's `rounded-2xl` card radius.
//  - The tile entrance is a CSS keyframe, not a Motion variant — the reason is
//    in gallery.module.css, and it is why GridItem is a plain div.
//  - cva calls hoisted out of render, `will-change` dropped from tiles,
//    ResizeObserver added, `isDragging` moved to a ref. Rationale at each site.
// ---------------------------------------------------------------------------
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { animate, cubicBezier, useMotionValue, wrap } from "motion/react";
import * as m from "motion/react-m";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import styles from "./gallery.module.css";
import { GALLERY_COLUMNS } from "../_data/gallery-images";

export type GridVariant = "default" | "masonry" | "polaroid";

const GridVariantContext = createContext<GridVariant | undefined>(undefined);

/**
 * Which of GridBody's four stamped copies a tile is rendering in.
 *
 * Copies 1-3 are `aria-hidden`, so anything focusable inside them is a
 * focusable element in a hidden subtree. Tiles are buttons now, which makes
 * that 24 of them — the copy index is how a tile knows to drop out of the tab
 * order. Defaults to 0 so a tile rendered outside GridBody stays reachable.
 */
const GridCopyContext = createContext(0);

export const useGridCopyIndex = () => useContext(GridCopyContext);

/**
 * How many copies of the block to stamp, in each axis. Owned by
 * DraggableContainer (which does the measuring) and read by GridBody (which does
 * the stamping) — they are separated by JSX written in GalleryExperience, so a
 * prop has nowhere to travel.
 *
 * Two is the floor, not the default: one copy per axis would leave nothing to
 * wrap onto.
 */
const GridCopiesContext = createContext({ cols: 2, rows: 2 });

const EASE_OUT = cubicBezier(0.18, 0.71, 0.11, 1);

// Hoisted to module scope. In the published source these are built inside
// GridItem/GridBody, which meant re-running cva on every tile of every copy on
// every render.
// `rounded-2xl` is the site's card radius, not the source's 2px. The masonry
// offset dropped from 60% to 30% along with the tile ratio: percentage margins
// resolve against the column *width*, so at a uniform 4:3 box a 60% offset left
// a void taller than the tile itself under every unoffset column.
const gridItemStyles = cva("h-full w-full overflow-hidden hover:cursor-pointer", {
  variants: {
    variant: {
      default: "rounded-2xl",
      masonry: "rounded-2xl even:mt-[30%]",
      polaroid:
        "border-[10px] border-b-[28px] border-white shadow-xl transition-transform duration-300 ease-out even:mt-[30%] even:rotate-3 odd:-rotate-2 hover:rotate-0",
    },
  },
  defaultVariants: { variant: "default" },
});

// INVARIANT: block padding is exactly half the gap — per axis.
//
// GridBody stamps four copies of this block into a 2x2 grid with no gap between
// them, so at every seam two half-gaps of padding meet and add up to one full
// gap. That is the whole illusion — break the ratio and the seam shows up as a
// band visibly wider or narrower than the interior gaps. The two axes are
// independent, so each only has to hold against itself:
//   x: gap-x-14(56) / px-7(28)   and md:gap-x-28(112) / md:px-14(56)
//   y: gap-y-7(28)  / py-3.5(14) and md:gap-y-14(56)  / md:py-7(28)
//
// The axes were equal while tiles were 216/384px tall. Normalising every tile to
// 4:3 halved that, and an unchanged 56px vertical gap left the wall reading as
// mostly empty ground — so the vertical rhythm halved with the tiles.
const gridBodyStyles = cva("grid h-fit w-fit items-start", {
  variants: {
    variant: {
      default: "gap-x-14 gap-y-7 px-7 py-3.5 md:gap-x-28 md:gap-y-14 md:px-14 md:py-7",
      masonry: "gap-x-14 gap-y-7 px-7 py-3.5 md:gap-x-28 md:gap-y-14 md:px-14 md:py-7",
      polaroid: "gap-x-14 gap-y-7 px-7 py-3.5 md:gap-x-28 md:gap-y-14 md:px-14 md:py-7",
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
  pausedRef,
}: {
  className?: string;
  children: ReactNode;
  variant?: GridVariant;
  /**
   * While this reads true the wheel is left alone. Passed as a ref rather than
   * a boolean because the handler is registered once, in an effect keyed on the
   * motion values — a prop would need the listener torn down and rebound on
   * every change.
   */
  pausedRef?: MutableRefObject<boolean>;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Refs, not state: both are read inside listeners that would otherwise be
  // torn down and re-registered on every pointer press.
  const draggingRef = useRef(false);
  const sizeRef = useRef({ blockW: 0, blockH: 0 });

  const [copies, setCopies] = useState({ cols: 2, rows: 2 });

  useEffect(() => {
    const el = ref.current;
    const frame = frameRef.current;
    if (!el || !frame) return;

    const measure = () => {
      // One block, not the whole grid. The wrap period is the block, and once
      // the copy count stopped being a constant the grid could no longer stand
      // in for it.
      const block = el.firstElementChild;
      if (!block) return;
      const { width: blockW, height: blockH } = block.getBoundingClientRect();
      if (blockW <= 0 || blockH <= 0) return;
      sizeRef.current = { blockW, blockH };

      // Provision against the LARGEST viewport the frame can reach, not the
      // current one. The frame is `h-dvh`, so a mobile address bar retracting
      // grows it mid-gesture — measuring at the small end would hand back
      // exactly the slack that keeps the far edge off screen.
      const vw = Math.max(frame.clientWidth, window.innerWidth);
      const vh = Math.max(frame.clientHeight, window.innerHeight);

      // `+ 1` is the copy the wrap consumes: at the extreme one whole block has
      // been scrolled past, so coverage comes from the remainder. Anything less
      // is the bug this replaced; anything more is wasted DOM.
      const cols = Math.max(2, Math.ceil(vw / blockW) + 1);
      const rows = Math.max(2, Math.ceil(vh / blockH) + 1);

      setCopies((prev) => (prev.cols === cols && prev.rows === rows ? prev : { cols, rows }));
    };
    measure();

    // The published source measures once. Tile dimensions change at the `md:`
    // breakpoint, so a stale measurement makes the wrap point drift off the
    // copy boundary and the seam becomes visible. Translating the element does
    // not change its measured width/height, so re-measuring mid-drag is safe.
    //
    // Both boxes matter now: the grid for the block size, the frame for how much
    // screen has to be covered.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    observer.observe(frame);

    // Wrapping at one block lands on an identical copy of the same tile.
    const unsubscribeX = x.on("change", (latest) => {
      const { blockW } = sizeRef.current;
      if (blockW > 0) x.set(wrap(-blockW, 0, latest));
    });
    const unsubscribeY = y.on("change", (latest) => {
      const { blockH } = sizeRef.current;
      if (blockH > 0) y.set(wrap(-blockH, 0, latest));
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
      // Still preventDefault above while the lightbox is open — the page behind
      // must not scroll — but do not move the wall under it.
      if (pausedRef?.current) return;

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
  }, [x, y, pausedRef]);

  return (
    <GridVariantContext.Provider value={variant}>
      <GridCopiesContext.Provider value={copies}>
        <div ref={frameRef} className="h-dvh overflow-hidden overscroll-none">
        <m.div
          ref={ref}
          className={cn(
            "grid h-fit w-fit cursor-grab will-change-transform active:cursor-grabbing",
            className,
          )}
          // Bare `1fr`, NOT Tailwind's `grid-cols-*`. That shorthand compiles to
          // `repeat(n, minmax(0, 1fr))`, whose 0 floor lets the columns collapse
          // below their content — and inside a `w-fit` container there is no
          // outer width to resolve the fraction against, so the whole grid
          // crushes and the tiles overlap. Bare `1fr` means `minmax(auto, 1fr)`,
          // which holds at min-content. Inline because the count is measured.
          style={{ x, y, gridTemplateColumns: `repeat(${copies.cols}, 1fr)` }}
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
        >
          {children}
        </m.div>
        </div>
      </GridCopiesContext.Provider>
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
      className={cn(styles.tile, gridItemStyles({ variant, className }))}
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
  // How many copies it takes to cover this screen — measured, not assumed. See
  // the coverage invariant at the top of the file.
  const { cols, rows } = useContext(GridCopiesContext);

  return (
    <>
      {Array.from({ length: cols * rows }).map((_, index) => (
        <div
          key={index}
          // Only the first copy is announced; the rest are the same images
          // again, so a screen reader hears the set once rather than once per
          // copy.
          aria-hidden={index > 0}
          className={cn(gridBodyStyles({ variant, className }))}
          // Bare `1fr`, for the same reason as the container above: a
          // `minmax(0, ...)` floor would let these columns collapse under the
          // tiles inside a `w-fit` grid.
          style={{ gridTemplateColumns: `repeat(${GALLERY_COLUMNS}, 1fr)` }}
        >
          {/* The copy index reaches the tiles through context rather than by
              cloning children — the same element tree is rendered in every copy,
              so there is nothing per-copy to pass a prop to. */}
          <GridCopyContext.Provider value={index}>{children}</GridCopyContext.Provider>
        </div>
      ))}
    </>
  );
});
