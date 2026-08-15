import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FadeUpProps {
  children: ReactNode;
  className?: string;
  /** Stagger, in milliseconds. Matches the `delay` prop on `Reveal` (× 1000). */
  delay?: number;
}

/**
 * The CSS counterpart to `Reveal`, for content that is above the fold.
 *
 * `Reveal` animates through Motion, which means its `initial={{ opacity: 0 }}`
 * is serialised into the prerendered HTML as `style="opacity:0"` and only
 * clears once React hydrates. Below the fold that costs nothing — the element
 * is off-screen anyway, and `whileInView` is a real scroll trigger. Above the
 * fold it means the server-rendered text is invisible at first paint, which is
 * what pushed FCP out to 2.1s while LCP waited on hydration at 4.5s.
 *
 * This runs the same entrance as a CSS `@keyframes` (`fade-up` in
 * tailwind.config.ts, same easing curve as Motion's `EASE`), so it starts at
 * first paint. No `"use client"`: the markup stays server-rendered and ships
 * no JavaScript at all.
 *
 * Use `Reveal` for anything below the fold — this component has no scroll
 * trigger, so an off-screen section would finish animating before it is seen.
 */
export const FadeUp = ({ children, className, delay }: FadeUpProps) => {
  const style: CSSProperties | undefined = delay ? { animationDelay: `${delay}ms` } : undefined;

  return (
    <div className={cn("animate-fade-up", className)} style={style}>
      {children}
    </div>
  );
};
