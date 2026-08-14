"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

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
  <motion.div
    className={className}
    initial={{ opacity: 0, y, x }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    viewport={{ once, margin: "-80px 0px" }}
    transition={{ duration, delay, ease: EASE }}
  >
    {children}
  </motion.div>
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
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once, margin: "-80px 0px" }}
    variants={{ show: { transition: { staggerChildren: stagger } } }}
  >
    {children}
  </motion.div>
);

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  y?: number;
}

export const RevealItem = ({ children, className, y = 26 }: RevealItemProps) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y },
      show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
    }}
  >
    {children}
  </motion.div>
);
