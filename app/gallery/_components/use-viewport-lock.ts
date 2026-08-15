"use client";

import { useEffect } from "react";

/**
 * Neutralises the site's global Lenis smooth-scroller for the lifetime of the
 * gallery, without touching <SmoothScroll /> or the root layout.
 *
 * Lenis is mounted once in the root layout and cannot be unmounted from a
 * route, so the gallery has to fence it off from the outside. Two mechanisms,
 * because neither is sufficient alone:
 *
 *  1. `data-lenis-prevent` on the gallery surface (applied in the JSX, not
 *     here). In Lenis's `onVirtualScroll` the prevent check sits *above* the
 *     `isStopped` branch — and the `isStopped` branch still calls
 *     preventDefault. So stopping alone would leave Lenis swallowing the wheel
 *     events the grid needs.
 *  2. `stop()` here, which freezes the document scroller and puts
 *     `lenis-stopped` on <html>. globals.css already maps that to
 *     `overflow: hidden`, which removes the page scrollbar — and with it the
 *     site's custom ::-webkit-scrollbar styling — for free.
 *
 * `window.__lenis` is null when the visitor prefers reduced motion, hence the
 * optional calls. The grid's own `{ passive: false }` wheel handler covers that
 * path.
 */
export function useViewportLock() {
  useEffect(() => {
    // stop() snapshots the current scroll position; land at the top first so
    // returning to the site does not restore a mid-page offset.
    window.scrollTo(0, 0);
    window.__lenis?.stop();

    return () => {
      window.__lenis?.start();
    };
  }, []);
}
