# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In progress — prototype phase. Home page built; stack migrated to the
  intended Next.js stack. Four of five pages still to build.

## Current Goal

- Nothing in flight. The Next.js migration is complete and verified; the next
  unit is the Treatments page and the individual treatment pages.

## Completed

- **Home page** (2026-08-14) — all seven sections: Hero (3-image ken-burns
  slideshow), About, Signature Treatments (bento grid), Doctors (auto-rotating
  carousel), Testimonials + Google rating block, CTA band, Map + Footer overlap.
- **Design system** — full token set in `app/globals.css` and
  `tailwind.config.ts`; now documented in `context/ui-context.md`.
- **29 optimized images** in `public/images/` (2.5 MB) across `treatments/`,
  `heroes/` and `backgrounds/`.
- **Migration to the intended stack** (2026-08-14) — see Architecture
  Decisions below. Verified: `tsc --noEmit` clean, `npm run build` passes,
  `/` prerendered static at 191 kB First Load JS, all 29 images confirmed
  byte-identical to the pre-migration commit, production server renders every
  section with fonts, textures and brand utilities intact.
- **Tooling** — UI UX Pro Max, Impeccable, Superpowers and Feature Dev declared
  in `.claude/settings.json`; Vengeance UI registered as a shadcn registry in
  `components.json` alongside shadcn/ui.

## In Progress

- None.

## Next Up

1. **Treatments page** — route `components/treatments/TreatmentsPage.tsx` as
   `app/treatments/page.tsx`.
2. **Individual treatment pages** — route
   `components/treatments/TreatmentDetailPage.tsx` as
   `app/treatments/[slug]/page.tsx`, with `generateStaticParams` over the ten
   slugs; swap its `null` return for `notFound()`.
3. **Fix the dead nav links** (see Open Questions) — needed before the
   Treatments link has anywhere to go.
4. **Fix the Home footer/map overlap** — the map's `-mb-28 md:-mb-40` against
   the footer's `pt-40 md:pt-56` doesn't sit correctly at all breakpoints.
5. Remaining pages: Doctors, Gallery, Contact.

## Open Questions

- **Nav links — fixed.** `NavLink` is now a discriminated union: a link is
  either `soon: true` or carries a required `scroll` target, so `Navbar` and
  `Footer` call `scrollToId(link.scroll)` with a guaranteed value and the
  inert Home / Treatments / Doctors / Contact links work. `to` is typed as
  `SupportedRoute` (`"/"` only). When `/treatments` ships, widen
  `SupportedRoute` and add route-aware navigation for cross-page links.
- **Parked Treatments components.** `components/treatments/` holds fully
  ported, typed page components that are deliberately **not** under `app/`, so
  no new routes are live. See `components/treatments/README.md` for the
  checklist to route them.
- `<img>` tags in the parked components should become `next/image` when routed.
- Scroll-to-top on route change was dropped with `react-router-dom` and needs
  re-adding (Lenis-aware) once there is more than one route.

## Architecture Decisions

- **Next.js App Router + TypeScript at the repo root** (not nested in
  `frontend/`). The FastAPI backend was deleted, so there was no second
  workspace left to justify a monorepo shell; this also matches the folder
  layout already documented in `architecture.md`.
- **Tailwind held at v3.4**, config ported verbatim to `tailwind.config.ts`.
  The migration's bar was "visitor cannot tell the difference", and a v4
  CSS-first rewrite of every token, gradient and keyframe would have risked
  silent visual drift. Upgrading to v4 should be its own verified step.
- **Motion.dev (`motion/react`) replaces Framer Motion.** Only three files
  imported it (`Reveal`, `Hero`, `Doctors`), and the API is identical, so every
  duration, delay, easing array and variant was copied unchanged. Note that the
  `motion` package depends on `framer-motion` internally — that is how
  Motion.dev ships, not leftover residue.
- **Lenis initialised once** in `components/site/SmoothScroll.tsx`, mounted in
  the root layout, so the root layout stays a server component.
- **Server components by default**; `"use client"` only on Hero, Doctors,
  About, Testimonials, CtaBand, Navbar, Footer, Reveal and SmoothScroll — i.e.
  where state, event handlers or Motion require it. `page.tsx`, `layout.tsx`,
  `Treatments` and `MapSection` are server components.
- **Fonts via `next/font/google`** instead of a render-blocking Google Fonts
  `<link>`. Fraunces is loaded as a variable font (`opsz` axis, normal +
  italic) — `next/font` rejects an explicit weight list alongside `axes`.
- **Dependencies pruned hard.** Only `button`, `sheet` and `sonner` of the 48
  generated shadcn components were used, so the rest were dropped along with
  ~30 unused Radix packages, react-router-dom, react-query, axios, swr,
  recharts, embla, react-hook-form, zod, lodash, date-fns, dayjs, vaul, cmdk,
  next-themes and the CRA `resolutions` block. 392 packages installed, down
  from a CRA tree several times that size. `components.json` is retained so any
  shadcn component is one `npx shadcn add` away.
- **ESLint on the flat config** (`eslint.config.mjs`, extending
  `next/core-web-vitals` + `next/typescript`), with `lint` running `eslint .`
  rather than the `next lint` wrapper, which is deprecated and removed in
  Next 16.
- **Component libraries going forward:** shadcn/ui (existing) plus Vengeance
  UI, registered as `@vengeanceui` in `components.json`. Vengeance UI ships
  through the shadcn CLI rather than npm — `npx shadcn add @vengeanceui/<name>`.
- **Removed:** the FastAPI + MongoDB backend (the frontend never called it),
  `.emergent/`, the Emergent visual-edits and health-check plugins, the PostHog
  analytics snippet and `emergent-main.js` from the old `index.html`, the
  `[data-debug-wrapper]` CSS, `tests/`, `test_reports/`, `test_result.md`,
  `scripts/optimize_images.py` (hardcoded a dead container path), the empty
  `memory/` folder and the leftover `emergent-agent-e1` `.gitconfig`.
  Analytics stays out until post-approval, per `project-overview.md`.
- **Dead code dropped:** `useSiteNav`, `ScrollToTop`, `constants/testIds/` and
  `use-toast` were all unreferenced. The first two are route-aware and should
  be reintroduced with the routing work.

## Session Notes

- Stack is Next.js 15 (App Router) + React 19 + TypeScript strict + Tailwind
  3.4 + Motion.dev + Lenis. `npm run dev` / `build` / `start` / `lint` /
  `typecheck`.
- Path alias is `@/*` → repo root, so `@/components/...`, `@/lib/...` all work
  as they did before.
- The pre-migration code is preserved in git history at commit `5f60112` under
  `frontend/`, if a behaviour needs checking against the original.
- All content is static dummy data in `lib/data/site.ts` (typed:
  `Clinic`, `NavLink`, `Treatment`, `Doctor`, `Testimonial`, `GoogleRating`).
  Ten treatments; five carry `home: true` and populate the Home bento grid.
- Before starting the next unit, run `/plugin` to confirm the four declared
  plugins actually installed — they are declared in `.claude/settings.json` but
  install on repo trust, which needs a user confirmation.
