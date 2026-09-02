"use client";

import { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// The first-load half of the top progress bar.
//
// RouteProgress cannot cover this window. It is a client component, so its bar
// only exists once React has hydrated — and hydration is precisely the thing a
// visitor on a weak connection is waiting through. That is the gap where the
// deployed link looked broken: several seconds of a page with no sign that
// anything was happening.
//
// This closes it without shipping work to the critical path. It is a client
// component, so it is server-rendered into the prerendered HTML like any other,
// and the bar it renders is animated by the `boot-progress` CSS keyframe — no
// script has to run for it to start moving. The only JavaScript here is the
// single effect that retires it.
//
// Handoff: on hydration this hides and RouteProgress lands its own bar at 100%
// (see the initial-load effect there). Hydration, not window.load, is the right
// moment — it is when the page actually becomes usable, and waiting for every
// image to decode would leave the bar crawling long after the site was ready.
// ---------------------------------------------------------------------------

// Matches FADE_MS in RouteProgress, so the two halves of the bar retire at the
// same rate.
const FADE_MS = 220;

export function BootProgress() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
      style={{
        opacity: hydrated ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
      }}
    >
      {/* Same element, same z-index, same --gold as RouteProgress's bar, so the
          two read as one continuous indicator rather than a swap. Transform
          only: it animates on the compositor and never forces layout while the
          main thread is busy parsing and hydrating, which is the entire window
          this thing exists for. */}
      <div className="h-full origin-left animate-boot-progress bg-gold" />
    </div>
  );
}
