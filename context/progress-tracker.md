# Progress Tracker

Current state only. Update after every meaningful change; trim session narrative
once its outcome lands in Completed or Architecture Decisions.

## Status

**Prototype.** Home, Treatments (+10 detail pages), Doctors and Gallery are built
and live. Nothing in flight. Next unit: **Contact** — the last `navLinks` entry
still pointing at the footer anchor. Last verification (2026-08-15, after
Gallery): `typecheck`, `lint`, `build` clean; **17** static pages; `/gallery`
prerendered at 19.8 kB / 181 kB; shared First Load JS 102 kB; all five route
types 200, unknown slug 404s.

## Completed

- **Home** — Hero (3-image ken-burns slideshow), About, Signature Treatments
  (bento), Doctors carousel, Testimonials + Google rating, CTA band, Map, Footer.
- **Treatments + 10 detail pages** — one `TreatmentDetailPage` template driven
  entirely by the `Treatment` record, so an 11th treatment is a data edit plus
  two images. All prerender with `dynamicParams = false`.
- **Doctors (`/doctors`)** — hero, ethos + stats band, five alternating
  full-width profiles, "How we work" band, CTA band, Map, Footer. Server
  component; the Home carousel now uses the real portraits and links here.
- **Gallery (`/gallery`)** — infinite drag + wheel wall of 8 curated images
  (21st.dev `infinite-drag-scroll`, masonry). Design-isolated: no Navbar, Footer,
  Map, hero, shared component or token. All under `app/gallery/`.
- **Design system** (tokens in `app/globals.css` + `tailwind.config.ts`), **34
  optimized images** (2.8 MB), **performance pass** (First Load JS 201 -> 165 kB).

## Next Up

1. **Contact page**; then widen `SupportedRoute`
   (`"/" | "/treatments" | "/doctors" | "/gallery"`) and swap its `navLinks`
   entry over, the way Doctors moved off `{ to: "/", scroll: "#doctors" }`.
2. **Lighthouse mobile (median of 3) on `/doctors` and `/gallery`.**
3. **`/gallery` interactions unexercised** (static layout is verified) — drag
   inertia, wheel handler, `ResizeObserver` re-measure across `md:`, and
   `dragTransition.restDelta: 0` (raise to `0.001` if the inertia rAF never
   idles). **`/doctors` responsive blocks unverified visually** at 375/768/1440.
4. Run `/plugin` — the four declared plugins need a repo-trust confirmation.

## Open Questions

- **Three of the five doctor portraits are identifiable real people**, marks
  intact (coat embroidery "Erin Gilbert, MD"; badge "Dr. Yusuf Yildirim"; a
  "© Doctor Mike Varshavski" watermark). Raised before implementation; the
  instruction was to use all five as supplied, cropped 4:5. Swap in licensed or
  generated portraits before any real cold-email send. (`Dr. Amara Okafor` was
  also renamed `Dr. Rami Haddad` to match the photos — revert freely.)
- **Scroll smoothness is untouched, with measured cost** — `.grain-overlay`
  (fixed, full-viewport, `multiply`, `app/globals.css:145`) recomposites every
  frame and compounds with Lenis; `md:bg-fixed` and infinite `animate-kenburns`
  do the same. *Scroll* costs, so they never hit LCP/TBT.
- **LCP on `/` (~4.6 s) is a script-count problem** — the hero `<h1>` has 0 ms
  load delay and ~4.1 s render delay charged to a dozen critical scripts.
- **`context/ui-context.md` is stale** where it calls the map/footer overlap
  deliberate; that overlap was removed. **`clinic.address` is Mayfair, London**
  while the repo is `Demo-website-dubai`. The map is a placeholder, booking a
  sonner toast — no API key or form in the prototype.

## Architecture Decisions

- **Next.js App Router + TypeScript at the repo root** — the FastAPI backend was
  deleted, so nothing justified a monorepo shell.
- **Page bodies are server components; interactivity lives in client leaves** —
  `ToastButton` / `ScrollButton` forward every `ButtonProps`; `BOOKING_TOAST` is
  the one source seven call sites share. `Hero`, `Doctors`, `Navbar`, `Footer`
  and `Reveal` stay client.
- **Above-fold entrances are CSS; below-fold reveals stay on Motion.** Motion's
  `initial` serialises as inline `style="opacity:0"` and only clears on hydration,
  which left 39 elements invisible at first paint. `components/site/FadeUp.tsx`
  ships no JS, uses `both` fill, and is pinned finished under reduced-motion.
  Speed Index on `/`: 3.3 -> 2.0 s. Motion loads via `LazyMotion` + `m`.
- **`/gallery` is a design island; the root layout was the hard part.** Four
  globals escaped without editing them: (1) `.grain-overlay` at `z-index: 41` —
  the surface is `fixed inset-0 z-50`, and `multiply` never blends what is drawn
  after it; (2) `body` bg/color/font, set inline since they inherit; (3) **Lenis**
  — `data-lenis-prevent` *plus* `__lenis.stop()`, because the `isStopped` branch
  still calls `preventDefault`; (4) a nested `LazyMotion features={domMax}`
  *augments* the strict `domAnimation` registry, which excludes the projection
  engine `drag` needs. Verified in the build: the drag engine and gallery CSS
  load on no other route, and nav uses `router.push` so nothing prefetches.
