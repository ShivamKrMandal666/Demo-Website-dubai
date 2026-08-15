// ---------------------------------------------------------------------------
// The gallery's tile manifest — a hand-picked edit, not the whole library.
//
// This started as "every image in the codebase" and that was the wrong shape
// for a gallery. Four of the backgrounds (texture-about / -treatments /
// -testimonial / -footer) are flat swatches of plaster, linen, marble and a
// dark wall: correct as section backdrops, blank rectangles as gallery tiles.
// The doctor portraits are cold clinical-blue stock that clashes with the warm
// dark set, and three of the five carry another person's name or a copyright
// watermark — see the open question in context/progress-tracker.md.
//
// What is left is eight frames that share a palette and each have a subject.
// Paths still come from lib/images.ts rather than being inlined, per AGENTS.md.
//
// Gallery-local by design: nothing under app/gallery/ is exported upward.
// ---------------------------------------------------------------------------
import type { StaticImageData } from "next/image";
import { backgrounds, treatmentCardImage, treatmentHeroImage } from "@/lib/images";

export interface GalleryImage {
  /** Stable React key. */
  id: string;
  src: StaticImageData;
  alt: string;
  /**
   * Which tile box this image gets. Sources are 1:1 (cards), 3:2 (heroes and
   * backgrounds) or 4:5 (portraits); forcing all of them into one portrait
   * tile cropped ~55% off the landscapes and turned wide interiors into
   * unreadable vertical strips. Two ratios keeps each frame close to how it
   * was shot. See GalleryTile.tsx for the boxes.
   */
  orientation: "portrait" | "landscape";
  /**
   * `object-position` for the crop. Only set where the subject sits away from
   * centre and the crop is deep enough to lose it — everything else is fine on
   * the default.
   */
  focus?: string;
}

/**
 * Columns in the drag grid. Kept **even** on purpose: `even:mt-[60%]` staggers
 * tiles by DOM parity, so an even column count offsets the same columns on
 * every row instead of alternating row to row.
 *
 * Eight tiles over four columns is exactly two rows — no partial row, so no
 * rectangular hole repeating forever through the tiled grid.
 */
export const GALLERY_COLUMNS = 4;

// Laid out below the way it renders: two rows of four.
//
// Order is load-bearing, and not just for looks. Positions 2, 4, 6 and 8 land
// in columns 2 and 4 and are the ones that take the 60% vertical offset, so
// **every landscape sits in an even position and every portrait in an odd one**.
// That is deliberate: a grid row is as tall as its tallest item, so offsetting
// the 384px portraits instead would push their rows to 538px and leave a ~350px
// void under each 192px landscape. Offsetting the short tiles keeps every row
// at 384px and the whole grid even.
//
// The side effect is a consistent ratio per column — portrait in 1 and 3,
// landscape in 2 and 4 — which reads as a designed rhythm rather than an
// accident. Subjects are mixed down each column so no column repeats a motif.
export const galleryImages: GalleryImage[] = [
  // -- row 1 -----------------------------------------------------------------
  {
    id: "marble-bust",
    src: treatmentCardImage("facial-contouring-jawline"),
    alt: "Marble bust in profile against draped fabric",
    orientation: "portrait",
  },
  {
    id: "treatment-room",
    src: backgrounds.hero2,
    alt: "Treatment room at golden hour, linen bed and terracotta walls",
    orientation: "landscape",
  },
  {
    id: "serums",
    src: backgrounds.hero3,
    alt: "Serum and oil bottles with sage leaves on a travertine slab",
    orientation: "portrait",
    // Centres the bottle group, which sits a little right of frame centre.
    focus: "55% 50%",
  },
  {
    id: "corridor-arch",
    src: treatmentHeroImage("thread-lifts"),
    alt: "Travertine corridor with a lit archway at the far end",
    orientation: "landscape",
  },

  // -- row 2 -----------------------------------------------------------------
  {
    id: "dropper",
    src: treatmentHeroImage("chemical-peels"),
    alt: "Amber dropper releasing a drop into a vial on black slate",
    orientation: "portrait",
    // Holds the dropper and the falling drop in frame.
    focus: "63% 50%",
  },
  {
    id: "spa-pool",
    src: treatmentHeroImage("regenerative-aesthetics"),
    alt: "Dark spa with a plunge pool, rising steam and an apothecary shelf",
    orientation: "landscape",
  },
  {
    id: "marble-statue",
    src: treatmentHeroImage("facial-contouring-jawline"),
    alt: "Standing marble statue on a console in a dark panelled room",
    orientation: "portrait",
    // The statue stands right of centre; a centred crop would clip it.
    focus: "58% 50%",
  },
  {
    id: "laser-suite",
    src: treatmentHeroImage("laser-skin-resurfacing"),
    alt: "Laser treatment suite lit low, with a black leather couch",
    orientation: "landscape",
  },
];
