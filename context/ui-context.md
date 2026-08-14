# UI Context — Maison Lumé

The design language for an editorial, quiet-luxury aesthetic clinic. This
documents the system **as built** in `app/globals.css` and `tailwind.config.ts`
— it is the source of truth for anything added later.

Guiding idea: restraint. Warm neutrals, one sage and one gold accent, generous
whitespace, slow easing. Nothing shouts.

---

## Colour

All colour lives as HSL space-separated CSS variables in `app/globals.css` and
is surfaced through Tailwind tokens. **Never write a hex value or a raw
`hsl(...)` in a component** — use the token.

### Core tokens

| Token | HSL | Reads as |
| --- | --- | --- |
| `--background` | `40 33% 96%` | warm bone — the page ground |
| `--foreground` | `24 24% 12%` | espresso near-black — all body copy |
| `--card` | `40 40% 98%` | cream, one step lighter than the page |
| `--primary` | `96 16% 37%` | muted olive-sage — the quiet brand colour |
| `--secondary` | `24 22% 15%` | espresso — dark section grounds |
| `--muted` | `38 26% 90%` | warm beige — inset panels, faux map surface |
| `--muted-foreground` | `28 12% 40%` | secondary copy |
| `--accent` | `36 46% 60%` | champagne gold — the only highlight colour |
| `--border` / `--input` | `34 20% 84%` | hairline warm grey |
| `--ring` | `96 16% 37%` | focus ring, matches primary |

### Named brand tokens

Used when the semantic tokens would read wrong — mainly for text and surfaces
sitting **on top of dark imagery**, where `foreground`/`background` invert.

`espresso` · `espresso-deep` · `sage` · `sage-light` · `gold` · `gold-soft` ·
`bone` · `cream`

- `bone` is the text colour on dark sections (`text-bone`, `text-bone/80`, `text-bone/60`).
- `gold` is the accent on dark; `primary` is the accent on light.
- `espresso-deep` is reserved for image scrims (`bg-espresso-deep/70`).

A `.dark` block exists in `globals.css` but the site ships light-only — there
is no theme toggle, and `<Toaster>` is pinned to `theme="light"`.

### Gradients

Five, all CSS variables exposed as Tailwind `bg-gradient-*` utilities:

| Utility | Use |
| --- | --- |
| `bg-gradient-hero` | left-to-right espresso scrim over hero imagery |
| `bg-gradient-hero-bottom` | bottom vignette on hero imagery |
| `bg-gradient-fade-bone` | bone wash over the testimonial texture |
| `bg-gradient-sage`, `bg-gradient-gold` | available, currently unused |

### Shadows and radius

- `shadow-soft` — resting elevation for cards
- `shadow-elegant` — hover elevation and hero-adjacent blocks
- `shadow-gold` — gold CTA buttons only
- `--radius: 0.75rem`; cards use `rounded-2xl`, large media blocks
  `rounded-3xl`, buttons and pills `rounded-full`

---

## Typography

Two families, loaded via `next/font/google` in `app/layout.tsx` and exposed as
`--font-fraunces` / `--font-jost`:

- **Fraunces** (variable, `opsz` axis, normal + italic) → `font-serif`.
  Every heading, plus display numerals and initials.
- **Jost** (300–600) → `font-sans`. Body copy, eyebrows, buttons, labels.

`body` sets `font-feature-settings: 'ss01', 'cv01'` and antialiasing.

### Conventions

- **Headings** always carry `tracking-editorial` (`-0.02em`) and `text-balance`.
  Scale: h1 `text-4xl sm:text-5xl lg:text-6xl` with `leading-[1.04]`;
  section h2 `text-3xl sm:text-4xl lg:text-5xl` with `leading-tight`;
  card h3 `text-xl md:text-2xl`.
- **Italic gold** marks the single emphasised word in a headline
  (`<span className="italic text-gold">natural</span>`) — use once per page.
- **Eyebrows and micro-labels** are the signature: `font-sans`, `uppercase`,
  and widely tracked between `tracking-[0.16em]` and `tracking-[0.34em]`, at
  `text-[0.58rem]`–`text-xs`. The wider the tracking, the smaller the type.
- **Body copy** is `font-sans text-base leading-relaxed text-muted-foreground`
  (or `text-bone/70`–`/80` on dark).

---

## Layout and rhythm

- Every section is wrapped in `container mx-auto` — centred, `1.25rem` padding
  (`2rem` at `lg`), capped at `1280px`.
- **Section rhythm is `py-24 md:py-32`.** Sub-sections inside a page use
  `py-16 md:py-24`.
- Background imagery is applied as a `bg-cover bg-center` absolutely-positioned
  layer with a scrim over it, and content lifted with `relative z-10`. Sections
  that do this need `overflow-hidden`.
- Grids lean asymmetric on purpose — `md:grid-cols-12` with offset column
  starts, and a bento treatments grid mixing `md:col-span-2` / `md:row-span-2`.
  Avoid uniform 3-up grids; the layout should never look flat.
- Deliberate overlap is part of the language: the map section carries
  `-mb-28 md:-mb-40` so it bleeds behind the footer, and the footer answers
  with `pt-40 md:pt-56` and a gold hairline to define the seam.

### Grain overlay