- **The gallery is a curated edit of 8.** All 34 looked broken: four backgrounds
  are flat swatches, and 19 sources are landscape where `object-cover` in a 2:3
  tile threw away ~55% of the width — hence two tile ratios (2:3 / 4:3, uniform
  width so one `sizes` serves both) plus a per-image `focus`. Portraits are out.
- **`1fr` ≠ `minmax(0, 1fr)`** — Tailwind's `grid-cols-2` compiles to the latter,
  whose 0 floor collapses columns in a `w-fit` grid. Invisible until rendered.
- **Two gallery invariants.** Grid-body padding must be exactly half the gap
  (`gap-14`/`p-7`, `md:gap-28`/`md:p-14`) — `GridBody` stamps four copies with no
  gap, so two half-gaps meet at each seam. And the 60% offset must land on the
  short tiles: rows size to their tallest item, so landscapes take even positions
  to hold every row at 384px. Tile entrance is a route-scoped CSS keyframe, not
  Motion `initial` (144 inline `opacity:0` in the prerendered HTML).
- **Images:** decorative backgrounds are `next/image` (`alt=""` + `aria-hidden`),
  except the two CTA bands which stay CSS for `md:bg-fixed`; `lib/images.ts`
  exports static imports, since bare paths generate candidates to w=3840 and
  upscale sources (`deviceSizes` capped 1200); AVIF measured — same FCP/LCP,
  64 KB lighter. **One `priority` image per route, only where the LCP is an
  image** — the Hero's first slide is `eager` but not `priority` (the `<h1>` is
  the LCP on `/`; the preload delayed the stylesheet 28 -> 96 ms).
- **Slug unions are generated from the data** — `as const satisfies readonly
  Treatment[]` / `Doctor[]` drives `TreatmentSlug`, `generateStaticParams` and the
  image `Record` checks, so a missing portrait fails `typecheck`; `slug` stays
  `string` and array fields `readonly`, to break circularity. Deliberately **no
  `/doctors/[slug]` route**.
- **Home carousel portraits sit outside `AnimatePresence`** — all five in the DOM
  crossfading on opacity, else each 5.5 s rotation refetches and pops; the detail
  pane keeps it. All five are `alt="" aria-hidden` (opacity-0 does not hide from
  a11y); `/doctors` portraits keep real `alt`.
- **The mobile menu panel is code-split; its trigger is not** — the Radix `Sheet`
  sits behind `next/dynamic` `ssr: false`, but `Navbar` owns the hamburger and
  `menuOpen`, and warms the chunk on idle.
- **Nav links are route-aware** — `to` required on non-`soon` links;
  `lib/use-site-nav.ts` is the one handler `Navbar` and `Footer` share.
  **`RouteTransition.tsx`** replaces `ScrollToTop`, Lenis-aware
  (`__lenis.scrollTo(0, { immediate: true })`); an incoming hash scrolls to its
  section, which is how cross-page nav links land on target.
- **Misc:** footer sits outside `<main>`, below a separate `MapSection`; Lenis is
  initialised once in `SmoothScroll.tsx` so the root layout stays a server
  component; fonts via `next/font/google` (Fraunces variable, `opsz`); Tailwind
  held at v3.4; ESLint flat config; shadcn/ui plus Vengeance UI (`@vengeanceui`).
  **Removed:** the FastAPI + MongoDB backend, `.emergent/`, PostHog, `tests/`.

## Session Notes

- Next.js 15 + React 19 + TS strict + Tailwind 3.4 + Motion.dev + Lenis. `npm run
  dev` / `build` / `start` / `lint` / `typecheck`. Alias `@/*` → root. All content
  is static dummy data in `lib/data/site.ts`.
- **Never judge load time from `npm run dev`** — dev `main-app.js` was 7.6 MB
  against 201 kB First Load JS in production. Benchmark with `build && start`.
- **Use the Lighthouse mobile preset, median of 3** — desktop reported 98/100
  while the site was genuinely slow. Screenshot diffs of `/` need a ~2.2% noise
  floor (auto-rotating carousels). Current numbers predate the Doctors page:
  `/` 82 (FCP 2.0 s, LCP 4.6 s, SI 2.0 s, TBT 40 ms), `/treatments` 83
  (LCP 4.2 s), `[slug]` 87 (LCP 3.8 s), CLS 0.
- **Headless Chrome is worth reaching for** — `chrome.exe --headless=new
  --screenshot=out.png --window-size=W,H --virtual-time-budget=6000 <url>` caught
  the `minmax(0, 1fr)` collapse the HTML checks could not see. Gallery at
  1500x1600: ~114 px gutters both axes, rows 384 px, seam indistinguishable.
  Pre-migration code is in git history at `5f60112`, under `frontend/`.
