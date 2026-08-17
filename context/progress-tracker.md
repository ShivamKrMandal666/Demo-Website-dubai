# Progress Tracker

Current state only. Keep entries at the weight of an invariant, a decision or an
open risk — small fixes belong in git history, not here.

## Status

**Prototype.** Every nav page is built and live. Last verification (2026-08-17,
after `final-changes.md`): `typecheck`/`lint`/`build` clean, **19** static pages,
none dynamic, shared First Load JS 102 kB.

Lighthouse mobile, median of 3, before -> after this pass. **CLS stayed 0 on
every route** — the point of the exercise, given how many aspect ratios moved:

| Route | Score | LCP | TBT | First Load JS |
|---|---|---|---|---|
| `/` | 82 -> 82 | 4483 -> 4489 ms | 84 -> 44 ms | 171 -> 173 kB |
| `/doctors` | 85 -> 86 | 3928 -> 3922 ms | 94 -> 85 ms | 166 -> 166 kB |
| `/gallery` | 95 -> 94 | 2894 -> 3030 ms | 121 -> 44 ms | 175 -> 179 kB |
| `/contact` | 87 -> 86 | 3770 -> 3765 ms | 140 -> 136 ms | 170 -> 171 kB |

Scores are flat inside the ±1 noise band; the +2 kB on `/` is the reviews
carousel and the +4 kB on `/gallery` is the lightbox. **Measure with nothing
else running** — an earlier run with `typecheck` in parallel doubled `/doctors`
TBT and cost 2 points.

## Completed

- **Home** — Hero (3-image ken-burns slideshow), About, Signature Treatments
  (bento), Doctors carousel, Testimonials + Google rating, CTA band, Map, Footer.
- **Treatments + 10 detail pages** — one `TreatmentDetailPage` driven by the
  `Treatment` record, so an 11th is a data edit plus two images; all prerender.
- **Doctors (`/doctors`)** — server page: hero, stats band, five profiles.
  **Gallery (`/gallery`)** — 8-image infinite drag/wheel wall, one 4:3 tile box,
  site tokens, Motion lightbox (X / backdrop / Escape, drag-safe click).
- **Contact + `/book`** — one `ConsultationForm` serves both, `/book` prefilled
  from the query string, all 12 CTAs pointed there; plus a `StickyContact` rail.
- **Loading system** — `MediaImage` blur-up on ~40 photos, `RouteProgress` (custom:
  the nav pushes from `<button>`s and clicks no anchor), `Skeleton`, route shells.
- **Design tokens**, **34 optimized images** (2.8 MB), **perf pass** (201 -> 165 kB).
- **Responsiveness pass** — every fixed ratio, type scale and grid now steps at
  `sm`/`md`/`lg`; heroes on `svh`; `xl` buttons and `SheetContent` fixed at the
  shared component. Verified at 375/768/1440 on all seven routes: no
  user-reachable horizontal scroll (`scrollX` stays 0).
- **Google reviews carousel** — `Testimonials` upgraded in place: server shell +
  `ReviewsCarousel` client leaf, 8 dummy reviews, 1-up mobile / 3-up desktop.

## Next Up

Nothing scoped. `context/prompts/final-changes.md` is delivered.

## Open Questions

