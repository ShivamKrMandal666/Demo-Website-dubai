"use client";

// ---------------------------------------------------------------------------
// The gallery's isolation shell.
//
// Every other route on this site renders <Navbar/> ... <MapSection/> <Footer/>
// inside the shared design system. This one renders none of it — it is a
// full-bleed surface, not a page. That still takes work, because the root
// layout wraps every route in globals that would otherwise leak in, and each is
// dealt with below.
//
// What it no longer does is style itself from scratch. The route used to hold
// its own palette in literal hex; it now paints in the same tokens as the rest
// of the site (espresso-deep, bone, gold), so the wall reads as this clinic's
// gallery rather than a different product.
// ---------------------------------------------------------------------------
import { useCallback, useRef, useState } from "react";
import { LazyMotion, domMax } from "motion/react";
import { DraggableContainer, GridBody } from "./InfiniteDragScroll";
import { GalleryTile } from "./GalleryTile";
import { BackToSite } from "./BackToSite";
import { Lightbox } from "./Lightbox";
import { useViewportLock } from "./use-viewport-lock";
import { galleryImages, type GalleryImage } from "../_data/gallery-images";

export function GalleryExperience() {
  useViewportLock();

  const [enlarged, setEnlarged] = useState<GalleryImage | null>(null);

  // Mirrored into a ref because the wheel handler inside DraggableContainer is
  // registered once and never re-reads component state.
  const enlargedRef = useRef(false);

  const open = useCallback((image: GalleryImage) => {
    enlargedRef.current = true;
    setEnlarged(image);
  }, []);

  const close = useCallback(() => {
    enlargedRef.current = false;
    setEnlarged(null);
  }, []);

  return (
    <div
      // Lenis bails out of any gesture whose composed path crosses this
      // element — see use-viewport-lock.ts for why the attribute and the
      // stop() call are both needed.
      data-lenis-prevent
      role="region"
      aria-label="Image gallery"
      // `fixed inset-0 z-50` is doing real work, not just filling the screen:
      //  - it paints above .grain-overlay (z-index 41), so the site's film
      //    grain does not tint this page. body { isolation: isolate } makes
      //    body the stacking context both live in, so the comparison holds,
      //    and a multiply layer never blends what is painted above it.
      //  - it covers body { bg-background }, so no warm bone shows through.
      // select-none suppresses the site's gold ::selection and stops text
      // selection fighting the drag; overscroll-none kills iOS rubber-band.
      //
      // `bg-espresso-deep` and `text-bone` are the site's darkest surface pair —
      // the same one the Doctors section and the footer sit on. The font stack
      // is simply inherited from body now; the route used to override it with a
      // literal mono stack to look like a different system.
      className="fixed inset-0 z-50 select-none overflow-hidden overscroll-none bg-espresso-deep text-bone"
    >
      {/*
        The root layout's provider is LazyMotion(domAnimation, strict), and
        domAnimation deliberately excludes the projection engine that `drag`
        needs. Nesting domMax fixes that: LazyMotion merges into a module-level
        feature registry during render, and domAnimation declares no drag/layout
        keys, so this augments rather than replaces — and the registration is
        live before the children below render.

        Note this registers drag + layout app-wide for the rest of the session
        once the gallery has mounted. Harmless (nothing else uses either), but
        it is why the win the root provider is chasing still holds: the domMax
        chunk is reachable only from this route's module graph, so it never
        lands in the bundle shared by the other pages.

        `m` rather than `motion` throughout, for the same reason — motion.* is
        what pulls the whole feature bundle in statically.
      */}
      <LazyMotion features={domMax}>
        <DraggableContainer variant="masonry" pausedRef={enlargedRef}>
          <GridBody>
            {galleryImages.map((image, index) => (
              <GalleryTile key={image.id} image={image} index={index} onOpen={open} />
            ))}
          </GridBody>
        </DraggableContainer>

        {/* Inside the domMax provider, which is already loaded for this route —
            AnimatePresence would work under domAnimation alone, but there is
            nothing to gain from rendering it outside. */}
        <Lightbox image={enlarged} onClose={close} />
      </LazyMotion>

      <BackToSite />
    </div>
  );
}
