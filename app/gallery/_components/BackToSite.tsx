"use client";

import Link from "next/link";

/**
 * The only affordance on this page besides the grid itself. Fixed, so it stays
 * reachable no matter how far the visitor has dragged.
 *
 * Deliberately not components/ui/button.tsx and deliberately not a single site
 * token — every value here is literal. `next/link` is a framework primitive
 * rather than a site component, and it buys a real <a>: keyboard focus,
 * middle-click, "open in new tab", and a prefetched home route so leaving is
 * instant.
 */
export function BackToSite() {
  return (
    <Link
      href="/"
      className="group fixed left-5 top-5 z-[60] inline-flex items-center gap-2.5 rounded-full border border-[#3a3a3e] bg-[#141416]/80 py-2.5 pl-3 pr-4 text-[0.68rem] uppercase tracking-[0.22em] text-[#c9c6c0] backdrop-blur-md transition-colors duration-300 hover:border-[#6f6b63] hover:text-[#f2efe9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a857c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0c] md:left-8 md:top-8"
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
      >
        <path d="M10 2.5 4.5 8l5.5 5.5" />
      </svg>
      Back to site
    </Link>
  );
}
