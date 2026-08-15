Build the Doctors page for the aesthetic clinic demo site, and wire doctor images into the existing Home page doctors section.

CONTEXT
- Read the existing context docs (project-overview, architecture, ui-context, code-standards) before starting.
- Reuse the Navbar, Google Map, and Footer components exactly as they are on the Home/Treatments pages — no modifications, just import and place them.
- Use the already-established reusable components and UI CSS variables (colors, spacing, typography, card styles, buttons, etc.) for everything on this page — don't hardcode new colors or one-off styles.
- Stack: Next.js (TypeScript, App Router), Tailwind CSS, Motion.dev, Lenis. No new dependencies unless already used elsewhere in the codebase.

IMAGES
- I will provide file paths for the 5 doctor images.
- You do not have a hero background image from me — generate one yourself (appropriate for a premium aesthetic clinic doctors page) and use that.
- Place all images in the existing /public/images/ folder structure (create a /doctors subfolder if one doesn't exist).
- Optimize every image for fast load, and resize/crop each one as needed to fit its placement on the page.
- Use next/image everywhere (fill or fixed sizing as appropriate, explicit dimensions or fill + sizes to avoid layout shift). Priority only on the hero image; lazy load everything below the fold.

PART 1 — DOCTORS PAGE
1. Navbar — reused as-is.
2. Hero Section
   - Full-width section with the generated background image, with an overlay if needed for text contrast.
   - Page title (e.g. "Meet Our Doctors") and a short supporting line, centered.
   - Add an entrance animation on load.
3. Doctors Section
   - Responsive grid (1 col mobile, 2 col tablet, up to 3 col desktop) of 5 doctor cards.
   - Each card: doctor image, name, title/specialization, short bio/credentials — use the doctor details already in the codebase, don't invent content.
   - Add a hover effect on each card (lift/shadow/image zoom — your call, keep it smooth and consistent with the rest of the site) and make sure cards have proper shadows.
   - Reuse the existing reusable Card component if one exists rather than building new markup.
   - Add a stagger-in animation as the grid scrolls into view, not all-at-once.
4. [Stop here and check in with me before building anything further — don't invent additional sections.]
5. Google Map — reused as-is.
6. Footer — reused as-is.

Build a reusable DoctorCard component in the shared components folder (props: image, name, title, bio), since it'll be reused on the Home page too.

PART 2 — HOME PAGE
- The Home page already has a doctors section built — do NOT restructure it or change its layout/copy.
- Just wire the same 5 doctor images into the existing section's image slots, optimizing/resizing as needed to fit that section's design.
- Reuse whatever card markup/component that section already uses — don't force it onto the new DoctorCard component unless it's already using an equivalent shared component.

PERFORMANCE
- Optimized images, no unnecessary client-side JS, animations should not block initial paint.
- Reuse the site-wide Lenis smooth scroll setup — don't reinitialize it on this page.

Wait for my doctor image paths before wiring in final image references — start with the Doctors page component structure using placeholder slots, generate the hero background image, then I'll give you the doctor image paths.