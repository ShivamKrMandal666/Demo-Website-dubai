# Architecture Context

## Stack

| Layer         | Technology                       | Role                                  |
| ------------- | --------------------------------- | -------------------------------------- |
| Framework     | Next.js (TypeScript, App Router)  | Core app framework, routing, rendering |
| Styling       | Tailwind CSS                      | Utility-first styling                  |
| Motion        | Motion.dev                        | Scroll reveals, hover/interaction animation |
| Smooth Scroll | Lenis                             | Smooth scroll behavior                 |

Post-approval additions (not part of the current prototype stack): Supabase (backend + storage), Resend (transactional email), a CMS, GTM + GA4.

## System Boundaries

- `app/` — page routes (Home, Treatments, individual treatment pages, Doctors, Contact, Gallery), per App Router convention
- `components/` — reusable UI (navbar, footer, map block, treatment card, doctor card, etc.), shared across pages
- `lib/data/` — typed dummy content used to populate pages
- `public/images/` — all generated/placeholder images, organized by page/section

## Storage Model

- No persistent storage in the prototype phase — all content is static, typed dummy data in `lib/data`
- Post-approval: Supabase owns real data (appointments, consultations) and file/media storage

## Auth and Access Model

- None in the prototype phase — public static site, no sign-in
- To be defined post-approval when dashboard/CMS access is introduced

## Invariants

1. No backend calls, database, or persistent storage in the prototype phase
2. Dummy data lives in code (`lib/data`), never fetched from an external source
3. Navbar, Footer, and Google Map components are shared and reused identically across all pages, not duplicated — **except `/gallery`**, which renders none of them; see below
4. All images are compressed/optimized and organized under `public/images/`

## The `/gallery` exception

**Scope of the exception changed in the final-changes pass.** It used to be a
full design island — its own palette in literal hex, its own class merger, no
token anywhere. That is reversed: the client asked for the gallery to feel
visually consistent with the rest of the site, so tiles, chrome and surface now
use the same tokens as every other route (`espresso-deep`, `bone`, `gold`,
`rounded-2xl`, `shadow-elegant`) and the route imports `cn` from `lib/utils`
like anything else. The route-local `cx.ts` is gone.

What remains exceptional is **layout, not styling**: `/gallery` renders none of
the shared chrome (no Navbar, Footer, Map or hero) because it is a full-bleed
`fixed inset-0` surface rather than a page, and it is left via a single fixed
"Back to site" link. That is still a departure from invariant 3.

Its mechanics stay route-local for the ordinary reason — no second consumer.
`InfiniteDragScroll.tsx`, the CSS module and `use-viewport-lock.ts` live under
`app/gallery/` because nothing else on the site drags a surface, not because a
boundary forbids sharing. If a second consumer appears, promoting them is a
normal refactor now.