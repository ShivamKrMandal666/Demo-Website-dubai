// ---------------------------------------------------------------------------
// Consultation form logic. Pure — no React, no DOM, no imports from
// components/. That is what keeps `ConsultationForm` a rendering concern, and
// what would let this be swapped for a zod schema later without touching it.
//
// No validation library on purpose: seven fields, three required, two format
// rules, no async checks, no cross-field dependencies and no server schema to
// share. react-hook-form + zod + the resolver is ~27 kB gzipped against a
// tracked First Load JS budget, to replace the forty lines below.
// ---------------------------------------------------------------------------

import type { ConsultationValues } from "@/lib/data/consultation";
import type { DoctorSlug, TreatmentSlug } from "@/lib/data/site";

export type ConsultationErrors = Partial<
  Record<keyof ConsultationValues, string | undefined>
>;

const PHONE_SEPARATORS = /[\s().-]/g;
// Deliberately international. The dummy clinic phone is UK-formatted and
// `clinic.address` is a London one, but both are under review (see the Dubai
// note in context/progress-tracker.md) — a UK-specific pattern would silently
// start rejecting real input the day that data is swapped.
const PHONE = /^\+?\d{7,15}$/;
// One `@`, a dot in the domain, no whitespace. Not RFC 5322, and not trying to
// be: the only failure this needs to catch is a typo the visitor can see.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * The fields that can fail, in the order they appear in the form. Drives which
 * field takes focus after a failed submit, so the visitor lands on the first
 * problem rather than the last one found.
 */
export const FIELD_ORDER = ["name", "phone", "email", "date"] as const;

export type ValidatedField = (typeof FIELD_ORDER)[number];

export function validateField(
  field: keyof ConsultationValues,
  values: ConsultationValues,
): string | undefined {
  switch (field) {
    case "name":
      return values.name.trim().length >= 2
        ? undefined
        : "Please enter your name.";

    case "phone": {
      const value = values.phone.trim();
      if (!value) return "Please enter a phone number.";
      return PHONE.test(value.replace(PHONE_SEPARATORS, ""))
        ? undefined
        : "Enter a valid phone number, including the country code.";
    }

    case "email": {
      const value = values.email.trim();
      if (!value) return "Please enter an email address.";
      return EMAIL.test(value)
        ? undefined
        : "Enter a valid email address, e.g. name@example.com.";
    }

    case "date": {
      // Optional — a request with no date preference is perfectly valid.
      if (!values.date) return undefined;
      // Parsed as local midnight, not UTC: `new Date("2026-08-16")` is UTC and
      // would read as "yesterday" for anyone west of Greenwich.
      const chosen = new Date(`${values.date}T00:00:00`);
      if (Number.isNaN(chosen.getTime())) return "Choose a valid date.";
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return chosen >= today
        ? undefined
        : "Choose a date that has not passed.";
    }

    // treatment / doctor / timeOfDay / message are optional and free-form.
    default:
      return undefined;
  }
}

export function validateConsultation(
  values: ConsultationValues,
): ConsultationErrors {
  const errors: ConsultationErrors = {};
  for (const field of FIELD_ORDER) {
    const error = validateField(field, values);
    if (error) errors[field] = error;
  }
  return errors;
}

export interface ConsultationPrefill {
  treatment?: TreatmentSlug;
  doctor?: DoctorSlug;
}

/** The one place a /book URL is constructed — every CTA on the site goes through it. */
export function bookHref(prefill?: ConsultationPrefill): string {
  const params = new URLSearchParams();
  if (prefill?.treatment) params.set("treatment", prefill.treatment);
  if (prefill?.doctor) params.set("doctor", prefill.doctor);
  const query = params.toString();
  return query ? `/book?${query}` : "/book";
}

/** `tel:` needs the separators gone. MobileMenu had this inline; now it doesn't. */
export const telHref = (phone: string) => `tel:${phone.replace(/[\s()-]/g, "")}`;
