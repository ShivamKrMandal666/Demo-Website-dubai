"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * The only affordance on this page besides the grid itself. Fixed, so it stays
 * reachable no matter how far the visitor has dragged.
 *
 * Not components/ui/button.tsx — it is a link, and `next/link` buys a real <a>:
 * keyboard focus, middle-click, "open in new tab", and a prefetched home route
 * so leaving is instant. The palette is the site's, though: bone on
 * espresso-deep with a gold hover, the same pairing the footer and the Doctors
 * section use.
 */
export function BackToSite() {
  return (
    <Link
      href="/"
      className="group fixed left-5 top-5 z-[60] inline-flex items-center gap-2.5 rounded-full border border-bone/25 bg-espresso-deep/80 py-2.5 pl-3 pr-4 font-sans text-[0.68rem] uppercase tracking-[0.22em] text-bone/80 backdrop-blur-md transition-colors duration-300 hover:border-gold hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-espresso-deep md:left-8 md:top-8"
    >
      <ArrowLeft
        aria-hidden="true"
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
      />
      Back to site
    </Link>
  );
}
