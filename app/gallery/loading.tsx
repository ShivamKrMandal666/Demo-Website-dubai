// NOT PageShellSkeleton. Every other route's shell carries the real Navbar and
// Footer, and /gallery renders neither — it is a full-bleed `fixed inset-0`
// surface, not a page (see AGENTS.md and context/architecture.md). Handing it
// the shared shell would flash chrome that the route never shows.
//
// Nor components/site/Skeleton: that panel is built on `bg-muted` -> `--cream`,
// the warm light pair every other route sits on. Against espresso-deep it would
// read as bright cut-outs. Same `animate-shimmer` keyframe, bone tokens at low
// alpha instead — the sweep stays inside this surface's own range.
//
// Tile geometry follows the real wall: one 4:3 box per tile, `gap-x-14`/`gap-y-7`
// with the matching half-gap padding, two columns stepping to four at md.
//
// Scope, as with the other shells: this paints during client-side navigation
// while the RSC payload is in flight, not on a cold load — /gallery is
// statically prerendered like every other route here.
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading gallery"
      className="fixed inset-0 z-50 select-none overflow-hidden bg-espresso-deep text-bone"
    >
      <div className="grid h-full grid-cols-2 content-center gap-x-14 gap-y-7 px-7 py-3.5 md:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bone/[0.06] bg-[linear-gradient(100deg,hsl(var(--bone)/0.04)_20%,hsl(var(--bone)/0.12)_40%,hsl(var(--bone)/0.04)_60%)] bg-[length:200%_100%] shadow-elegant animate-shimmer"
          />
        ))}
      </div>
    </div>
  );
}
