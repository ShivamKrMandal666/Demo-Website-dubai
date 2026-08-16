import { cn } from "@/lib/utils";

/**
 * A shimmering placeholder panel. Absolutely positioned by default, so it fills
 * whichever fixed-aspect container it is dropped into and reserves no space of
 * its own — the container already holds the box open, which is what keeps CLS
 * at zero when the real content arrives.
 *
 * Ships no JavaScript: the sweep is a CSS gradient moved by the `shimmer`
 * keyframe in tailwind.config.ts, not a JS-driven animation.
 */
export const Skeleton = ({ className }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={cn(
      "absolute inset-0 bg-muted",
      // muted -> cream -> muted, so the sweep stays inside the warm neutral
      // range rather than reading as a grey loading bar from another site.
      "bg-[linear-gradient(100deg,hsl(var(--muted))_20%,hsl(var(--cream))_40%,hsl(var(--muted))_60%)]",
      "bg-[length:200%_100%] animate-shimmer",
      className,
    )}
  />
);
