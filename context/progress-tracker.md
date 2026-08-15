# Progress Tracker

Current state only. Update after every meaningful change; trim session narrative
once its outcome lands in Completed or Architecture Decisions.

## Status

- **Prototype.** Home, Treatments and the ten treatment detail pages are built,
  verified and live. Nothing in flight. Next unit: the Doctors page.

## Completed

- **Home page** — Hero (3-image ken-burns slideshow), About, Signature
  Treatments (bento grid), Doctors (carousel), Testimonials + Google rating,
  CTA band, Map, Footer.
- **Treatments page + 10 detail pages** — one `TreatmentDetailPage` template
  driven entirely by the `Treatment` record for its slug, so an 11th treatment
  is a data edit plus two images. All ten prerender (SSG) with
  `dynamicParams = false`; an unknown slug 404s.
- **Design system** — token set in `app/globals.css` + `tailwind.config.ts`,
  documented in `context/ui-context.md`.
- **29 optimized images** in `public/images/` (2.5 MB).
- **Performance pass** — First Load JS 201 kB -> 165 kB on `/`, 196 kB -> 160 kB
  on the treatments routes.
- **Review fixes** (`context/prompts/current-issue.md`) — first paint, mobile nav
  trigger, slug typing, image preloads. All four are recorded below.
- **Tooling** — UI UX Pro Max, Impeccable, Superpowers and Feature Dev declared
  in `.claude/settings.json`; Vengeance UI registered as a shadcn registry.

## Next Up

1. **Doctors page.**
2. **Gallery page** — the only remaining `soon: true` nav link.
3. **Contact page** — currently `#contact` scrolls to the footer.
4. When those ship, widen `SupportedRoute` and add their nav entries.

## Open Questions

- **Scroll smoothness is untouched, with measured cost.** `.grain-overlay` is
  `position: fixed`, full-viewport, `mix-blend-mode: multiply`
  (`app/globals.css:145`), forcing a whole-viewport recomposite every frame and
  compounding with Lenis; `md:bg-fixed` on the two CTA bands does the same; and
  `animate-kenburns` runs `infinite alternate` on full-screen backgrounds. These
  are *scroll* costs, so they never show up in LCP/TBT.
- **LCP on `/` (~4.6 s) is now purely a script-count problem.** The LCP element
  (hero `<h1>`) has 0 ms load delay and ~4.1 s *render* delay under Lantern's
  slow-4G simulation, charged against the dozen scripts in the critical path.
  Cutting requests, not painting earlier, is the only lever left.
- **`context/ui-context.md` is stale on one point** — its "Layout and rhythm"
  section still calls the map/footer overlap deliberate design language. That
  overlap was removed; the file was left untouched on instruction. Reconcile
  before treating that bullet as source of truth.
- **`clinic.address` is Mayfair, London** while the repo is named
  `Demo-website-dubai`. Confirm which city the demo represents.
- The map is a **stylised placeholder**, not a Google Maps embed — no API key in
  the prototype. Booking is a **sonner toast**, not a form.

## Architecture Decisions

- **Next.js App Router + TypeScript at the repo root**, not nested in
  `frontend/` — the FastAPI backend was deleted, so nothing justified a monorepo
  shell.
- **Page bodies are server components; interactivity lives in client leaves.**
  `About`, `Testimonials`, `CtaBand`, `TreatmentsPage` and `TreatmentDetailPage`
  each carried `"use client"` for one `toast()` or `scrollToId()` handler, which
  shipped and hydrated their whole markup. Those handlers are now
  `ToastButton.tsx` / `ScrollButton.tsx`, forwarding every `ButtonProps` so call
  sites render identical markup; `BOOKING_TOAST` is the single source for the
  booking copy seven call sites share. `Hero` and `Doctors` stay client (real
  state machines), as do `Navbar` / `Footer` and `Reveal`.