`.grain-overlay` is a fixed, `pointer-events-none`, `z-41` SVG-noise layer at
`opacity: .045` with `mix-blend-mode: multiply`, mounted once in the root
layout. It sits above content but below the navbar (`z-50`). It is what stops
the flat colours reading as digital.

---

## Motion

Motion is slow, eased and understated. **Motion.dev** (`motion/react`) handles
component animation; **Lenis** handles scroll; Tailwind keyframes handle
ambient loops.

### The house curve

```ts
const EASE = [0.22, 1, 0.36, 1] as const;
```

Every entrance, reveal and slide uses it. Durations sit between `0.55s` and
`0.9s`. Only the Doctors timer bar uses `linear`.

### Scroll reveals

`components/site/Reveal.tsx` provides the **only** three reveal primitives.
Don't hand-roll `whileInView` elsewhere.

| Component | Behaviour |
| --- | --- |
| `<Reveal>` | fade + rise (`y: 28`, or `x` for lateral entries), `duration: 0.8` |
| `<RevealStagger>` | parent that staggers its children (`stagger: 0.08`–`0.12`) |
| `<RevealItem>` | child of the above; inherits the parent's variant state |

Both parents fire at `viewport={{ once: true, margin: "-80px 0px" }}` — 80px
before entry, and **never replay**. Stack sibling `<Reveal delay>` values in
`0.05` increments to cascade an eyebrow → heading → copy → CTA block.

### Ambient keyframes

Defined in `tailwind.config.ts`, applied as utilities:

| Utility | Where |
| --- | --- |
| `animate-kenburns` | 16s alternating slow zoom on every hero background |
| `animate-scroll-cue` | 1.8s scroll arrow hint |
| `animate-pulse-ring` | 2.6s expanding ring on the map pin |
| `animate-float`, `animate-fade-up`, `shimmer` | available, currently unused |

Hero slides crossfade with a plain CSS `transition-opacity` at
`[transition-duration:1600ms]` on a 5s interval — not Motion — so the ken burns
loop stays uninterrupted.

### Smooth scroll

Lenis is initialised **once** in `components/site/SmoothScroll.tsx`, mounted in
the root layout: `duration: 1.15`, exponential easing, `touchMultiplier: 1.4`.
The instance is on `window.__lenis`; use `scrollToId()` from
`lib/smooth-scroll.ts` for in-page jumps (it applies a `-72px` offset for the
fixed navbar, on both the Lenis and the native path). Never construct a second
Lenis instance. Under `prefers-reduced-motion: reduce` no Lenis is created —
`window.__lenis` stays `null` and `scrollToId()` jumps instantly instead.

---

## Components

### Buttons (`components/ui/button.tsx`)

Beyond stock shadcn, the project adds brand variants. Choose by surface:

| Surface | Primary | Secondary |
| --- | --- | --- |
| Light section | `gold` | `outlineSage` |
| Dark section / over imagery | `gold` | `hero` or `outlineBone` |

Other variants: `default` (sage fill), `espresso`, `outlineGold`, `linkGold`.
Sizes add `xl` (`h-14 px-10`) for hero CTAs; `lg` for section CTAs; `sm` in the
navbar and footer. **CTAs are always `rounded-full`.**

Every variant lifts on hover (`hover:-translate-y-0.5`) over a `300ms`
transition. Buttons pair with a trailing `ArrowUpRight` icon for booking
actions, `ArrowRight` for navigation.

### `SectionLabel`

The eyebrow that opens every section: an `h-px w-8` rule plus a tracked
uppercase label. `onDark` switches rule and text from sage to gold; `align`
centres it. Every section starts with one.

### Card pattern

```text
rounded-2xl border border-border bg-card shadow-soft
transition-[transform,box-shadow,border-color] duration-500
hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-elegant
```

Cards over imagery add `bg-card/85`–`/90` with `backdrop-blur-sm`. Images
inside cards scale on hover: `duration-700 ease-out group-hover:scale-105`,
with the card as `group`.

### Icons

`lucide-react` only, at `h-4 w-4` inline / `h-5 w-5`–`h-9 w-9` standalone. The
Google "G" in the testimonials block is the one bespoke inline SVG (brand
colours are exempt from the no-hex rule).

### Placeholders

Client-supplied imagery is stubbed with a dashed `border-primary/30` panel, a
centred `ImageIcon`, and a tracked uppercase caption. Keep this pattern for any
new slot awaiting real photography.

---

## Imagery

- All 29 images live in `public/images/`, split into `treatments/` (card
  images), `heroes/` (per-treatment hero backgrounds) and `backgrounds/`
  (section textures). They are already optimized — **never regenerate or
  re-compress them.**
- Paths are referenced **only** through the manifest in `lib/images.ts`, which
  also exports the home-page aliases (`heroImages`, `textures`). Never inline
  an image path in a component.
- Background imagery always sits under a scrim (`bg-gradient-hero`,
  `bg-espresso-deep/70`, or `bg-background/50`) so text contrast holds.

---

## Accessibility

- Decorative layers carry `aria-hidden="true"`; icon-only buttons carry
  `aria-label`.
- Focus is visible everywhere via the button base
  (`focus-visible:ring-2 ring-ring ring-offset-2`).
- Custom scrollbar styling is defined in `globals.css`; `::selection` uses the
  gold accent.
