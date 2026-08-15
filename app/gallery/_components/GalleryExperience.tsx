"use client";

// ---------------------------------------------------------------------------
// The gallery's isolation shell.
//
// Every other route on this site renders <Navbar/> ... <MapSection/> <Footer/>
// inside the shared design system. This one renders none of it, on purpose —
// it is meant to read as a different product. That takes more than just not
// importing the components, because the root layout wraps every route in
// globals that would otherwise leak in. Each is dealt with below.
// ---------------------------------------------------------------------------
import { LazyMotion, domMax } from "motion/react";
import { DraggableContainer, GridBody } from "./InfiniteDragScroll";
import { GalleryTile } from "./GalleryTile";
import { BackToSite } from "./BackToSite";
import { useViewportLock } from "./use-viewport-lock";
import { galleryImages } from "../_data/gallery-images";

export function GalleryExperience() {
  useViewportLock();

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
      className="fixed inset-0 z-50 select-none overflow-hidden overscroll-none bg-[#0b0b0c]"
      // Inline, because `color` and `font-family` are inherited from the body
      // base rules in globals.css and both resolve to design tokens. Setting
      // them here overrides the inheritance with literal values — a mono stack
      // reads as a different design system on sight, which is the point.
      style={{
        color: "#e9e6e0",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
      }}
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
        <DraggableContainer variant="masonry">
          <GridBody>
            {galleryImages.map((image, index) => (
              <GalleryTile key={image.id} image={image} index={index} />
            ))}
          </GridBody>
        </DraggableContainer>
      </LazyMotion>

      <BackToSite />
    </div>
  );
}
