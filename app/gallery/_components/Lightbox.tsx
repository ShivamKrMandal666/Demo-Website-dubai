"use client";

// ---------------------------------------------------------------------------
// Enlarged view for a single tile.
//
// Rendered as a child of the gallery surface, never portalled to document.body.
// The surface is `fixed inset-0 z-50`, which makes it its own stacking context:
// anything inside it paints above the site's .grain-overlay (z-index 41)
// automatically, and a portal would escape both that and the surface's
// `data-lenis-prevent` fence. Inside, z-[70] is only competing with
// BackToSite's z-[60].
//
// Lenis is already stopped for the whole route by useViewportLock, and the wheel
// is silenced by the pausedRef handed to DraggableContainer — so there is no
// scroll-locking left to do here.
// ---------------------------------------------------------------------------
import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { X } from "lucide-react";
import type { GalleryImage } from "../_data/gallery-images";

// The house curve and duration (context/ui-context.md), not the gallery's local
// EASE_OUT — that one belongs to the wheel glide.
const EASE = [0.22, 1, 0.36, 1] as const;

export function Lightbox({
  image,
  onClose,
}: {
  image: GalleryImage | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!image) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [image, onClose]);

  return (
    <AnimatePresence>
      {image && (
        <m.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
          // The backdrop is the dismiss target. The figure below stops
          // propagation, so only clicks that actually land outside it close.
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-espresso-deep/90 p-4 backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <m.figure
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-full w-full max-w-4xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-bone/15 bg-espresso-deep shadow-elegant">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                // The enlarged view is the one place the full frame is wanted,
                // so this is `contain`, not the tile's `cover` — no crop, and
                // the 3:2 box already matches seven of the eight sources.
                className="object-contain"
                sizes="(min-width: 1024px) 896px, 100vw"
                priority
                draggable={false}
              />
            </div>

            <figcaption className="mt-3 text-center font-sans text-xs text-bone/60">
              {image.alt}
            </figcaption>

            {/* Same shape as the Sheet's close control: icon, sr-only label,
                focus ring on the site's ring token. */}
            <button
              type="button"
              onClick={onClose}
              className="absolute -top-2 right-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-bone/25 bg-espresso-deep/80 text-bone/80 backdrop-blur-md transition-colors duration-300 hover:border-gold hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-espresso-deep sm:-right-2 sm:-top-4"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </m.figure>
        </m.div>
      )}
    </AnimatePresence>
  );
}
