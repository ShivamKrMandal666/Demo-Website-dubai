# Code Standards

## General

- Keep components small and single-purpose
- Fix root causes rather than layering workarounds
- Don't mix unrelated concerns (e.g. layout and data) in one component

## TypeScript

- Strict mode required throughout
- Avoid `any` — use explicit interfaces/types, especially for dummy data shapes
- Type all page and section props explicitly

## Next.js (App Router)

- Default to server components; add `"use client"` only where interactivity (animation, hover states, carousels) requires it
- Keep route files focused on page composition — logic lives in `components/` or `lib/`
- Shared components (navbar, footer, map) live in `components/` and are imported across page routes, never duplicated per page

## Styling

- Tailwind CSS utility classes only — no hardcoded hex values; extend the Tailwind theme with the project's color tokens
- Follow spacing, border-radius, and shadow conventions defined in `ui-context.md`
- **No exemptions.** `app/gallery/` used to be one; the final-changes pass moved
  it onto tokens like every other route (see `architecture.md`). The single
  surviving hex in the codebase is the four-colour Google "G" in
  `components/home/Testimonials.tsx`, where brand marks are exempt by definition
- Watch for token classes that do not look like tokens: `rounded-sm|md|lg|xl`
  resolve to `var(--radius)` (so `rounded-sm` is 8px here, not 2px), and a bare
  `border-*` width inherits `--border` from the `*` rule in `globals.css` unless
  a colour is named

## Animation

- Motion.dev for scroll-triggered reveals and hover/interaction animation
- Lenis initialized once at the root layout level, not re-initialized per page

## Data

- All content is static, typed dummy data in the prototype phase — stored in `lib/data`, never hardcoded inline in components
- No database or API calls in this phase

## File Organization

- `app/` — page routes
- `components/` — shared and page-specific UI components
- `lib/data/` — typed dummy content, per page/section
- `public/images/` — compressed images, organized by page/section