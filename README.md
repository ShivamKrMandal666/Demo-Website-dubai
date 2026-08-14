# Maison Lumé

A prototype website for an aesthetic & cosmetic clinic, built as a pitch piece.
Dummy content throughout — real production features (booking backend, CMS,
analytics) are added only after a client signs on.

## Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router) + React 19 + TypeScript (strict) |
| Styling | Tailwind CSS 3.4 |
| Motion | Motion.dev (`motion/react`) |
| Smooth scroll | Lenis |
| Components | shadcn/ui + Vengeance UI |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`,
`npm run typecheck`.

## Structure

```text
app/                 App Router routes — layout.tsx, page.tsx (Home), globals.css
components/
  site/              Navbar, Footer, Reveal, SectionLabel, SmoothScroll
  home/              The seven Home page sections
  treatments/        Parked — ported but not yet routed (see its README)
  ui/                shadcn primitives in use: button, sheet, sonner
lib/
  data/site.ts       All typed dummy content
  images.ts          Central image manifest — the only place image paths live
  smooth-scroll.ts   scrollToId() helper over the Lenis instance
  utils.ts           cn()
public/images/       29 optimized images (treatments / heroes / backgrounds)
context/             Project specs — read context/AGENTS.md first
```

## Adding components

```bash
npx shadcn@latest add card                 # shadcn/ui
npx shadcn@latest add @vengeanceui/<name>  # Vengeance UI
```

## Conventions

The design system — colour tokens, typography, motion vocabulary and component
patterns — is documented in [`context/ui-context.md`](context/ui-context.md).
Current status and next steps live in
[`context/progress-tracker.md`](context/progress-tracker.md).
