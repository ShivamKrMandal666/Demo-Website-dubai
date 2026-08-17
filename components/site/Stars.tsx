import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Whole-star rating, 0–5.
 *
 * Promoted out of Testimonials once the reviews carousel needed it too. Two
 * things changed on the way up: it announces itself (five decorative glyphs told
 * a screen reader nothing about the score), and callers pass a real rating —
 * both original call sites hardcoded `5`, which made the prop inert.
 *
 * No half stars. Nothing in the data needs them, and the aggregate score is
 * printed as a numeral beside its stars rather than encoded in them.
 */
export const Stars = ({ value, className }: { value: number; className?: string }) => (
  <div
    role="img"
    aria-label={`${value} out of 5 stars`}
    className={cn("flex items-center gap-0.5", className)}
  >
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        aria-hidden="true"
        className={cn("h-4 w-4", i < value ? "fill-gold text-gold" : "text-muted-foreground/40")}
      />
    ))}
  </div>
);
