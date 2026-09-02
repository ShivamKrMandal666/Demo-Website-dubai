import { PageShellSkeleton } from "@/components/site/PageShellSkeleton";

// The root shell. Two jobs: it is the fallback for `/` itself, and it is the
// default any future segment without its own loading.tsx inherits — the gap
// that let `/` and `/gallery` navigate with no shell at all.
//
// Full-height hero, because the home Hero is `h-[100svh] min-h-[520px]`
// (sm:min-h-[640px]) rather than the 62svh the browse routes use. Match it or
// the fold jumps when the real page swaps in.
//
// Scope, same as the other five: this paints during client-side navigation
// while the RSC payload is in flight. It cannot appear on a cold load — every
// route here is statically prerendered, so the full HTML arrives in one
// response and there is nothing to suspend on.
export default function Loading() {
  return (
    <PageShellSkeleton
      heroClassName="min-h-[max(100svh,520px)] pt-[104px] pb-12 sm:min-h-[max(100svh,640px)]"
      rows={2}
    />
  );
}
