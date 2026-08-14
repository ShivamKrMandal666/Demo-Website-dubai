# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In progress — prototype phase. Home, Treatments and the ten individual
  treatment pages are built on the Next.js stack. Three pages still to build.

## Current Goal

- Nothing in flight. The Treatments page and the dynamic treatment detail
  template are live and verified; a performance pass landed on top of them.
  The next unit is the Doctors page.

## Completed

- **Home page** (2026-08-14) — all seven sections: Hero (3-image ken-burns
  slideshow), About, Signature Treatments (bento grid), Doctors (auto-rotating
  carousel), Testimonials + Google rating block, CTA band, Map, Footer.
- **Design system** — full token set in `app/globals.css` and
  `tailwind.config.ts`; documented in `context/ui-context.md`.
- **29 optimized images** in `public/images/` (2.5 MB) across `treatments/`,
  `heroes/` and `backgrounds/`.
- **Migration to the intended stack** (2026-08-14) — see Architecture
  Decisions below. Verified: `tsc --noEmit` clean, `npm run build` passes,
  all 29 images confirmed byte-identical to the pre-migration commit.
- **Treatments page + 10 detail pages** (2026-08-14) — see the section below.
- **Performance pass** (2026-08-14) — see the section below.
- **Tooling** — UI UX Pro Max, Impeccable, Superpowers and Feature Dev declared
  in `.claude/settings.json`; Vengeance UI registered as a shadcn registry in
  `components.json` alongside shadcn/ui.

### Treatments unit (2026-08-14)

1. **Routed the parked components.** `app/treatments/page.tsx` and
   `app/treatments/[slug]/page.tsx` are thin **server** wrappers that own
   `metadata` / `generateMetadata`; the client page components live on in
   `components/treatments/`. `generateStaticParams` maps `treatmentSlugs`, and
   `dynamicParams = false` plus a `getTreatmentBySlug` guard `notFound()`s any
   unknown slug. All ten details pages prerender (SSG); `/treatments` is static.
2. **One template, ten pages.** `TreatmentDetailPage` takes only `slug` and
   reads every field — hero, card image, overview, how, benefits, at-a-glance
   facts, timeline, CTA — off the `Treatment` record. Adding an 11th treatment
   is a data edit plus two images, no new markup.
3. **`next/image` everywhere.** The three `<img>` tags (grid card, detail image
   block, "other treatments" cards) are now `<Image fill>` with per-span
   `sizes`. Hero/CTA backgrounds stay CSS `background-image` — they are
   decorative scrimmed layers, not content.
4. **Home Signature Treatments now uses the real images.** It was still
   rendering dashed `ImageIcon` placeholders and inert `<article>` cards. It
   now filters `home: true` (rather than hard-indexing `treatments[0..4]`),
   renders `treatmentCardImage(slug)` through `next/image`, and each card is a
   `Link` to its detail page. A "View all ten treatments" link closes the
   section.
5. **Map / footer overlap removed** — see Architecture Decisions.
6. **Cross-page navigation** — see Architecture Decisions.

### Performance pass (2026-08-14)

Triggered by `context/prompts/solve-slow.md`. Profiled first, then fixed in
measured-impact order. **The reported slowness was mostly the dev server:**
`.next` held a dev build whose `main-app.js` was 7.6 MB and whose
`app/treatments/page.js` was 4.9 MB, against 201 kB First Load JS in
production — roughly 60x. Production was already 98/100 on the Lighthouse
desktop preset. On the **mobile** preset (4x CPU throttle + slow 4G) it was
genuinely slow, and that is what the pass targeted.

**Results** (build table is exact; Lighthouse mobile, after = median of 3):

| | before | after |
|---|---|---|
| First Load JS `/` | 201 kB | **165 kB** |
| First Load JS `/treatments`, `[slug]` | 196 kB | **160 kB** |
| `/treatments` page chunk | 3.07 kB | **444 B** |
| `[slug]` page chunk | 3.48 kB | **307 B** |
| `/` transferred | 1,348 KB | **757 KB** |
| `/` LCP | 6.1 s | **4.5 s** |
| `/` TBT | 200 ms | **53 ms** |
| `/` score | 75 | **82** |
| `[slug]` score / LCP / TBT | 88 / 3.8 s / 110 ms | **89 / 3.5 s / 62 ms** |

CLS stayed 0 throughout.

1. **Motion trimmed to `m` + `LazyMotion`** — the single biggest JS win, 25 kB
   gz off every content route. See Architecture Decisions.
2. **Nine CSS `background-image` layers moved to `next/image`** (seven of
   them; two stay CSS on purpose). See Architecture Decisions.
