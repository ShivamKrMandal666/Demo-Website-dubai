import { cn } from "@/lib/utils";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Skeleton } from "@/components/site/Skeleton";

// ---------------------------------------------------------------------------
// The structure-first shell every route falls back to while its payload is in
// flight. Rendered from each route's loading.tsx.
//
// It carries the REAL Navbar and Footer, not skeletons of them: both are static
// and already in the client bundle, so the chrome that surrounds the page can
// be correct from the first frame and nothing about it moves when the real page
// swaps in. Only the parts that depend on route data are skeletons.
//
// Scope note: every route here is statically prerendered, so this shows during
// client-side navigation while the RSC payload is fetched — not on a cold load,
// where the full HTML arrives at once.
// ---------------------------------------------------------------------------

interface PageShellSkeletonProps {
  /** Match the real hero's height so the fold does not jump on swap. */
  heroClassName?: string;
  /** Content blocks below the hero. */
  rows?: number;
}

export const PageShellSkeleton = ({
  heroClassName = "h-[62svh] min-h-[460px]",
  rows = 2,
}: PageShellSkeletonProps) => (
  <div className="relative min-h-screen bg-background text-foreground">
    <Navbar />
    <main>
      {/* Hero band — dark, like every real hero, so the page does not flash
          light and then go dark a moment later. */}
      <section className={cn("relative overflow-hidden bg-espresso", heroClassName)}>
        <div className="container relative z-10 mx-auto flex h-full flex-col justify-center gap-4">
          <div className="h-3 w-40 rounded-full bg-bone/15" />
          <div className="h-10 w-full max-w-2xl rounded-lg bg-bone/10 sm:h-14" />
          <div className="h-4 w-full max-w-md rounded-full bg-bone/10" />
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container mx-auto space-y-16">
          {Array.from({ length: rows }, (_, row) => (
            <div key={row} className="grid items-center gap-10 md:grid-cols-12 md:gap-16">
              {/* Mirrors the doctor portrait box in DoctorsPage — if that
                  aspect changes and this does not, the fold jumps on route swap. */}
              <div className="relative aspect-square overflow-hidden rounded-2xl md:col-span-5 md:aspect-[4/5]">
                <Skeleton />
              </div>
              <div className="space-y-4 md:col-span-6 md:col-start-7">
                <div className="h-3 w-32 rounded-full bg-muted" />
                <div className="h-9 w-full max-w-lg rounded-lg bg-muted" />
                <div className="h-4 w-full rounded-full bg-muted" />
                <div className="h-4 w-11/12 rounded-full bg-muted" />
                <div className="h-4 w-9/12 rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </div>
);
