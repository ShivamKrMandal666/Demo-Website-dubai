"use client";

import { timePreferences, type TimeOfDay } from "@/lib/data/consultation";

// Three pills that are actually a radio group: a real `<fieldset>`/`<legend>`
// with `sr-only` inputs, styled through `peer-checked`. Arrow-key navigation,
// group semantics and the announced legend all come for free, and the visual
// treatment is the house card pattern from context/ui-context.md so it reads as
// part of the system rather than as a form widget.
//
// `peer-focus-visible` on the pill is what keeps the focus ring visible once
// the real input is `sr-only`.

interface TimeOfDayFieldProps {
  value: TimeOfDay | "";
  onChange: (value: TimeOfDay) => void;
}

export const TimeOfDayField = ({ value, onChange }: TimeOfDayFieldProps) => (
  <fieldset className="space-y-3">
    <legend className="flex items-baseline gap-2 font-sans text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
      <span>Preferred time</span>
      <span className="normal-case tracking-normal text-muted-foreground/60">
        optional
      </span>
    </legend>
    <div className="flex flex-wrap gap-3">
      {timePreferences.map((preference) => (
        <label key={preference.value} className="cursor-pointer">
          <input
            type="radio"
            name="timeOfDay"
            value={preference.value}
            checked={value === preference.value}
            onChange={() => onChange(preference.value)}
            className="peer sr-only"
          />
          <span className="flex flex-col rounded-2xl border border-border bg-card px-5 py-3 shadow-soft transition-[transform,background-color,border-color] duration-300 hover:-translate-y-0.5 hover:border-gold/50 peer-checked:border-primary peer-checked:bg-primary/10 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background">
            <span className="font-sans text-sm text-foreground">
              {preference.label}
            </span>
            <span className="font-sans text-xs text-muted-foreground">
              {preference.hint}
            </span>
          </span>
        </label>
      ))}
    </div>
  </fieldset>
);