- **Three doctor portraits are identifiable real people**, marks intact ("Erin
  Gilbert, MD", "Dr. Yusuf Yildirim", "© Doctor Mike Varshavski") — instructed to
  use all five as supplied; swap in licensed ones before any real send.
- **LCP on `/` (~4.6 s) is a script-count problem** — 0 ms load delay, ~4.1 s
  render delay charged to a dozen critical scripts.
- **Scroll smoothness is untouched, with measured cost** — `.grain-overlay` (fixed,
  `multiply`, `app/globals.css:145`) recomposites every frame and compounds with
  Lenis, as do `md:bg-fixed` and `animate-kenburns`. rAF frame-drop samples vary
  7–14% between runs of the *same* build, so only a DevTools trace settles it.
- **`clinic.address` is Mayfair, London** though the repo is `Demo-website-dubai`
  (the phone regex in `lib/consultation.ts` is international, so the swap is safe);
  `clinic.whatsapp` is a placeholder; the map has no API key.
- **The five `loading.tsx` shells never render** — they paint only when a segment
  *suspends*, and every route is prerendered. Kept at ~1 kB for whenever that ends.

## Architecture Decisions

- **Page bodies are server; interactivity lives in client leaves.** **`BookButton`
  declares no directive on purpose** — hookless, it stays server on the four server
  pages and only compiles into client parents, keeping sonner out of their chunks.
- **Above-fold entrances are CSS (`FadeUp`); below-fold reveals stay on Motion** —
  its `initial` serialises as inline `style="opacity:0"` clearing only on hydration,
  which left 39 elements invisible at first paint. Speed Index on `/`: 3.3 -> 2.0 s.
- **`/gallery` is a layout exception, no longer a design island.** The styling
  isolation was reversed on request — tokens and `cn` throughout, `cx.ts` deleted.
  The root-layout escapes remain, and are still the hard part: `.grain-overlay` at
  `z-index: 41` (the surface is `fixed inset-0 z-50`, and `multiply` never blends
  what is drawn after it); **Lenis**, needing `data-lenis-prevent` *plus*
  `__lenis.stop()` (its `isStopped` branch still calls `preventDefault`); and a
  nested `LazyMotion features={domMax}`, which *augments* the strict `domAnimation`
  registry that excludes the projection engine `drag` uses.
- **Gallery layout invariants — there are two, and only one was written down.**
  1. *Seam:* grid-body padding must be exactly half the gap **per axis**. `GridBody`
     stamps copies with no gap between them, so two half-gaps meet at each seam; the
     axes differ (`gap-x-14`/`px-7`, `gap-y-7`/`py-3.5`) because halving tile height
     without halving the vertical gap left the wall reading as mostly empty ground.
  2. *Coverage:* `gridW - blockW >= viewportW` and `gridH - blockH >= viewportH`.
     Each axis wraps at **one block**, so the copies left over have to fill the
     screen. A hardcoded 2x2 assumed one block was screen-sized; a mobile block is
     800x358 against an 812px phone, so dragging up ran the wall out with ~450px of
     bare background — and 1920px-wide monitors were short horizontally too. The
     copy count is now derived: `ceil(viewport / block) + 1` per axis, measured off
     one block and the `h-dvh` frame, re-run by the same `ResizeObserver`. Provision
     against `max(frame, window.innerHeight)` so a retracting address bar cannot eat
     the slack. Costs 6-9 blocks instead of 4; `/gallery` still scores 95.
  Also: every tile is one 4:3 box (7 of 8 sources are 3:2, so a wide frame crops
  ~11% against the ~55% a 2:3 tile threw away), and `grid-cols-2` compiles to
  `minmax(0, 1fr)`, whose 0 floor collapses columns in a `w-fit` grid.
- **The lightbox is a child of the gallery surface, never a portal.** The surface
  is `fixed z-50`, so it is its own stacking context and a child at `z-[70]` clears
  everything; a `document.body` portal would escape both that and
  `data-lenis-prevent`. Click-vs-drag is a 6px pointer-travel threshold on the
  tile, **not** a shared dragging flag — Motion's `onDragEnd` fires on pointerup,
  before the browser's `click`, so the flag is already false. Tiles in every stamped
  copy after the first are `tabIndex={-1}`: they sit in `aria-hidden` subtrees.
- **Images:** `lib/images.ts` exports static imports (bare paths generate candidates
  to w=3840 and upscale sources); decorative backgrounds are `next/image` with
  `alt=""`, except the two CTA bands, CSS for `md:bg-fixed`. **One `priority` image
  per route, only where the LCP is an image** — the Hero's first slide is `eager`,
  not `priority` (the `<h1>` is the LCP on `/`; its preload delayed the stylesheet
  28 -> 96 ms). **`MediaImage` unmounts its blur layer** or ~40 stay composited.
- **Home carousel portraits sit outside `AnimatePresence`** — all five in the DOM
  crossfading on opacity, else each 5.5 s rotation refetches and pops; all are
  `alt="" aria-hidden`. This is the pattern the reviews carousel copies.
- **Cards-per-view is CSS, not JS.** `ReviewsCarousel` always renders three slots
  and hides two below `md`. There is no `useMediaQuery` in the repo, and a
  `matchMedia`-in-state version disagrees with the prerendered HTML on first paint.
  Its `aria-live` is `off` while auto-rotating and `polite` once paused — a live
  region that swaps itself every 5.5 s reads the set aloud on a loop.
- **Horizontal overflow here is measured, not inferred.** `documentElement
  .scrollWidth` overreports by 4–22 px on routes with off-screen `Reveal`s, because
  `Reveal` translates on `x` before it fires. `body { overflow-x: hidden }`
  propagates to the viewport, so none of it is reachable — the honest test is
  `scrollTo(400, 0)` then reading `scrollX`, which stays 0 on every route.
- **The consultation form is hand-rolled, not react-hook-form + zod** — 7 fields,
  no async rules and no schema to share, against ~27 kB on a tracked budget;
  `lib/consultation.ts` is pure. `SUBMIT_DELAY_MS = 600` fakes pending (there is no
  submit target, by design). **Both dropdowns are native `<select>`s**: shadcn's is
  ~18–20 kB of Radix over a better mobile picker. **`/book` prerenders because
  `useSearchParams` sits under a `<Suspense>` whose fallback is the real form.**
- **Misc:** App Router + TS at the repo root (the FastAPI backend was deleted);
  generated slug unions (`as const satisfies`) make a missing portrait fail
  `typecheck`, with deliberately **no `/doctors/[slug]` route**; `RouteTransition`
  is Lenis-aware and an incoming hash scrolls to its section; `lib/use-site-nav.ts`
  is the one nav handler; the Radix `Sheet` is `next/dynamic` `ssr: false` behind a
  static hamburger; Lenis starts once in `SmoothScroll.tsx`; Tailwind at v3.4.

## Session Notes

- Next.js 15 + React 19 + TS strict + Tailwind 3.4 + Motion.dev + Lenis; `npm run
  dev`/`build`/`start`/`lint`/`typecheck`; `@/*` → root; data in `lib/data/site`.
- **Never judge load time from `npm run dev`** — dev `main-app.js` was 7.6 MB
  against 201 kB First Load JS in production. Benchmark with `build && start`.
- **Use the Lighthouse mobile preset, median of 3** (desktop said 98/100 while the
  site was slow) — pre-`/doctors`: `/` 82, `/treatments` 83, `[slug]` 87, CLS 0.
- **Headless Chrome catches what HTML checks cannot**, but **`--window-size` alone
  does not emulate mobile** — it crops; use `Emulation.setDeviceMetricsOverride`
  (puppeteer-core `setViewport` with `isMobile`/`hasTouch`, driving the installed
  Chrome — no browser download).
- **`next dev` and `next build` share `.next` and corrupt each other.** A build
  while the dev server is up leaves `next start` throwing
  `Cannot find module ./vendor-chunks/*`. Stop the dev server, `rm -rf .next`,
  rebuild. Benchmark on a spare port so nothing races for 3000.
