"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  RESPONSE_WINDOW_HOURS,
  timePreferences,
  type ConsultationValues,
} from "@/lib/data/consultation";
import { getDoctorBySlug, getTreatmentBySlug } from "@/lib/data/site";

// The optimistic confirmation. It replaces the form the instant validation
// passes — no spinner, no simulated latency, because there is no backend to
// wait on and faking one would be pretending otherwise.
//
// Deliberately a panel and not a sonner toast: a toast disappears, and this
// message is the only record the visitor gets of what they just sent. It also
// echoes their preferences back, which is the cheapest way to catch a wrong
// selection before the clinic calls.

interface ConsultationSuccessProps {
  values: ConsultationValues;
  onReset: () => void;
}

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const ConsultationSuccess = ({
  values,
  onReset,
}: ConsultationSuccessProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // The live region announces the message; the focus move is what stops a
  // keyboard user being stranded on a submit button that no longer exists.
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  const firstName = values.name.trim().split(/\s+/)[0];
  const treatment = values.treatment
    ? getTreatmentBySlug(values.treatment)?.name
    : undefined;
  const doctor = values.doctor ? getDoctorBySlug(values.doctor)?.name : undefined;
  const time = values.timeOfDay
    ? timePreferences.find((p) => p.value === values.timeOfDay)?.label
    : undefined;

  const summary: { label: string; value: string }[] = [
    treatment && { label: "Treatment", value: treatment },
    doctor && { label: "Doctor", value: doctor },
    values.date && { label: "Preferred date", value: formatDate(values.date) },
    time && { label: "Preferred time", value: time },
  ].filter((row): row is { label: string; value: string } => Boolean(row));

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      className="rounded-3xl border border-primary/30 bg-card p-8 shadow-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:p-10"
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"
        aria-hidden="true"
      >
        <Check className="h-6 w-6" />
      </span>

      <h3 className="mt-6 font-serif text-2xl tracking-editorial text-foreground text-balance sm:text-3xl">
        Request received
      </h3>
      <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-muted-foreground">
        Thank you, {firstName}. Our team will contact you within{" "}
        {RESPONSE_WINDOW_HOURS} hours to confirm your appointment. Nothing is
        booked until we&rsquo;ve spoken.
      </p>

      {summary.length > 0 && (
        <dl className="mt-8 space-y-3 border-t border-border pt-6">
          {summary.map((row) => (
            <div key={row.label} className="flex flex-wrap gap-x-3 gap-y-1">
              <dt className="min-w-[8.5rem] font-sans text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                {row.label}
              </dt>
              <dd className="font-sans text-sm text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <p className="mt-6 font-sans text-xs leading-relaxed text-muted-foreground/80">
        We&rsquo;ll reply to {values.email.trim()} or call {values.phone.trim()}.
      </p>

      <Button
        onClick={onReset}
        variant="outlineSage"
        size="lg"
        className="mt-8 rounded-full"
      >
        Send another request
      </Button>
    </div>
  );
};
