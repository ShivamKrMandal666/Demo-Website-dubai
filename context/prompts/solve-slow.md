read @AGENTS.md first

# Prompt — Diagnose & Fix Slow Load + Add Lazy Loading

## Context

This is the Next.js (TypeScript, App Router) + Tailwind + Motion.dev + Lenis clinic prototype, migrated from an Emergent-generated Vite/React/FastAPI/MongoDB build. It's frontend-only now (no backend). The site is loading slowly, but the 29 images in `public/images/` total only ~2.42MB combined — so images are very unlikely to be the actual bottleneck. Don't assume it's images. Profile first, find the real cause(s), then fix them one at a time.

## Step 1 — Profile before touching anything

Before making any changes, actually measure where the time is going:

- Run a production build (`npm run build && npm start`) and test that — not the dev server. Dev-server slowness is often not representative of real load time.
- Run Lighthouse (or equivalent) against the production build and capture Performance score, LCP, TBT, TTI, and CLS.
- Inspect the network waterfall: what's the largest resource by transfer size, what's render-blocking, what loads before First Contentful Paint.
- Run a bundle analyzer (e.g. `@next/bundle-analyzer`) to see actual JS bundle size per route and which dependencies are the biggest contributors.
- Report findings before proceeding to fixes, so we know what's actually slow (JS bundle size, font loading, animation/scroll library overhead, unused dependencies still being imported, render-blocking scripts, too many client components, embedded map/iframe, etc.) rather than guessing.

## Step 2 — Fix based on what profiling shows

Likely culprits to specifically check, given this codebase's history (migrated from a template that had 48 shadcn components installed with only 3 actually used, plus Radix, recharts, embla, react-hook-form, zod, axios, swr, react-query, lodash, date-fns as dependencies):

1. **Unused/leftover dependencies still being imported or bundled** — confirm the dependency prune from the migration actually happened; check for any remaining imports of libraries that aren't used on a given page dragging their weight into the client bundle.
2. **Too many Client Components** — check whether components that don't need interactivity are marked `"use client"` unnecessarily, forcing more JS to ship and hydrate than needed. Convert what can be a Server Component back to one.
3. **Font loading** — check if fonts are loaded in a way that blocks render (not using `next/font`, missing `font-display: swap`, loading too many weights/families).
4. **Motion.dev / Lenis overhead** — check that these are only initialized/imported on the client where needed, not pulled into every route's bundle, and that Lenis is initialized once at the root layout rather than per-page.
5. **Google Map embed** — if it's an iframe, make sure it's not loading eagerly above the fold on initial page load; it should load lazily as the user scrolls near it (see Step 3).
6. **Render-blocking CSS/JS** — check for any script or stylesheet not using `defer`/`async` or Next.js's built-in optimization patterns.
7. **Code splitting** — verify heavier sections (carousels, dynamic doctor rotation, testimonials) are dynamically imported where appropriate instead of bundled into the initial page load.

Fix issues one at a time, in order of biggest measured impact first, and re-measure (Lighthouse + bundle size) after each fix to confirm it actually helped before moving to the next.

## Step 3 — Add proper lazy loading

Independent of whatever the profiling turns up, add lazy loading throughout:

- All images below the fold should use lazy loading (Next.js `<Image>` component defaults to lazy loading — confirm all images are actually using `next/image` rather than plain `<img>` tags, and that above-the-fold hero images are marked `priority` while everything else lazy-loads).
- The Google Map embed should only load once it's near the viewport (e.g. via an intersection observer or a lazy-loaded iframe wrapper), not on initial page load.
- Any heavy below-the-fold sections (testimonials/reviews block, doctors rotation, treatments grid) should be code-split with dynamic imports so their JS doesn't block initial page load.
- Confirm the hero background slideshow and doctor rotation preload only the next image needed, not the entire image set upfront.

## Step 4 — Verify

After all fixes:

- Re-run Lighthouse on the production build and report the before/after scores (Performance, LCP, TBT, TTI, CLS)
- Confirm total JS bundle size per route has measurably decreased
- Confirm the site still looks and animates identically to before — this is a performance pass, not a visual change
- Test on a throttled connection (e.g. Fast 3G in devtools) to confirm the experience is meaningfully better, not just the Lighthouse number