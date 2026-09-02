# Task: Diagnose and fix slow initial page load on deployed Vercel site

## Context
This is a Next.js (App Router, TypeScript) + Tailwind CSS + Motion.dev + Lenis aesthetic clinic
website. It runs fine-ish on localhost but the deployed Vercel link takes 8+ seconds to open for
clients, and they think the link is broken. On localhost, initial load also takes 3-4 seconds and
first scroll on every page (except Gallery) lags, though it's smooth on the second pass — lazy
loading is a suspected contributor but has NOT been confirmed as the actual root cause.

Do not guess. Diagnose first with real data, report findings, then fix.

## Step 1 — Diagnose the real bottleneck
Before changing any code, investigate and report on:
1. Production build output — run the build and check total JS bundle size per route, and flag
   any unusually large chunks.
2. Which components are marked `"use client"` unnecessarily, forcing more JS to the client than
   needed (Server Components should be the default unless interactivity requires otherwise).
3. Whether Motion.dev and Lenis are being loaded/initialized on every page (including pages that
   don't need them), and whether they block the main thread on first paint.
4. Image handling — confirm `next/image` is used correctly everywhere (proper `width`/`height`
   or `fill`, `sizes`, and `priority` only on the actual above-the-fold hero image), and check
   actual served image sizes/formats on the deployed site (not just source file sizes).
5. Font loading strategy — check if fonts are render-blocking.
6. Network waterfall on the live Vercel URL (not localhost) — identify what the browser is
   actually waiting on before first paint. Check for serverless function cold starts, any
   unnecessary API routes/middleware running on every request, and Vercel project region vs.
   where the client is opening the link from.
7. Total page weight for Home, Treatments, and Doctors specifically (these are richest in
   content/animation).

Summarize findings as a ranked list: which issues are actually causing the delay, and roughly
how much each contributes. Do not proceed to fixes until this is reported.

## Step 2 — Fix the root cause(s)
Fix whatever Step 1 actually identifies as the bottleneck(s) — don't apply generic optimizations
that the data doesn't support.

## Step 3 — Implement correct lazy loading
- Use `next/dynamic` to lazy-load heavy below-the-fold sections/components on each page so they
  don't block initial paint or ship in the first JS bundle.
- Ensure all images below the fold lazy-load natively via `next/image`, with only the true
  above-the-fold hero image marked `priority`.
- Confirm this doesn't reintroduce the "laggy first scroll, smooth second scroll" symptom seen
  on localhost — profile scroll performance after the change, not just initial load.
- Don't change any existing visual design, colors, or reusable components/CSS variables while
  doing this — only touch how/when things load.

## Step 4 — Add an initial loading state
So visitors never think the link is broken during the network-heavy first load:
- Add a route-level loading UI (`loading.tsx`) plus a top progress bar for both first load and
  route transitions.
- Render the page shell (nav, hero skeleton, layout structure) instantly, with heavier content
  streaming in after.
- Add blur-up/LQIP placeholders for images while they load in, instead of blank space.

## Step 5 — Verify and report
- Re-test the deployed Vercel URL with Lighthouse/PageSpeed Insights before/after, and share the
  actual numbers (not just "it feels faster").
- Test under throttled/slow-3G conditions to simulate what an international client on a weaker
  connection experiences.
- Give a plain-language summary: what was actually slow, what fixed it, and the before/after load
  time.

## Constraints
- Don't change existing visual design, colors, hover effects, or which components are used.
- Don't break any existing page: Home, Treatments, Doctors, Contact, Gallery.
- Gallery page's drag/scroll engine and visual isolation should remain untouched — only apply
  performance work there if Step 1's data specifically implicates it.