"use client";

import type { ReactNode } from "react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";

// The one interactive bit of most sections is a button that fires a sonner
// toast. Isolating it here lets the sections themselves go back to being
// server components instead of shipping their whole markup to the client.
//
// It forwards every Button prop through unchanged, so call sites keep their
// exact variant/size/className and render identical markup.
interface ToastButtonProps extends Omit<ButtonProps, "onClick" | "asChild"> {
  /** Toast headline. */
  title: string;
  /** Optional second line. */
  description?: string;
  children: ReactNode;
}

export const ToastButton = ({
  title,
  description,
  children,
  ...buttonProps
}: ToastButtonProps) => (
  <Button
    onClick={() => toast(title, description ? { description } : undefined)}
    {...buttonProps}
  >
    {children}
  </Button>
);

// `BOOKING_TOAST` lived here until booking became a real form. Every booking
// CTA now goes to /book via `components/site/BookButton.tsx`, and the toast
// that claimed a request had been received without one being made is gone.
// What is left uses this for what it was always honest about: a stub for
// something not wired up yet, like the Google Reviews link.
