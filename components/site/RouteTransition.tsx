"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToId } from "@/lib/smooth-scroll";

/**
 * Replaces the react-router `ScrollToTop` dropped in the migration, and is
 * Lenis-aware: Lenis keeps its own scroll position, so a plain
 * `window.scrollTo` would leave the instance out of sync and the next wheel
 * event would jump back.
 *
 * On every route change: land at the top, unless the URL carries a hash — in
 * which case scroll to that section instead (this is how cross-page nav links
 * from `useSiteNav` reach their target).
 *
 * Mounted ONCE in the root layout.
 */
export function RouteTransition() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      // Wait a frame so the incoming route has painted and the target exists.
      const id = requestAnimationFrame(() => scrollToId(hash));
      return () => cancelAnimationFrame(id);
    }

    // `immediate` skips the easing — a route change should feel instant, not
    // like a 1.2s scroll through a page the visitor never saw.
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
