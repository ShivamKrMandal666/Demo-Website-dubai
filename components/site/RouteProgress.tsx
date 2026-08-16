"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { onRouteProgressStart } from "@/lib/route-progress";

// ---------------------------------------------------------------------------
// A thin progress bar across the top of the viewport, on initial load and on
// every route change.
//
// Hand-rolled rather than NProgress / nextjs-toploader: those ship 4-6 kB into
// every route's First Load JS (a budget this repo tracks) and inject their own
// stylesheet with hardcoded colours that would then need overriding to reach
// the palette. This is the same behaviour in ~1 kB, styled from --gold.
//
// The progress is simulated, not measured. There is nothing real to measure —
// a client-side route change is an RSC payload fetch of unknown length — and a
// bar that eases toward a ceiling reads as "working" far better than one that
// jumps between two real checkpoints.
// ---------------------------------------------------------------------------

// Where the simulated ramp stalls until the navigation actually resolves. Past
// ~80% a bar that is still moving starts to look like it is lying.
const CEILING = 0.8;
// Per-frame approach rate toward CEILING. Applied to the remaining distance, so
// the bar is quick off the mark and decelerates on its own — no easing curve,
// no bounce, and it can never overshoot.
const APPROACH = 0.035;
// How long the finished bar stays at 100% before fading, and how long the fade
// runs. Both short enough to feel like an acknowledgement, not a step.
const HOLD_MS = 120;
const FADE_MS = 220;
// Failsafe. If a navigation never resolves to a new pathname — a push that
// errors, a route that redirects back to itself — the bar must not sit at the
// ceiling forever. Long enough never to cut a real navigation short.
const MAX_MS = 10000;

export function RouteProgress() {
  const pathname = usePathname();
  const [value, setValue] = useState(0);
  const [visible, setVisible] = useState(false);

  const frame = useRef<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  // The pathname `value` is currently ramping toward. Set at start, compared on
  // pathname change — an <a> back to the page we are already on never resolves
  // to a new pathname, so without this the bar would hang at the ceiling.
  const from = useRef<string | null>(null);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const after = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const stopRamp = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };

  const finish = useCallback(() => {
    stopRamp();
    clearTimers();
    from.current = null;
    setValue(1);
    after(HOLD_MS, () => setVisible(false));
    // Reset only once the fade has finished, so the bar never snaps back to
    // zero while it is still on screen.
    after(HOLD_MS + FADE_MS, () => setValue(0));
  }, []);

  const start = useCallback(() => {
    if (frame.current !== null) return; // already ramping
    clearTimers();
    if (from.current === null) from.current = window.location.pathname;
    setValue(0);
    setVisible(true);
    const step = () => {
      setValue((v) => v + (CEILING - v) * APPROACH);
      frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    after(MAX_MS, () => finish());
  }, [finish]);

  // -- initial site load ----------------------------------------------------
  // This component only mounts at hydration, by which point the document has
  // usually loaded. Complete immediately in that case rather than inventing a
  // ramp for something already finished.
  useEffect(() => {
    if (document.readyState === "complete") {
      setVisible(true);
      finish();
      return;
    }
    start();
    const done = () => finish();
    window.addEventListener("load", done);
    return () => window.removeEventListener("load", done);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -- route changes --------------------------------------------------------
  // Started from the click rather than from a router event: App Router exposes
  // none, and starting at the click is also when the wait actually begins.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page, different hash: an in-page scroll, not a navigation.
      if (url.pathname === window.location.pathname) return;

      from.current = window.location.pathname;
      start();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [start]);

  // Navbar and Footer navigate with router.push from a <button>, so no anchor
  // is ever clicked — useSiteNav announces those explicitly instead.
  useEffect(() => onRouteProgressStart(start), [start]);

  // The new route has rendered — land the bar. Guarded on `from` so this does
  // not fire on mount, where the initial-load effect already owns the bar.
  useEffect(() => {
    if (from.current !== null && from.current !== pathname) finish();
  }, [pathname, finish]);

  useEffect(
    () => () => {
      stopRamp();
      clearTimers();
    },
    [],
  );

  // The gallery is a design island with its own chrome — see AGENTS.md. It also
  // navigates with router.push, so a click-driven bar would never start there.
  if (pathname?.startsWith("/gallery")) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease-out`,
      }}
    >
      {/* Transform and opacity only: the bar animates on the compositor and
          never forces layout during a navigation, which is exactly when the
          main thread is busiest. `linear` — no bounce, no elastic easing. */}
      <div
        className="h-full origin-left bg-gold"
        style={{
          transform: `scaleX(${value})`,
          transition: "transform 120ms linear",
        }}
      />
    </div>
  );
}
