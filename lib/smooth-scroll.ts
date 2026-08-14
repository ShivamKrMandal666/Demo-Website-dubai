import type Lenis from "lenis";

declare global {
  interface Window {
    /** Set by <SmoothScroll /> in the root layout. */
    __lenis: Lenis | null;
  }
}

// Smoothly scroll to a section id / selector. Falls back to native.
export function scrollToId(target?: string) {
  if (!target) return;
  if (target === "#top" || target === "top") {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.querySelector(target);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el as HTMLElement, { offset: -72, duration: 1.2 });
  else el.scrollIntoView({ behavior: "smooth" });
}
