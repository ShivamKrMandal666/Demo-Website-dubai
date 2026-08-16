"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConsultationSuccess } from "@/components/consultation/ConsultationSuccess";
import {
  describedBy,
  errorFieldClass,
  FormField,
} from "@/components/consultation/FormField";
import { SelectField } from "@/components/consultation/SelectField";
import { TimeOfDayField } from "@/components/consultation/TimeOfDayField";
import {
  doctorOptions,
  emptyConsultation,
  RESPONSE_WINDOW_HOURS,
  treatmentOptions,
  type ConsultationValues,
} from "@/lib/data/consultation";
import {
  FIELD_ORDER,
  validateConsultation,
  validateField,
  type ConsultationErrors,
  type ConsultationPrefill,
} from "@/lib/consultation";
import { cn } from "@/lib/utils";

// The one form. /contact renders it as a general enquiry, /book renders it with
// a treatment or doctor prefilled — same fields, same validation, same
// confirmation, because they are the same request with different context.
//
// Prefill arrives as already-resolved, typed slugs. Turning `?treatment=xyz`
// into a `TreatmentSlug` is the caller's job (see PrefilledConsultationForm),
// which keeps this component usable from anywhere and keeps the untrusted-input
// concern in exactly one place.

interface ConsultationFormProps {
  prefill?: ConsultationPrefill;
  /** "Request a Consultation" on /book, "Send Enquiry" on /contact. */
  submitLabel?: string;
  className?: string;
}

export const ConsultationForm = ({
  prefill,
  submitLabel = "Request a Consultation",
  className,
}: ConsultationFormProps) => {
  // SSR-stable and unique, so two forms could coexist on one page without
  // their labels pointing at each other's controls.
  const uid = useId();
  const fieldId = (field: keyof ConsultationValues) => `${uid}-${field}`;

  const [values, setValues] = useState<ConsultationValues>({
    ...emptyConsultation,
    ...prefill,
  });
  const [errors, setErrors] = useState<ConsultationErrors>({});
  // Doubles as the status flag and the frozen snapshot the panel echoes back.
  const [submitted, setSubmitted] = useState<ConsultationValues | null>(null);

  const setField = <K extends keyof ConsultationValues>(
    field: K,
    value: ConsultationValues[K],
  ) => {
    setValues((previous) => {
      const next = { ...previous, [field]: value };
      // Only re-check a field that has already failed. Validating as someone
      // types their first character means telling them their email is invalid
      // before they have finished writing it.
      setErrors((current) =>
        current[field] === undefined
          ? current
          : { ...current, [field]: validateField(field, next) },
      );
      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateConsultation(values);
    const firstInvalid = FIELD_ORDER.find((field) => found[field]);

    if (firstInvalid) {
      setErrors(found);
      // Focus the first problem in visual order, not the last one found.
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    // No backend, so no pending state: the success panel *is* the optimistic
    // response. A simulated delay here would be theatre.
    setSubmitted(values);
  };

  const reset = () => {
    setValues({ ...emptyConsultation, ...prefill });
    setErrors({});
    setSubmitted(null);
  };

  if (submitted) {
    return (
      <div className={className}>
        <ConsultationSuccess values={submitted} onReset={reset} />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      // Suppresses the browser's native validation bubbles so our inline errors
      // are the only error UI. `required` stays on each control regardless, so
      // assistive tech still announces the field as required.
      noValidate
      aria-describedby={`${uid}-note`}
      className={cn("space-y-6", className)}
    >
      <p
        id={`${uid}-note`}
        className="font-sans text-sm leading-relaxed text-muted-foreground"
      >
        Fields marked <span className="text-destructive">*</span> are required.
        We reply within {RESPONSE_WINDOW_HOURS} hours — this is a request, not a
        confirmed appointment.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          id={fieldId("name")}
          label="Name"
          required
          error={errors.name}
          className="sm:col-span-2"
        >
          <Input
            id={fieldId("name")}
            name="name"
            autoComplete="name"
            required
            placeholder="Your full name"
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy(fieldId("name"), errors.name)}
            className={cn(errors.name && errorFieldClass)}
          />
        </FormField>

        <FormField
          id={fieldId("phone")}
          label="Phone"
          required
          error={errors.phone}
        >
          <Input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="+44 20 7946 0123"
            value={values.phone}
            onChange={(event) => setField("phone", event.target.value)}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy(fieldId("phone"), errors.phone)}
            className={cn(errors.phone && errorFieldClass)}
          />
        </FormField>

        <FormField
          id={fieldId("email")}
          label="Email"
          required
          error={errors.email}
        >
          <Input
            id={fieldId("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="name@example.com"
            value={values.email}
            onChange={(event) => setField("email", event.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy(fieldId("email"), errors.email)}
            className={cn(errors.email && errorFieldClass)}
          />
        </FormField>

        {/* Both selects take a full row rather than pairing up: the doctor
            options are "Name — Specialty", which a half-width control clips in
            its closed state on every viewport. */}
        <FormField
          id={fieldId("treatment")}
          label="Preferred treatment"
          className="sm:col-span-2"
        >
          <SelectField
            id={fieldId("treatment")}
            name="treatment"
            value={values.treatment}
            onChange={(value) => setField("treatment", value)}
            placeholder="I'm not sure yet"
            options={treatmentOptions}
          />
        </FormField>

        <FormField
          id={fieldId("doctor")}
          label="Preferred doctor"
          className="sm:col-span-2"
        >
          <SelectField
            id={fieldId("doctor")}
            name="doctor"
            value={values.doctor}
            onChange={(value) => setField("doctor", value)}
            placeholder="No preference"
            options={doctorOptions}
          />
        </FormField>

        <FormField
          id={fieldId("date")}
          label="Preferred date"
          hint="A general preference — we'll confirm the exact time with you."
          error={errors.date}
          className="sm:col-span-2 sm:max-w-xs"
        >
          <Input
            id={fieldId("date")}
            name="date"
            type="date"
            value={values.date}
            onChange={(event) => setField("date", event.target.value)}
            aria-invalid={errors.date ? true : undefined}
            aria-describedby={describedBy(
              fieldId("date"),
              errors.date,
              "hint",
            )}
            className={cn(errors.date && errorFieldClass)}
          />
        </FormField>

        <div className="sm:col-span-2">
          <TimeOfDayField
            value={values.timeOfDay}
            onChange={(value) => setField("timeOfDay", value)}
          />
        </div>

        <FormField
          id={fieldId("message")}
          label="Message"
          className="sm:col-span-2"
        >
          <Textarea
            id={fieldId("message")}
            name="message"
            rows={4}
            placeholder="Anything you'd like us to know before we call."
            value={values.message}
            onChange={(event) => setField("message", event.target.value)}
          />
        </FormField>
      </div>

      <Button type="submit" variant="gold" size="xl" className="rounded-full">
        {submitLabel}
        <ArrowUpRight className="h-4 w-4" />
      </Button>
    </form>
  );
};
