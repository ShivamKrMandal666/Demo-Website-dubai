"use client";

import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Label + control + inline error, plus the aria wiring that goes with them.
// Every field on the form renders through here so the three easy things to get
// wrong — `htmlFor`/`id` agreement, `aria-describedby` pointing at a node that
// exists, and an error that is announced rather than only coloured — are solved
// once instead of seven times.
//
// The control is a child rather than a prop so each field keeps its own real
// element (`Input`, `Textarea`, native `select`); this component only supplies
// the ids to hang it on.

export interface FormFieldProps {
  /** Shared id stem. The control uses it; the error node uses `${id}-error`. */
  id: string;
  label: string;
  required?: boolean;
  /** Persistent helper text. Replaced by the error message when one is present. */
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

/** Ids for the nodes `aria-describedby` may point at. Never both at once. */
export const describedBy = (id: string, error?: string, hint?: string) => {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
};

export const FormField = ({
  id,
  label,
  required = false,
  hint,
  error,
  className,
  children,
}: FormFieldProps) => (
  <div className={cn("space-y-2.5", className)}>
    <Label
      htmlFor={id}
      className="flex items-baseline gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground"
    >
      <span>
        {label}
        {/* The `required` attribute already conveys this to assistive tech —
            the asterisk is the sighted half of the same message. */}
        {required && (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </span>
      {!required && (
        <span className="normal-case tracking-normal text-muted-foreground/60">
          optional
        </span>
      )}
    </Label>

    {children}

    {error ? (
      <p
        id={`${id}-error`}
        className="flex items-start gap-1.5 font-sans text-xs leading-relaxed text-destructive"
      >
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {error}
      </p>
    ) : (
      hint && (
        <p
          id={`${id}-hint`}
          className="font-sans text-xs leading-relaxed text-muted-foreground/80"
        >
          {hint}
        </p>
      )
    )}
  </div>
);

/** The error styling every control shares. Kept here so it cannot drift. */
export const errorFieldClass =
  "border-destructive focus-visible:ring-destructive";
