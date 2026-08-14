import type Lenis from "lenis";

declare global {
  interface Window {
    /**
     * Set by <SmoothScroll /> in the root layout. Stays `null` when the user
     * prefers reduced motion — callers must handle the native fallback.
     */
    __lenis: Lenis | null;
  }
}

/** Height of the fixed header; scroll targets must clear it. */
const HEADER_OFFSET = 72;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Smoothly scroll to a section id / selector. Falls back to native scrolling
// when Lenis is absent (reduced motion, or before the layout effect runs).
export function scrollToId(target: string) {
  if (!target) return;
  // Honour the OS setting: instant jump instead of an animated scroll.
  const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";

  if (target === "#top" || target === "top") {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior });
    return;
  }

  const el = document.querySelector(target);
  if (!el) return;

  if (window.__lenis) {
    window.__lenis.scrollTo(el as HTMLElement, { offset: -HEADER_OFFSET, duration: 1.2 });
    return;
  }

  // Native fallback keeps the same header offset Lenis applies.
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior });
}
