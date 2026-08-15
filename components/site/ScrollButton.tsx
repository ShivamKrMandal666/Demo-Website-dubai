"use client";

import type { ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { scrollToId } from "@/lib/smooth-scroll";

// Companion to ToastButton: the other reason a section used to be a client
// component was a single in-page scroll CTA. Uses the shared Lenis-aware
// scrollToId from lib/smooth-scroll.ts.
interface ScrollButtonProps extends Omit<ButtonProps, "onClick" | "asChild"> {
  /** Target element id, including the leading '#'. */
  to: string;
  children: ReactNode;
}

export const ScrollButton = ({ to, children, ...buttonProps }: ScrollButtonProps) => (
  <Button onClick={() => scrollToId(to)} {...buttonProps}>
    {children}
  </Button>
);
