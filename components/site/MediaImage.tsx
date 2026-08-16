"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/site/Skeleton";

// ---------------------------------------------------------------------------
// The one wrapper for CONTENT photography — treatment cards, doctor portraits,
// route heroes, the clinic exterior. It owns three things the bare <Image>
// cannot: a blur-up placeholder that fades rather than snaps, a shimmer
// skeleton where no blur exists, and a graceful fallback when a source 404s.
//
// Decorative backdrops (the `textures.*` panels, the Hero slideshow) stay on a
// plain server <Image> on purpose: a backdrop that fails to load is invisible
// anyway, so hydrating one buys nothing and costs a client island.
//
// Every call site places this inside a `relative` container with a fixed
// aspect ratio and lets `fill` do the sizing — so the skeleton occupies the
// exact final box and the swap shifts no layout.
// ---------------------------------------------------------------------------

// How far ahead of the viewport a below-fold image starts fetching. next/image
// emits a native `loading="lazy"`, whose threshold the browser owns and which
// no prop exposes — so this component runs its own observer and flips that
// attribute to `eager` on approach. The <img> is in the prerendered HTML
// either way; only the attribute changes, so no-JS still gets native lazy.
const APPROACH_MARGIN = "400px 0px";

// Length of the placeholder -> image dissolve, and the delay after which the
// blur layer is removed from the DOM entirely. Leaving it mounted at opacity 0
// would keep a blurred, scaled layer per image alive for the compositor to
// handle on every scrolled frame — measurably worse than the swap it smooths.
const FADE_MS = 200;

type LoadState = "pending" | "loaded" | "error";

interface MediaImageProps {
  src: StaticImageData;
  /** `""` marks the image decorative — it and its fallback leave the a11y tree. */
  alt: string;
  sizes: string;
  /** Classes for the <img> itself: object-fit, hover transforms, filters. */
  className?: string;
  /** True LCP images only. Implies eager and adds a preload. */
  priority?: boolean;
  /** Skip the lazy phase for an image known to sit in the first scroll. */
  eager?: boolean;
}

export const MediaImage = ({
  src,
  alt,
  sizes,
  className,
  priority = false,
  eager = false,
}: MediaImageProps) => {
  const ref = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<LoadState>("pending");
  const [near, setNear] = useState(priority || eager);
  const [blurGone, setBlurGone] = useState(false);

  const decorative = alt === "";
  const blur = src.blurDataURL;

  // A cached image can finish decoding before React hydrates, in which case
  // `onLoad` has already fired into the void and the placeholder would sit
  // there forever. Catch that from the element's own completion state.
  useEffect(() => {
    const el = ref.current;
    if (!el || !el.complete) return;
    setState(el.naturalWidth > 0 ? "loaded" : "error");
  }, []);

  // Drop the blur layer once the dissolve has finished, so a loaded image costs
  // exactly one composited layer again.
  useEffect(() => {
    if (state !== "loaded") return;
    const id = setTimeout(() => setBlurGone(true), FADE_MS);
    return () => clearTimeout(id);
  }, [state]);

  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: APPROACH_MARGIN },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  if (state === "error") {
    return (
      <div
        aria-hidden={decorative || undefined}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted px-4 text-center"
      >
        <ImageOff className="h-6 w-6 text-muted-foreground/60" />
        <span className="font-sans text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">
          Image unavailable
        </span>
      </div>
    );
  }

  const loaded = state === "loaded";

  return (
    <>
      {/* Only where a blur is not available — static imports carry one, but a
          source next/image cannot pre-blur falls through to the skeleton
          rather than to a bare box. */}
      {!loaded && !blur && <Skeleton />}

      <Image
        ref={ref}
        src={src}
        alt={alt}
        aria-hidden={decorative || undefined}
        fill
        sizes={sizes}
        priority={priority}
        // `priority` sets its own loading mode; overriding it would fight the
        // preload. Everything else starts lazy and is promoted on approach.
        loading={priority ? undefined : near ? "eager" : "lazy"}
        onLoad={() => setState("loaded")}
        onError={() => setState("error")}
        className={cn("object-cover", className)}
      />

      {/* The blur sits ON TOP and fades out, rather than being handed to
          next/image as placeholder="blur". next/image drops its placeholder in
          a single frame; a separate layer can dissolve over it, and fading the
          <img> in instead would hide the blur too — the placeholder is painted
          on that same element. */}
      {blur && !blurGone && (
        <span
          aria-hidden="true"
          style={{ backgroundImage: `url(${blur})`, transitionDuration: `${FADE_MS}ms` }}
          className={cn(
            "pointer-events-none absolute inset-0 scale-110 bg-cover bg-center blur-xl transition-opacity ease-out",
            loaded ? "opacity-0" : "opacity-100",
          )}
        />
      )}
    </>
  );
};
