// ---------------------------------------------------------------------------
// Static, typed content for the consultation request form — the same rule as
// lib/data/site.ts: nothing here is fetched, and none of it is inlined in a
// component. The two select lists are *derived* from `treatments` / `doctors`,
// so an eleventh treatment appears in the dropdown with no edit in this file.
// ---------------------------------------------------------------------------

import {
  doctors,
  treatments,
  type DoctorSlug,
  type TreatmentSlug,
} from "@/lib/data/site";

export type TimeOfDay = "morning" | "afternoon" | "evening";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export interface TimePreference {
  value: TimeOfDay;
  label: string;
  /** The window itself — shown under the label on the pill. */
  hint: string;
}

/**
 * A general preference, not a slot. Nothing here is bookable, held or
 * confirmed: the clinic reads it and proposes an actual time by phone.
 */
export const timePreferences: readonly TimePreference[] = [
  { value: "morning", label: "Morning", hint: "9:00 – 12:00" },
  { value: "afternoon", label: "Afternoon", hint: "12:00 – 16:00" },
  { value: "evening", label: "Evening", hint: "16:00 – 19:00" },
];

export const treatmentOptions: readonly SelectOption<TreatmentSlug>[] =
  treatments.map((t) => ({ value: t.slug, label: t.name }));

export const doctorOptions: readonly SelectOption<DoctorSlug>[] = doctors.map(
  (d) => ({ value: d.slug, label: `${d.name} — ${d.specialty}` }),
);

/** The one number the success copy, the form intro and ContactDetails quote. */
export const RESPONSE_WINDOW_HOURS = 24;

/**
 * What this flow is and is not. Stated up front on /book because the whole
 * design rests on it: a request, not a confirmed appointment.
 */
export const requestAssurances: readonly string[] = [
  "This is a consultation request, not a confirmed appointment.",
  "No payment is taken and no time slot is held.",
  `A coordinator confirms your time within ${RESPONSE_WINDOW_HOURS} hours.`,
];

/**
 * The shape of the form. `""` is the deliberate empty state for every optional
 * field — a select whose value is `""` shows its placeholder option, which is
 * what an untouched or unrecognised prefill has to fall back to.
 */
export interface ConsultationValues {
  name: string;
  phone: string;
  email: string;
  treatment: TreatmentSlug | "";
  doctor: DoctorSlug | "";
  /** yyyy-mm-dd, straight from `<input type="date">`. */
  date: string;
  timeOfDay: TimeOfDay | "";
  message: string;
}

export const emptyConsultation: ConsultationValues = {
  name: "",
  phone: "",
  email: "",
  treatment: "",
  doctor: "",
  date: "",
  timeOfDay: "",
  message: "",
};
