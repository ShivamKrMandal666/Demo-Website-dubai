# AGENTS.md

Aesthetic clinic website prototype — **Next.js (App Router, TypeScript) +
Tailwind CSS + Motion.dev + Lenis**.

## Read these first

Before implementing anything or making an architectural decision, read the
context files in this order:

1. `context/project-overview.md` — product definition, goals, features, scope
2. `context/architecture.md` — system structure, boundaries, invariants
3. `context/ui-context.md` — theme, colors, typography, motion, components
4. `context/code-standards.md` — implementation rules and conventions
5. `context/ai-workflow-rules.md` — workflow, scoping rules, delivery approach
6. `context/progress-tracker.md` — current phase, completed work, open
   questions, next steps

Update `context/progress-tracker.md` after each meaningful implementation
change. If implementation changes the architecture, scope, or standards
documented in the context files, update the relevant file before continuing.

## Commands

```bash
npm run dev        # dev server
npm run build      # production build — must pass before moving on
npm run typecheck  # tsc --noEmit, strict
npm run lint
```

## Ground rules

- Prototype phase: **no backend, database, CMS, analytics, email or
  localization** until explicitly instructed post-approval.
- Server components by default; `"use client"` only where interactivity
  requires it.
- The 34 images in `public/images/` are final — never regenerate or
  re-compress them. `lib/images.ts` is the single image manifest: reference
  every path through it, and never inline one in a component.
- Components come from shadcn/ui (`npx shadcn add <name>`) or Vengeance UI
  (`npx shadcn add @vengeanceui/<name>`).
- **`app/gallery/` is a deliberate exception to all of the above styling
  rules** — it is specified as an island with its own design language. It uses
  no shared component and no design token, and nothing in it may be promoted
  into `components/` or `app/globals.css`. Read `app/gallery/_components/cx.ts`
  before changing anything under that route.