3. **Two upscaling bugs found and fixed** — see Architecture Decisions.
4. **Section shells returned to Server Components** behind two client leaves,
   `ToastButton` and `ScrollButton`. This is what collapsed the per-route page
   chunks to a few hundred bytes.
5. **Hero loads one slide, not three** — 307 KB of eager JPEG down to a single
   51 KB AVIF, with the next slide warmed one step ahead of the crossfade.
6. **Mobile menu code-split** into `components/site/MobileMenu.tsx` so Radix
   Dialog leaves the initial bundle.

**Verified visually.** Lighthouse full-page screenshots before vs after differ
by 0.947% of pixels, against a measured **2.175% noise floor** (same build
captured twice — the Hero and Doctors carousels auto-rotate, so two captures
never match exactly). Page height identical. Nothing moved.

**Known regression: FCP 0.9 s -> 2.1 s and Speed Index 0.9 s -> 3.3 s on `/`.**
Cause: script requests went 10 -> 13 as server-component splitting and the
dynamic import fragmented the bundle, and Lighthouse's Lantern simulation
charges a slow-4G round trip per request. Two things make this less alarming
than it reads — the old 0.9 s FCP was painting a page whose body text was
entirely invisible (see Open Questions), and the before-number is a single run
taken under lighter machine load. It is still a real regression and is the
first thing to look at if this pass is revisited.

## In Progress

- None.

## Next Up

1. **Doctors page.**
2. **Gallery page** — the only remaining `soon: true` nav link.
3. **Contact page** — currently `#contact` scrolls to the footer.
4. When those ship, widen `SupportedRoute` again and add their nav entries.

## Open Questions

- **The biggest remaining performance problem is untouched, by instruction.**
  39 elements are server-rendered with inline `opacity:0` — Motion's `initial`
  on every `Reveal`, plus the Hero's own entrance animations. The prerendered
  HTML therefore paints almost no readable text until React hydrates: on `/`
  the gap is FCP 2.1 s -> LCP 4.5 s, and the LCP element is the hero `<h1>`
  becoming visible. Fixing it means expressing the above-the-fold entrance as a
  CSS `@keyframes` animation (the `fade-up` keyframe already exists in
  `tailwind.config.ts`) so it starts at first paint instead of after hydration.
  Every frame of the animation would look the same; only its start time moves.
  **Not done because the pass was scoped "pixel-identical, no exceptions".**
  Worth revisiting — it is the single largest remaining win.
- **Declined for the same reason, with measured cost:** `.grain-overlay` is
  `position: fixed`, full-viewport, `mix-blend-mode: multiply`
  (`app/globals.css:145`), which forces a whole-viewport recomposite every
  frame and compounds with Lenis' continuous scroll; `md:bg-fixed` on the two
  CTA bands does the same; and `animate-kenburns` runs `infinite alternate` on
  full-screen backgrounds. These are the dominant *scroll*-smoothness costs
  rather than load costs, so they do not show in LCP/TBT.
- **FCP/Speed Index regressed on `/`** — cause and caveats recorded in the
  Performance pass section above.

- **`context/ui-context.md` is stale on one point.** Its "Layout and rhythm"
  section still describes the map/footer overlap (`-mb-28 md:-mb-40` against
  `pt-40 md:pt-56`) as deliberate design language. That overlap was removed
  this session on explicit instruction; the file was left untouched because
  the same instruction said not to edit it. Reconcile before treating that
  bullet as source of truth.
- **`clinic.address` is Mayfair, London** while the repo is named
  `Demo-website-dubai`. Confirm which city the demo is meant to represent.
- The map is still a **stylised placeholder**, not a Google Maps embed — no
  API key in the prototype. The chip in the corner says so.
- Booking is a **sonner toast**, not a form. Every "Book an Appointment" button
  site-wide fires the same toast.

## Architecture Decisions

- **Next.js App Router + TypeScript at the repo root** (not nested in
  `frontend/`). The FastAPI backend was deleted, so there was no second
  workspace left to justify a monorepo shell; this also matches the folder
  layout already documented in `architecture.md`.
