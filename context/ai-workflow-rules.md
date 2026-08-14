# AI Workflow Rules

## Approach

Build this project incrementally, one page or section at a time, using Claude Code. Context files (`project-overview.md`, `architecture.md`, `code-standards.md`, `ui-context.md`) define what to build and how — implement against these specs, don't invent behavior beyond them. This is the prototype phase: no backend, CMS, analytics, email, or localization work until explicitly instructed post-approval.

## Scoping Rules

- Work on one page or one section at a time (matching the existing page-by-page prompting workflow)
- Prefer small, verifiable increments over large speculative changes
- Don't combine unrelated concerns in a single implementation step

## When to Split Work

Split an implementation step if it combines:

- UI/layout changes for more than one page or major section
- Prototype UI work with any post-approval feature (CMS, Supabase, GTM/GA4, Resend, Arabic-English toggle, dashboard)
- Behavior not clearly defined in the context files

If a change can't be verified end to end quickly, the scope is too broad — split it.

## Handling Missing Requirements

- Don't invent product behavior not defined in the context files
- If a requirement is ambiguous, resolve it in the relevant context file before implementing
- If a requirement is missing, flag it as an open question before continuing

## Protected Files

- Don't modify shared components (navbar, footer, Google Map block) unless the task is explicitly about changing those components
- Don't touch third-party/library internals

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes:

- Architecture or folder structure
- Code conventions or standards
- Feature scope (especially when a post-approval feature moves into active scope)

## Before Moving to the Next Unit

1. The current page/section works end to end within its defined scope
2. No invariant defined in `architecture.md` was violated
3. `npm run build` passes