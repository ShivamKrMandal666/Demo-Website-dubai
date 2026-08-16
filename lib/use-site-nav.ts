"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import type { NavLink } from "@/lib/data/site";
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