- **Route files are server components; page bodies are server components too,
  with interactivity pushed to client leaves.** *(Supersedes the earlier "page
  bodies are client components" decision, 2026-08-14 performance pass.)* The
  only reason `About`, `Testimonials`, `CtaBand`, `TreatmentsPage` and
  `TreatmentDetailPage` carried `"use client"` was a single `toast()` or
  `scrollToId()` handler, which shipped and hydrated their entire markup.
  Those handlers now live in `components/site/ToastButton.tsx` and
  `components/site/ScrollButton.tsx`, each forwarding every `ButtonProps`
  through so call sites render identical markup. Result: the `/treatments`
  page chunk went 3.07 kB -> 444 B and `[slug]` 3.48 kB -> 307 B. `Hero` and
  `Doctors` stay client (real state machines), as do `Navbar` / `Footer` (nav
  handlers) and `Reveal` (Motion). `BOOKING_TOAST` in `ToastButton.tsx` is now
  the single source for the booking copy that seven call sites shared.
- **Motion.dev is loaded through `LazyMotion` + the `m` component, not
  `motion`.** `components/site/MotionProvider.tsx` mounts
  `<LazyMotion features={domAnimation} strict>` once in the root layout, and
  every animated element imports `* as m from "motion/react-m"`. The default
  `motion` component drags in the layout-projection engine — 85 of the module
  markers in the 70 kB gz chunk that every content route shared — and nothing
  here uses `layout`, `layoutId` or `drag` (verified by grep across
  `components/`, `app/` and `lib/`). This alone took First Load JS from 201 kB
  to 176 kB. `strict` is deliberate: it makes a stray `motion.div` throw rather
  than silently pulling the full bundle back in.
- **Decorative section backgrounds are `next/image`, not CSS
  `background-image`.** *(Supersedes the "hero/CTA backgrounds stay CSS
  `background-image` — they are decorative scrimmed layers, not content" note
  from the Treatments unit.)* Seven layers moved: the three Hero slides, the
  About / Treatments / Testimonial / Footer textures, the Treatments-page hero
  and the per-slug detail hero. They keep their exact wrapper classes and get
  `alt=""` + `aria-hidden`, so they stay decorative — but they now get AVIF,
  `srcset` and lazy loading. **Two exceptions stay CSS on purpose:** the home
  `CtaBand` and the detail-page CTA band both use `md:bg-fixed`, and
  `background-attachment: fixed` has no `next/image` equivalent — keeping the
  desktop parallax outranks the ~41 KB each would save.
- **`lib/images.ts` exports static imports, not string paths.** Two upscaling
  bugs made this necessary, both invisible until measured. (a) With bare string
  paths, `next/image` assumes an unknown source size and generates `srcset`
  candidates to w=3840 — the 900x900 treatment cards were being served at
  3840px, and the `src` fallback pointed at the 3840 variant. (b) The
  backgrounds are 1264x848, so `sizes="100vw"` on a wide viewport asked the
  optimizer to *upscale*: `texture-treatments.jpg` came back at **308 KB from a
  239 KB source**. Static imports plus `deviceSizes` capped at 1200 in
  `next.config.ts` mean no candidate ever exceeds the source. Nothing is lost
  visually — the CSS background was already stretching that same 1264px file
  across the viewport. The `Record<TreatmentSlug, StaticImageData>` maps also
  close the open question below: a slug without an image is now a build error.
- **AVIF is enabled and was measured, not assumed.** Against WebP-only on the
  throttled mobile profile: identical FCP/LCP, 64 KB less transferred. AVIF
  also fixes the one image WebP made *worse* — `texture-treatments.jpg`, a
  noisy linen texture, is +18% under WebP but -22% under AVIF.
- **The Hero's first slide is `loading="eager"` but deliberately NOT
  `priority`.** Lighthouse reports the `<h1>`, not the image, as the LCP
  element on `/`. A `priority` preload measurably delayed the render-blocking
  stylesheet (28 ms -> 96 ms observed) to fetch something that is not the LCP.
  Measured both ways: FCP was identical, so the preload bought nothing.
  The two treatments routes *do* have an image LCP and keep `priority` there.
- **The mobile menu is code-split.** `components/site/MobileMenu.tsx` is
  imported by `Navbar` through `next/dynamic` with `ssr: false`, because
  `@radix-ui/react-dialog` is the only Radix consumer on the site and the menu
  is closed on first paint of every route.
- **Nav links are route-aware.** `SupportedRoute` widened to
  `"/" | "/treatments"`, and on a non-`soon` link `to` is now **required**, not
  optional — the same "make the bug unrepresentable" move the `soon` union
  already made for `scroll`. `lib/use-site-nav.ts` is the single handler shared
  by `Navbar` and `Footer`: same route → `scrollToId`, different route →
  `router.push(to + scroll)`. The footer's treatment list now links to the ten
  detail pages instead of scrolling to `#treatments`.
- **`components/site/RouteTransition.tsx`** replaces the deleted `ScrollToTop`,
  mounted once in the root layout. It is Lenis-aware on purpose: a plain
  `window.scrollTo` leaves the Lenis instance out of sync and the next wheel
  event snaps back, so it calls `__lenis.scrollTo(0, { immediate: true })`. If
  the incoming URL carries a hash it scrolls to that section instead — that is
  how cross-page nav links land on their target.
- **Map and footer are now separate blocks.** `MapSection` lost its negative
  bottom margin and gained normal `py-20 md:py-28` rhythm plus its own
  `SectionLabel` header, so it reads as a section rather than a floating card.
  The footer drops to `pt-20 md:pt-28` and gains `border-t border-gold/20` +
  `shadow-elegant`. The footer also moved **outside** `<main>` on all three
  page shells, which is where it belongs semantically.
- **Tailwind held at v3.4**, config ported verbatim to `tailwind.config.ts`.
  Upgrading to v4 should be its own verified step.
- **Motion.dev (`motion/react`) replaces Framer Motion.** Note that the
  `motion` package depends on `framer-motion` internally — that is how
  Motion.dev ships, not leftover residue.
- **Lenis initialised once** in `components/site/SmoothScroll.tsx`, mounted in
  the root layout, so the root layout stays a server component.
- **Fonts via `next/font/google`** instead of a render-blocking Google Fonts
  `<link>`. Fraunces is loaded as a variable font (`opsz` axis, normal +
  italic) — `next/font` rejects an explicit weight list alongside `axes`.
- **Dependencies pruned hard.** 392 packages installed. `components.json` is
  retained so any shadcn component is one `npx shadcn add` away.
- **ESLint on the flat config** (`eslint.config.mjs`), with `lint` running
  `eslint .` rather than the deprecated `next lint` wrapper.
- **Component libraries going forward:** shadcn/ui (existing) plus Vengeance
  UI, registered as `@vengeanceui` in `components.json` — installed via
  `npx shadcn add @vengeanceui/<name>`, not npm.
- **Removed:** the FastAPI + MongoDB backend, `.emergent/`, the Emergent
  plugins, the PostHog snippet, `tests/`, `test_reports/`, `test_result.md`,
  `scripts/optimize_images.py`, and — this session —
  `components/treatments/README.md`, which described a parked state that no
  longer exists. Analytics stays out until post-approval, per
  `project-overview.md`.
- **Dead code dropped:** `useSiteNav`, `ScrollToTop`, `constants/testIds/` and
  `use-toast`. The first two are back, rebuilt for the App Router as
  `lib/use-site-nav.ts` and `components/site/RouteTransition.tsx`.

## Session Notes

- Stack is Next.js 15 (App Router) + React 19 + TypeScript strict + Tailwind
  3.4 + Motion.dev + Lenis. `npm run dev` / `build` / `start` / `lint` /
  `typecheck`.
- Path alias is `@/*` → repo root.
- The pre-migration code is preserved in git history at commit `5f60112` under
  `frontend/`, if a behaviour needs checking against the original.
- All content is static dummy data in `lib/data/site.ts` (typed:
  `Clinic`, `NavLink`, `Treatment`, `Doctor`, `Testimonial`, `GoogleRating`).
  Ten treatments; five carry `home: true` and populate the Home bento grid.
- `treatmentSlugs` in `lib/images.ts` is still hand-maintained and **not**
  derived from the `treatments` array in `lib/data/site.ts` — that half of the
  mismatch risk remains. The *image* half is now closed: the
  `Record<TreatmentSlug, StaticImageData>` maps make a slug without a card or
  hero image a `tsc` error.
- **Never judge load time from `npm run dev`.** Dev chunks are unminified,
  unsplit and carry the HMR runtime: `main-app.js` was 7.6 MB in dev against
  201 kB First Load JS for the whole route in production. Benchmark with
  `npm run build && npm start` only.
- Lighthouse's **desktop** preset barely throttles and reported 98/100 while
  the site was genuinely slow on mobile. Use the default **mobile** preset
  (4x CPU + slow 4G) when judging this site.
- Comparing screenshots of `/` needs a noise floor: the Hero slideshow (5 s)
  and Doctors carousel (5.5 s) auto-rotate, so two captures of the *same*
  build differ by ~2.2% of pixels. Anything at or under that is unchanged.
- Last verification (2026-08-14): `typecheck` clean, `lint` clean, `build`
  passes with 15 static pages. Production server checked on every route —
  `/` 200, `/treatments` 200, all ten `/treatments/[slug]` 200, unknown slug
  404. Home renders exactly the five `home: true` card images; `/treatments`
  renders all ten.
- Before starting the next unit, run `/plugin` to confirm the four declared
  plugins actually installed — they are declared in `.claude/settings.json` but
  install on repo trust, which needs a user confirmation.
