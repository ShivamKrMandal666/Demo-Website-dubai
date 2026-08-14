# Parked — Treatments page components

These components were written before the Next.js migration but were never
routed (the old `App.js` only ever routed `/`). They were carried through the
migration to TypeScript so the work isn't lost, but they are **deliberately not
placed under `app/`** — the site still ships Home-only, exactly as it did
before.

Wiring them up is the next unit of work:

| File | Becomes |
| --- | --- |
| `TreatmentsPage.tsx` | `app/treatments/page.tsx` |
| `TreatmentDetailPage.tsx` | `app/treatments/[slug]/page.tsx` (via `generateStaticParams` over `treatmentSlugs`) |
| `TreatmentGridCard.tsx` | stays here, used by both |

When routing them, also handle:

- `TreatmentDetailPage` currently returns `null` for an unknown slug — swap for `notFound()`.
- The `<img>` tags should become `next/image`.
- Nav links now scroll to Home sections (`NavLink.scroll`). Point the
  Treatments link at the new route: widen `SupportedRoute` in
  `lib/data/site.ts` and make `Navbar`/`Footer` navigate when `to` is not the
  current route — see `context/progress-tracker.md`.
- Scroll-to-top on route change (the old `ScrollToTop` component) needs
  re-adding, integrated with Lenis.