- **Above-the-fold entrances are CSS; below-the-fold reveals stay on Motion.**
  Motion's `initial={{ opacity: 0 }}` serialises into the prerendered HTML as
  inline `style="opacity:0"` and only clears on hydration, which left 39
  server-rendered elements — the hero `<h1>` among them — invisible at first
  paint. `components/site/FadeUp.tsx` (no `"use client"`, ships no JS) runs the
  `fade-up` keyframe instead, same easing curve, starting at first paint. **Below
  the fold keeps `Reveal`:** `whileInView` is a real scroll trigger, and a CSS
  animation with none would finish before the user scrolled to it. `fade-up` uses
  `both` fill mode so a staggered element holds at the 0% keyframe during its
  `animation-delay`, and `app/globals.css` pins `.animate-fade-up` to its
  finished state under `prefers-reduced-motion: reduce` so content is never
  stranded invisible. Speed Index on `/`: 3.3 s -> 2.0 s.
- **Motion.dev loads through `LazyMotion` + `m`, never `motion`.**
  `MotionProvider.tsx` mounts `<LazyMotion features={domAnimation} strict>` once
  in the root layout; animated elements import `* as m from "motion/react-m"`.
  The default `motion` drags in the layout-projection engine and nothing here
  uses `layout` / `layoutId` / `drag` — worth 25 kB gz per content route.
  `strict` makes a stray `motion.div` throw instead of quietly restoring it.
- **Decorative section backgrounds are `next/image`, not CSS
  `background-image`** — seven layers, keeping their wrapper classes plus
  `alt=""` + `aria-hidden`, so they stay decorative but gain AVIF, `srcset` and
  lazy loading. **Two stay CSS on purpose:** both CTA bands use `md:bg-fixed`,
  which has no `next/image` equivalent; the parallax outranks ~41 KB each.
- **`lib/images.ts` exports static imports, not string paths.** With bare paths
  `next/image` assumes an unknown source size and generates `srcset` candidates
  to w=3840, so the 900x900 cards were served at 3840px and the 1264x848
  backgrounds were *upscaled* (`texture-treatments.jpg` came back 308 KB from a
  239 KB source). Static imports plus `deviceSizes` capped at 1200 in
  `next.config.ts` mean no candidate ever exceeds the source.
- **The slug union is generated from the treatment data.** `lib/data/site.ts`
  declares `treatments` `as const satisfies readonly Treatment[]` — `satisfies`
  type-checks each entry, `as const` keeps each `slug` literal. `TreatmentSlug`,
  `TreatmentRecord` and `treatmentSlugs` all derive from that array, so renaming
  a treatment updates the union, `generateStaticParams` and the
  `Record<TreatmentSlug, StaticImageData>` check in `lib/images.ts` by itself.
  `treatmentCardImage` / `treatmentHeroImage` take `TreatmentSlug`, so a bad slug
  fails at the call site. `Treatment.slug` stays `string` and `benefits` /
  `timeline` are `readonly` — both break the circularity `as const` would
  otherwise create. Components annotate `TreatmentRecord`, not `Treatment`.
- **AVIF measured, not assumed** — against WebP-only on throttled mobile:
  identical FCP/LCP, 64 KB less transferred, and it fixes the one image WebP made
  worse (`texture-treatments.jpg`, +18% WebP vs -22% AVIF).
- **One `priority` image per route, only where the LCP really is an image.** The
  Hero's first slide is `loading="eager"` but deliberately **not** `priority` —
  the `<h1>` is the LCP on `/`, and the preload delayed the render-blocking
  stylesheet (28 ms -> 96 ms) for something that isn't the LCP. The treatments
  routes do have an image LCP and keep `priority` on their hero. Nothing else
  anywhere gets it.
- **The mobile menu panel is code-split; its trigger is not.** `MobileMenu.tsx`
  holds only the Radix `Sheet` panel, behind `next/dynamic` with `ssr: false` —
  `@radix-ui/react-dialog` is the site's only Radix consumer and the menu is
  closed on first paint. The hamburger **trigger** lives in `Navbar`, because an
  `ssr: false` chunk renders nothing server-side and the trigger's old home there
  meant mobile had no navigation affordance until hydration. `Navbar` owns
  `menuOpen`, passes `open` / `onOpenChange` down, and warms the chunk on
  `requestIdleCallback` (2 s `setTimeout` fallback) so the first tap is instant.
