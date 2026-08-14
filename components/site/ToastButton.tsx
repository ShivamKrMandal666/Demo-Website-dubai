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

// Every "Book an Appointment" button site-wide fires this same toast. Kept in
// one place so the booking copy cannot drift between the seven call sites.
export const BOOKING_TOAST = {
  title: "Booking request received",
  description: "Our concierge will confirm your appointment shortly.",
} as const;
