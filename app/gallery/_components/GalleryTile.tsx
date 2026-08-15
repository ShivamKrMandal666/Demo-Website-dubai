"use client";

import Image from "next/image";
import { GridItem } from "./InfiniteDragScroll";
import type { GalleryImage } from "../_data/gallery-images";

// Uniform width, one height per orientation — 2:3 for portrait sources, 4:3 for
// landscape. Same width in both cases is what keeps the grid columns even and
// lets one `sizes` value serve every tile.
//
// The arbitrary heights are deliberate: Tailwind v3.4's spacing scale has no 27
// or 54 step, so 108px and 216px have to be written out.
const TILE_BOX: Record<GalleryImage["orientation"], string> = {
  portrait: "h-[13.5rem] w-36 md:h-96 md:w-64", // 144x216 / 256x384
  landscape: "h-[6.75rem] w-36 md:h-48 md:w-64", // 144x108 / 256x192
};

export function GalleryTile({ image, index }: { image: GalleryImage; index: number }) {
  return (
    <GridItem
      index={index}
      // `relative` is what `fill` positions against; the fixed size at both
      // breakpoints is what makes layout shift structurally impossible — the box
      // is the same whether the image has arrived or not. The dark fill shows
      // through until then, so an unloaded tile reads as negative space on the
      // dark surface rather than as a hole.
      className={`relative bg-[#1b1b1d] ${TILE_BOX[image.orientation]}`}
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
        // Both orientations share a width, so one value covers both. Resolves
        // to 256w / 384w / 640w in practice — under every source, so the
        // optimizer never upscales. AVIF then WebP, per next.config.ts.
        sizes="(min-width: 768px) 256px, 45vw"
        // No `priority`, ever: next/image emits the native loading="lazy"
        // attribute and no IntersectionObserver, so the tiles cost 0 observers
        // and the off-screen majority is never fetched. The four stamped copies
        // resolve to identical URLs, so the browser dedupes to 8 requests.
        className="pointer-events-none select-none object-cover"
        // Undefined falls through to the CSS default (50% 50%).
        style={{ objectPosition: image.focus }}
        draggable={false}
      />
    </GridItem>
  );
}
