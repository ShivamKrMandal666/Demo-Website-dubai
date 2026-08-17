"use client";

import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { GridItem, useGridCopyIndex } from "./InfiniteDragScroll";
import type { GalleryImage } from "../_data/gallery-images";

// One box for every tile. The wall used to run two ratios — a 2:3 portrait and a
// 4:3 landscape — because seven of the eight sources are 3:2 and a portrait tile
// threw away ~55% of their width. 4:3 is the ratio that keeps the grid uniform
// *and* crops least: it takes ~11% off a 3:2 source.
//
// The arbitrary height is deliberate: Tailwind v3.4's spacing scale has no 27
// step, so 108px has to be written out.
const TILE_BOX = "h-[6.75rem] w-36 md:h-48 md:w-64"; // 144x108 / 256x192

// A click fires at the end of every drag, so the tile has to tell the two apart
// itself. Motion's onDragEnd runs on pointerup — before the browser's click —
// so a shared "is dragging" flag is already false by the time this would read
// it. Pointer travel is the honest signal. 6px is roughly the platform slop for
// a tap.
const DRAG_SLOP_PX = 6;

export function GalleryTile({
  image,
  index,
  onOpen,
}: {
  image: GalleryImage;
  index: number;
  onOpen: (image: GalleryImage) => void;
}) {
  const copy = useGridCopyIndex();
  const downAt = useRef<{ x: number; y: number } | null>(null);

  return (
    <GridItem
      index={index}
      // `relative` is what `fill` positions against; the fixed size at both
      // breakpoints is what makes layout shift structurally impossible — the box
      // is the same whether the image has arrived or not. The dark fill shows
      // through until then, so an unloaded tile reads as negative space on the
      // dark surface rather than as a hole.
      className={cn("relative bg-espresso-deep/60", TILE_BOX)}
    >
      <button
        type="button"
        // Copies 1-3 live in `aria-hidden` subtrees; keeping them focusable
        // would put 24 unreachable-by-design buttons in the tab order.
        tabIndex={copy > 0 ? -1 : 0}
        aria-label={`View larger: ${image.alt}`}
        onPointerDown={(e) => {
          downAt.current = { x: e.clientX, y: e.clientY };
        }}
        onClick={(e) => {
          const from = downAt.current;
          downAt.current = null;
          // Keyboard activation reports 0,0 and no pointerdown ran — let it through.
          if (from && e.detail > 0) {
            const moved = Math.hypot(e.clientX - from.x, e.clientY - from.y);
            if (moved > DRAG_SLOP_PX) return;
          }
          onOpen(image);
        }}
        className="absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          // Mandatory with `fill` — omit it and next/image silently assumes
          // 100vw and fetches a 1080w candidate for a 256px tile. 45vw is the
          // w-36 tile at a 320px viewport; expressing the mobile half in vw also
          // lets next/image prune the srcset from 14 candidates to 8.
          //
          // Unchanged by the ratio normalisation: both old boxes already shared
          // this width, and the new one keeps it. Resolves to 256w / 384w / 640w
          // in practice — under every source, so the optimizer never upscales.
          // AVIF then WebP, per next.config.ts.
          sizes="(min-width: 768px) 256px, 45vw"
          // No `priority`, ever: next/image emits the native loading="lazy"
          // attribute and no IntersectionObserver, so the tiles cost 0 observers
          // and the off-screen majority is never fetched. The four stamped copies
          // resolve to identical URLs, so the browser dedupes to 8 requests.
          //
          // This is also why the tile is not on MediaImage like the rest of the
          // site: 32 tiles would mean 32 observers and 32 blur layers composited
          // over a surface that is being dragged.
          className="pointer-events-none select-none object-cover"
          // Undefined falls through to the CSS default (50% 50%).
          style={{ objectPosition: image.focus }}
          draggable={false}
        />
      </button>
    </GridItem>
  );
}
