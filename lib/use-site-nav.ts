"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { navLinks, type NavLink } from "@/lib/data/clinic";
import { scrollToId } from "@/lib/smooth-scroll";
import { startRouteProgress } from "@/lib/route-progress";

/**
 * Single navigation handler shared by Navbar and Footer.
 *
 * A NavLink carries both the route it lives on (`to`) and the section on that
 * route (`scroll`). If we are already on `to` we smooth-scroll in place;
 * otherwise we push the route with the section as a hash and let
 * <RouteTransition /> honour it on arrival.
 */
export function useSiteNav() {
  const pathname = usePathname();
  const router = useRouter();

  return useCallback(
    (link: NavLink) => {
      if (link.soon) {
        toast(`${link.label} is on its way`, {
          description: "This page is coming soon — check back shortly.",
        });
        return;
      }

      if (link.to === pathname) {
        scrollToId(link.scroll);
        return;
      }

      // This is a real navigation and nothing clicked an <a>, so the progress
      // bar has no other way to know it started. Announced before the push, so
      // the bar appears on the same frame as the click.
      startRouteProgress();

      // "#top" is the head of the page, which is where a fresh route lands
      // anyway — no hash needed.
      router.push(link.scroll === "#top" ? link.to : `${link.to}${link.scroll}`);
    },
    [pathname, router],
  );
}

// ---------------------------------------------------------------------------
// Prefetching for the nav.
//
// The nav navigates with `router.push` from <button>s, and `router.push` does
// NOT prefetch — unlike `next/link`, which prefetches automatically as soon as
// the link is in the viewport. Since the nav is always in the viewport, every
// nav destination on this site was being fetched only at click time, so the
// visitor waited on a round trip that next/link would already have finished.
// That is why the treatment cards and footer links (real <Link>s, 12 of them)
// have always felt faster than the five main nav items.
//
// The buttons stay buttons: they exist so RouteProgress can be told a
// navigation started (nothing clicks an <a>), and so a click on the route you
// are already on smooth-scrolls instead of navigating. This restores the one
// thing they were missing rather than undoing that.
// ---------------------------------------------------------------------------

/** Reachable nav destinations, deduped — the set next/link would have warmed. */
const PREFETCH_ROUTES = [...new Set(navLinks.filter((l) => !l.soon).map((l) => l.to))];

// Don't spend someone's metered or barely-working connection on pages they have
// not asked for. next/link does not check this; on a site whose whole problem is
// weak international links, it is worth checking.
const connectionIsTooWeak = () => {
  const c = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (!c) return false;
  return c.saveData === true || c.effectiveType === "slow-2g" || c.effectiveType === "2g";
};

/**
 * Warms every nav destination's RSC payload once the main thread goes idle, so
 * the next page is already in the router cache by the time it is clicked.
 *
 * Idle, not on mount: this is background work for a page the visitor has not
 * asked for yet, and it must never compete with the current route's own load.
 * Same `requestIdleCallback` + `setTimeout` fallback idiom Navbar already uses
 * to warm the mobile-menu chunk.
 *
 * Mount once per route — Navbar is the natural host, since it renders on every
 * route except /gallery and is where four of the five destinations are clicked.
 */
export function useNavPrefetch() {
  const router = useRouter();

  useEffect(() => {
    const warm = () => {
      if (connectionIsTooWeak()) return;
      for (const to of PREFETCH_ROUTES) router.prefetch(to);
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warm, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(warm, 2000);
    return () => window.clearTimeout(id);
  }, [router]);
}
