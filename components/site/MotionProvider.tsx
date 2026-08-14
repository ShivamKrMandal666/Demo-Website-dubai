"use client";

import type { ReactNode } from "react";
import { LazyMotion, domAnimation } from "motion/react";

// Loads only the `domAnimation` feature bundle — animations, variants, exit
// and the hover/tap/inView gestures, which is everything this site uses.
// It deliberately leaves out the layout-projection engine (`domMax`), which
// only `layout` / `layoutId` / `drag` need and which nothing here does; that
// engine was 85 of the module markers in the 70 kB chunk shared by every
// route.
//
// `strict` is the guardrail: with it on, rendering a plain `motion.div`
// throws instead of silently pulling the full bundle back in. Every animated
// element must use the `m` component from `motion/react-m`.
//
// Mounted once in the root layout, so the layout itself stays a server
// component.
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
