Read @AGENTS.md first

I want to implement a full loading-state and perceived-performance system across the site. Here's the complete spec:

Feel free to use any library you think is best for this (e.g. NProgress or a custom implementation for the progress bar, react-loading-skeleton or a custom CSS solution for skeletons, etc.) — pick whatever fits our existing stack (Next.js, Tailwind, Motion.dev, Lenis) cleanly rather than sticking to hand-rolled solutions if a library does it better.

1. GLOBAL PROGRESS BAR
- Add a thin progress bar at the very top of the viewport (below any fixed nav, or above it — your call on layering).
- It should trigger on: initial site load, and every route/page transition (Home → Treatments → Doctors, etc.).
- Use natural simulated progress (fast to ~70-80%, then slows down until the real navigation/content completes, then snaps to 100% and fades out) rather than trying to track exact byte progress.
- Should feel fast and premium, not gimmicky — thin, subtle color from our existing palette, no bounce or elastic easing.

2. INSTANT SHELL RENDER (structure-first loading)
- On every page, the layout shell should render immediately: navbar, footer, section containers, headings, and any text content — before images or heavy assets are ready.
- Use Next.js's App Router streaming (loading.tsx per route / Server Components) so the page shell is not blocked waiting on image assets.
- Above-the-fold hero images should NOT lazy-load — mark them priority so they load immediately with the shell, since they're immediately visible and currently causing first-scroll jank.
- Below-the-fold images continue to lazy-load, but set the Intersection Observer / next/image rootMargin so images start loading slightly before they enter the viewport, not exactly when they do — this should eliminate the "lag on first scroll, smooth on second scroll" issue we're seeing now.

3. IMAGE LOADING: BLUR-UP PLACEHOLDER + SKELETON
- Every image on the site (Treatments, Doctors, individual treatment pages — everywhere except Gallery, which keeps its own separate loading approach) should use next/image with a blur placeholder (placeholder="blur"), so a tiny blurred preview shows before the full image resolves.
- Where a blur placeholder isn't feasible for a given image, fall back to a skeleton box matching that image's exact aspect ratio, with a slow, steady shimmer sweep animation (CSS gradient + keyframes, no JS-driven animation) — this is to prevent any layout shift (CLS) when the real image pops in.
- Transition from placeholder/skeleton to the loaded image with a soft fade (150-200ms), not a hard swap.

4. FORM SUBMISSION LOADING STATE
- On the Contact/Booking form submit button: on click, show a small inline spinner inside the button itself (not full-page), disable the button to prevent double-submits, and keep this consistent with our existing optimistic-UI confirmation pattern (instant success state after submit, human follow-up implied).

5. ERROR / FALLBACK STATE FOR IMAGES
- If any image fails to load (broken path, network failure), show a graceful fallback — a simple icon + short text (e.g. "Image unavailable") in the same container size — never a broken-image browser icon or a broken layout.

6. LINK PREFETCHING
- Confirm Next.js <Link> prefetching is active (not disabled anywhere) for treatment "Discover" links and other internal navigation, so pages that are about to be visited are already prefetched in the background.

Please implement this using our existing reusable components and CSS variables where applicable — don't hardcode new colors, and keep the skeleton/shimmer and progress bar styling consistent with our established Almond Light / Liver Chestnut / Morning Blue / Arsenic / Champagne palette. Apply this across Home, Treatments, individual treatment pages, Doctors, and Contact — Gallery keeps its own existing load-on-visit behavior untouched.