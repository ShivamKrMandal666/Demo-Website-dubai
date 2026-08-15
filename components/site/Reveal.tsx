"use client";

import type { ReactNode } from "react";
// `m` instead of `motion`: same API, but it ships none of the feature code
// itself — those come from <MotionProvider> in the root layout.
import * as m from "motion/react-m";

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  once?: boolean;
  duration?: number;
}

export const Reveal = ({
  children,
  className,
  delay = 0,
  y = 28,
  x = 0,
  once = true,
  duration = 0.8,
}: RevealProps) => (
  <m.div
    className={className}
    initial={{ opacity: 0, y, x }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    viewport={{ once, margin: "-80px 0px" }}
    transition={{ duration, delay, ease: EASE }}
  >
    {children}
  </m.div>
);

interface RevealStaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}

export const RevealStagger = ({
  children,
  className,
  stagger = 0.12,
  once = true,
}: RevealStaggerProps) => (
  <m.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once, margin: "-80px 0px" }}
    variants={{ show: { transition: { staggerChildren: stagger } } }}
  >
    {children}
  </m.div>
);

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  y?: number;
}

export const RevealItem = ({ children, className, y = 26 }: RevealItemProps) => (
  <m.div
    className={className}
    variants={{
      hidden: { opacity: 0, y },
      show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
    }}
  >
    {children}
  </m.div>
);
