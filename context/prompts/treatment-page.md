# Prompt 2 — Continue Building Treatments Page + Individual Treatment Pages + Home Page Fix

## Context

The codebase has now been migrated to Next.js (TypeScript, App Router) + Tailwind CSS + Motion.dev + Lenis, with the FastAPI/MongoDB backend and Emergent-only files removed. The 29 previously generated images (10 treatment images, hero backgrounds, and supporting background images) already exist in `public/images/` — reuse them as-is, do not regenerate any images in this step.

Continue the build from where Emergent left off, using reusable components and global CSS variables (colors, spacing, radii, shadows) rather than one-off inline styles, so the same tokens can be reused across Home, Treatments, and every individual treatment page.

## Part 1 — Home Page Fix

Fix the Google Map and Footer sections on the Home page: they currently overlap and should not. Separate them into two clearly distinct sections, and apply proper borders and subtle shadows (using the shared border/shadow tokens) around the map container and footer for definition, matching the rest of the site's premium/editorial feel.

## Part 2 — Treatments Page

Build the Treatments page, reusing the existing Navbar, Footer, and Google Map components exactly as they are on the Home page — no changes to those components themselves.

**Structure:**

1. **Hero Section** — single static background image (not a slideshow), heading + short subheading for the Treatments page.
2. **Our Treatments Section** — a separate div/card per treatment (10 total), each using its already-generated treatment image:
   - Injectables & Fillers
   - Laser & Skin Resurfacing
   - Signature Facials
   - Body Contouring
   - Regenerative Aesthetics
   - Skin Boosters & Hydration Therapy
   - Thread Lifts
   - Chemical Peels
   - Hair Restoration
   - Facial Contouring & Jawline Sculpting

   Each div includes: treatment image, title, short description, and a "Discover"/"Know More" link that routes to that treatment's individual page. Apply consistent borders and soft shadows via shared tokens. Vary div sizing slightly rather than making every card identical, matching the non-uniform layout approach already used on the Home page.

3. **Reuse in Home Page** — confirm the Home page's "Signature Treatments" section is using 5 of these same 10 already-generated treatment images (no new images).

## Part 3 — Individual Treatment Detail Pages (10 pages)

Each treatment's "Discover"/"Know More" link opens a dedicated route (e.g. `/treatments/[slug]`) built as a **reusable dynamic template**, not 10 separate hand-built pages — one component/template driven by each treatment's data (image, title, description, session details) so the structure stays consistent and maintainable.

Each page includes:

1. **Hero Section** — background image unique to that treatment (already generated).
2. **Treatment Image Block** — directly below the hero, the same treatment image used on the Treatments page card, shown in a medium-sized div (not full-bleed).
3. **Full Treatment Details** — what it is, how it works, typical number of sessions, downtime/recovery expectations, results timeline (realistic dummy content).
4. **CTA** — "Book an Appointment" button at the end of the details section.

Use the extra background images already generated for each individual treatment page across hero/section backgrounds within that page.

## Style & Component Consistency

- Use global CSS variables/design tokens for colors, typography, spacing, border-radius, and shadows — defined once and referenced everywhere, not redefined per page
- Build the treatment card and the treatment detail template as reusable components so future edits (e.g. adding an 11th treatment) only require adding data, not new markup
- Match the color palette, typography, spacing rhythm, and scroll/hover/reveal animation behavior already established on the Home page
- Keep everything mobile-responsive

the website should be super smooth add proper amimation on scroll and in content revel and also add hover effect.
as well as mobile responsive.