- **Nav links are route-aware.** `SupportedRoute` is `"/" | "/treatments"`, and
  `to` is **required** on a non-`soon` link — the same "make the bug
  unrepresentable" move `soon` already made for `scroll`. `lib/use-site-nav.ts`
  is the one handler shared by `Navbar` and `Footer`: same route → `scrollToId`,
  different route → `router.push(to + scroll)`.
- **`components/site/RouteTransition.tsx`** replaces `ScrollToTop`, mounted once
  in the root layout. Lenis-aware on purpose: a plain `window.scrollTo` desyncs
  the Lenis instance and the next wheel event snaps back, so it calls
  `__lenis.scrollTo(0, { immediate: true })`. An incoming hash scrolls to that
  section instead — that is how cross-page nav links land on target.
- **Map and footer are separate blocks.** `MapSection` has normal
  `py-20 md:py-28` rhythm and its own `SectionLabel`; the footer is
  `pt-20 md:pt-28` with `border-t border-gold/20` + `shadow-elegant`, and sits
  **outside** `<main>` on all three page shells.
- **Lenis initialised once** in `SmoothScroll.tsx`, mounted in the root layout,
  so the root layout stays a server component.
- **Fonts via `next/font/google`**, not a render-blocking `<link>`. Fraunces is a
  variable font (`opsz` axis, normal + italic) — `next/font` rejects an explicit
  weight list alongside `axes`.
- **Tailwind held at v3.4** (a v4 upgrade should be its own verified step);
  **ESLint on the flat config**, with `lint` running `eslint .` rather than the
  deprecated `next lint`.
- **Motion.dev (`motion/react`) replaces Framer Motion.** The `motion` package
  depends on `framer-motion` internally — that is how it ships, not residue.
- **Component libraries:** shadcn/ui plus Vengeance UI, registered as
  `@vengeanceui` in `components.json` — installed via
  `npx shadcn add @vengeanceui/<name>`, not npm.
- **Removed:** the FastAPI + MongoDB backend, `.emergent/`, the Emergent plugins,
  the PostHog snippet, `tests/`, `test_reports/`, `test_result.md`,
  `scripts/optimize_images.py`, `components/treatments/README.md`,
  `constants/testIds/` and `use-toast`. Analytics stays out until post-approval,
  per `project-overview.md`.

## Session Notes

- Next.js 15 (App Router) + React 19 + TypeScript strict + Tailwind 3.4 +
  Motion.dev + Lenis. `npm run dev` / `build` / `start` / `lint` / `typecheck`.
  Path alias `@/*` → repo root.
- All content is static dummy data in `lib/data/site.ts` (`Clinic`, `NavLink`,
  `Treatment`, `Doctor`, `Testimonial`, `GoogleRating`). Ten treatments; five
  carry `home: true` and populate the Home bento grid.
- Pre-migration code is preserved in git history at commit `5f60112` under
  `frontend/`, if a behaviour needs checking against the original.
- **Never judge load time from `npm run dev`** — dev chunks are unminified,
  unsplit and carry the HMR runtime (`main-app.js` was 7.6 MB in dev against
  201 kB First Load JS in production). Benchmark with `build && start` only.
- **Use the Lighthouse mobile preset**, median of 3. Desktop barely throttles and
  reported 98/100 while the site was genuinely slow; single runs swing 5+ points
  and a full second of LCP on this machine.
- Screenshot comparisons of `/` need a ~2.2% noise floor — the Hero (5 s) and
  Doctors (5.5 s) carousels auto-rotate, so two captures of the same build differ.
- Last verification (2026-08-15): `typecheck`, `lint` and `build` clean, 15
  static pages, every route 200 and an unknown slug 404. Served HTML carries the
  mobile trigger, a visible hero `<h1>` and one image preload on all three route
  types. Lighthouse mobile, median of 3 — `/` 82 (FCP 2.0 s, LCP 4.6 s, SI 2.0 s,
  TBT 40 ms), `/treatments` 83 (LCP 4.2 s), `[slug]` 87 (LCP 3.8 s), CLS 0.
- Before the next unit, run `/plugin` to confirm the four declared plugins
  installed — they need a repo-trust confirmation.
