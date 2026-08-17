Read @AGENTS.md first. 

I need several changes across the site: mobile responsiveness, Gallery updates, and a new Google reviews section. Feel free to use any library you think fits best for any of this — pick whatever fits our existing stack (Next.js, Tailwind, Motion.dev, Lenis) cleanly.

1. FULL SITE RESPONSIVENESS (PRIORITY — do this first)
- The site looks and feels correct on desktop but breaks down on mobile. The most visible issue: the Doctors section div is oversized on mobile and doesn't fit within a single mobile screen.
- Audit every page (Home, Treatments, individual treatment pages, Doctors, Contact, Gallery) across mobile, tablet, and desktop breakpoints, and fix sizing, spacing, and layout so every section fits and reads properly at each breakpoint — not just Doctors, since if that section slipped through, similar issues may exist elsewhere.
- Use our existing Tailwind breakpoint system and reusable components — don't introduce one-off fixed pixel widths/heights that break responsiveness again later.
- Re-verify the loading states (skeleton/blur-up images, shell render, progress bar) we implemented earlier still work correctly on mobile after these layout fixes.

2. GALLERY PAGE CHANGES
- Keep the existing infinite drag/scroll loop behavior as-is — don't change that mechanic.
- Currently images use two different aspect ratios. Normalize all gallery images to the same consistent aspect ratio/frame size so the grid looks uniform.
- Change the image container's background color and component to use our site's existing reusable components and CSS variables, matching the rest of the site (this replaces the earlier decision to keep Gallery visually distinct — it should now feel visually consistent with the rest of the site).
- Add a lightbox: clicking any gallery image should open it enlarged in a popup/modal overlay, with a close ("X") button in the top-right corner. Clicking outside the image or the close button should dismiss it. Keep this smooth and consistent with our existing animation patterns (Motion.dev).

3. GOOGLE REVIEWS / RATINGS SECTION (new section)
- Add a Google reviews/ratings section using dummy review data for now.
- On mobile: show one review at a time, auto-rotating every few seconds — same interaction pattern as the existing Home page Doctors section carousel.
- On desktop/laptop: show three reviews at a time, auto-rotating every few seconds.
- Match the styling to our existing reusable components and CSS variables (palette, spacing, shadows) — don't hardcode new colors.
- [Tell Claude Code here which page(s) this section should appear on — e.g. Home page, or its own section — since I haven't specified placement]

4. PERFORMANCE OPTIMIZATION (MOBILE + DESKTOP)
- After the responsiveness and Gallery changes are in, do a general load-speed optimization pass for both mobile and desktop — image sizes/formats, any newly introduced layout-shift issues from the responsive fixes, and confirm Core Web Vitals haven't regressed from the changes in this session.
- Report before/after load metrics if possible.

Please implement in this order: responsiveness fixes first (since that's the most visible issue), then Gallery changes, then the Google reviews section, then the final performance pass.