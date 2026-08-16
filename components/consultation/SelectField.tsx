"use client";

import { ChevronDown } from "lucide-react";
import type { SelectOption } from "@/lib/data/consultation";
import { cn } from "@/lib/utils";

// A native `<select>`, styled to match `components/ui/input.tsx`.
//
// Deliberately not shadcn's Select: that is a Radix listbox at ~18–20 kB
// gzipped, and on mobile it replaces the OS picker — which is faster, more
// familiar and more accessible than anything rendered in the page — with a
// popover. For two flat lists of ten and five items the native control is
// better on every axis except how much of the chrome we get to style, and the
// only chrome that matters here is the arrow.
//
// `appearance-none` removes the platform arrow; the lucide one is
// `pointer-events-none` so clicks fall through to the select underneath.

interface SelectFieldProps<T extends string> {
  id: string;
  name: string;
  value: T | "";
  onChange: (value: T | "") => void;
  /** The `value=""` option — "No preference", "I'm not sure yet". */
  placeholder: string;
  options: readonly SelectOption<T>[];
  invalid?: boolean;
  describedBy?: string;
  className?: string;
}

export const SelectField = <T extends string>({
  id,
  name,
  value,
  onChange,
  placeholder,
  options,
  invalid,
  describedBy,
  className,
}: SelectFieldProps<T>) => (
  <div className="relative">
    <select
      id={id}
      name={name}
      value={value}
      onChange={(event) => onChange(event.target.value as T | "")}
      aria-invalid={invalid ? true : undefined}
      aria-describedby={describedBy}
      className={cn(
        "flex h-11 w-full appearance-none rounded-lg border border-input bg-card px-4 pr-11 font-sans text-base text-foreground shadow-sm transition-[border-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // An unselected select is a placeholder, and should read like one.
        value === "" && "text-muted-foreground/70",
        invalid && "border-destructive focus-visible:ring-destructive",
        className,
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDown
      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      aria-hidden="true"
    />
  </div>
);
