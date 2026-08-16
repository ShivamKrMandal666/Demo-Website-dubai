import * as React from "react";

import { cn } from "@/lib/utils";

// Same token audit as `input.tsx` — see the note there.
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[7rem] w-full rounded-lg border border-input bg-card px-4 py-3 font-sans text-base leading-relaxed text-foreground shadow-sm transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
