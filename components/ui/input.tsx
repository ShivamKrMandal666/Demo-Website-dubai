import * as React from "react";

import { cn } from "@/lib/utils";

// shadcn `input`, re-scaled to the house system: `h-11` sits between the `lg`
// and `default` button heights, `rounded-lg` resolves to `--radius` (buttons
// and CTAs are the only `rounded-full` things), and the focus ring is the same
// two-ring-plus-offset recipe as `components/ui/button.tsx` so a form tabs with
// the same visual language as the rest of the site.
//
// `--input` and `--ring` were declared in globals.css from the start and unused
// until this component. `text-base` on mobile is deliberate — anything smaller
// makes iOS Safari zoom the viewport on focus.
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-input bg-card px-4 py-2 font-sans text-base text-foreground shadow-sm transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
