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
3. Navbar, Footer, and Google Map components are shared and reused identically across all pages, not duplicated — **except `/gallery`**, see below
4. All images are compressed/optimized and organized under `public/images/`

## The `/gallery` exception

`/gallery` is specified as a design island: a full-screen infinite drag grid of
every site image, with none of the shared layout (no Navbar, Footer, Map or
hero) and none of the design tokens, reachable only via the nav and left via a
single fixed "Back to site" link. It is the one intentional departure from
invariant 3 and from the "no hardcoded hex" rule in `code-standards.md`.

The boundary runs both ways and is the point of the thing: `app/gallery/` may
not import from `components/` or `lib/utils`, and nothing built for it may be
promoted into either. Its only outward dependencies are `lib/images.ts` and
`lib/data/site.ts` — content, not design. Everything else, including its own
class merger and its CSS module, is local to the route.