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
   * `object-position` for the crop. Only set where the subject sits away from
   * centre and the crop is deep enough to lose it — everything else is fine on
   * the default.
   *
   * Under the uniform 4:3 tile that is now a single image. Seven of the eight
   * sources are 3:2, which loses only ~11% of its width to a 4:3 box — not
   * enough to move a subject out of frame, so the three horizontal nudges the
   * old 2:3 portrait tile needed are gone. The square source is the exception:
   * see `marble-bust` below.
   */
  focus?: string;
}

/**
 * Columns in the drag grid. Kept **even** on purpose: the masonry offset
 * staggers tiles by DOM parity, so an even column count offsets the same
 * columns on every row instead of alternating row to row.
 *
 * Eight tiles over four columns is exactly two rows — no partial row, so no
 * rectangular hole repeating forever through the tiled grid.
 */
export const GALLERY_COLUMNS = 4;

// Laid out below the way it renders: two rows of four.
//
// Order used to be load-bearing for layout — every landscape sat in an even
// position so the short tiles took the vertical offset and no row was left with
// a void under it. Every tile is the same 4:3 box now, so that constraint is
// gone and the order is purely editorial: subjects are mixed down each column
// so no column repeats a motif.
export const galleryImages: GalleryImage[] = [
  // -- row 1 -----------------------------------------------------------------
  {
    id: "marble-bust",
    src: treatmentCardImage("facial-contouring-jawline"),
    alt: "Marble bust in profile against draped fabric",
    // The one square source, so this is the one deep crop left: a 4:3 box takes
    // 25% off its height. The head runs to the top edge of the frame and the
    // pedestal fills the bottom, so the crop is biased upward — centred would
    // shave the hair to save a plinth.
    focus: "50% 20%",
  },
  {
    id: "treatment-room",
    src: backgrounds.hero2,
    alt: "Treatment room at golden hour, linen bed and terracotta walls",
  },
  {
    id: "serums",
    src: backgrounds.hero3,
    alt: "Serum and oil bottles with sage leaves on a travertine slab",
  },
  {
    id: "corridor-arch",
    src: treatmentHeroImage("thread-lifts"),
    alt: "Travertine corridor with a lit archway at the far end",
  },

  // -- row 2 -----------------------------------------------------------------
  {
    id: "dropper",
    src: treatmentHeroImage("chemical-peels"),
    alt: "Amber dropper releasing a drop into a vial on black slate",
  },
  {
    id: "spa-pool",
    src: treatmentHeroImage("regenerative-aesthetics"),
    alt: "Dark spa with a plunge pool, rising steam and an apothecary shelf",
  },
  {
    id: "marble-statue",
    src: treatmentHeroImage("facial-contouring-jawline"),
    alt: "Standing marble statue on a console in a dark panelled room",
  },
  {
    id: "laser-suite",
    src: treatmentHeroImage("laser-skin-resurfacing"),
    alt: "Laser treatment suite lit low, with a black leather couch",
  },
];
