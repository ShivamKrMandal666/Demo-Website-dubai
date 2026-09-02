import type { Metadata, Viewport } from "next";
import { Fraunces, Jost } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { RouteTransition } from "@/components/site/RouteTransition";
import { RouteProgress } from "@/components/site/RouteProgress";
import { BootProgress } from "@/components/site/BootProgress";
import { MotionProvider } from "@/components/site/MotionProvider";
import { StickyContact } from "@/components/site/StickyContact";
import "@/app/globals.css";

// Editorial serif for headings, geometric sans for body/eyebrows.
// Exposed as CSS variables consumed by --font-serif / --font-sans in globals.css.
// Loaded as a variable font (weight + optical size), matching the
// ital,opsz,wght axes the old Google Fonts <link> requested.
//
// `preload: false` — NOT because the font is optional, but because of what it
// costs at the front of the queue. The two Fraunces faces measured 149 kB over
// the wire (italic 81.7 kB, roman 67.4 kB) and next/font emits a
// <link rel="preload"> for each, so both landed in the top priority band ahead
// of the render-blocking stylesheet and every JS chunk. On a weak connection
// that is most of the reason the deployed link took 8+ seconds to become
// useful. Without the preload they are discovered from the CSS instead of
// racing it: same files, same final rendering, just no longer first in line.
//
// This is safe here specifically because next/font also generates a size-adjusted
// `Fraunces Fallback` face (local("Times New Roman"), ascent-override 84.71%,
// size-adjust 115.45%). Paired with `display: "swap"` the fallback occupies the
// same box, so the swap does not move layout — CLS must stay 0, and that is the
// check on this change.
//
// NOTE, measured: this flag is not per-font. Setting it on Fraunces drops the
// preload for EVERY font in this layout, Jost included — the built HTML goes
// from three `<link rel="preload" as="font">` to none, and Fraunces' files lose
// the `-s.p.woff2` marker while Jost keeps it. So the saving is the full
// 175.7 kB, not the 149 kB the two Fraunces faces account for.
//
// Losing Jost's preload as well is a fair trade rather than a regret. The
// stylesheet is render-blocking, so the browser parses it — and discovers every
// @font-face in it — before it can paint anything at all. A preload only brings
// the swap forward by the stylesheet's own download time; it never unblocks the
// first paint, because `display: "swap"` already paints in the metric-matched
// `Jost Fallback` (local("Arial"), size-adjust 96.01%). On the weak connection
// this whole pass is aimed at, 26.6 kB not competing at top priority is worth
// more than a marginally earlier swap.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

// Sharing metadata for the whole site.
//
// The link being shared is a PROTOTYPE, so the preview has to say so: what a
// visitor sees inside the page is the fictional Maison Lumé clinic, but what
// WhatsApp, iMessage, Slack and X unfurl is the Neptune B2B demo pitch. That
// split is deliberate — do not "fix" it by reintroducing the clinic name here.
//
// The per-route pages export only `title` and `description`, never `openGraph`
// or `twitter`, so every route inherits this preview wholesale while keeping its
// own browser-tab title. Adding an `openGraph` block to a page would silently
// opt that route out of it.
//
// `metadataBase` is what lets the relative image and canonical URLs below
// resolve to absolute ones — crawlers reject a relative og:image.
//
// The card is a static file in public/, so it is served unauthenticated at the
// origin root and never routed through /_next/image (next.config caps
// deviceSizes at 1200 deliberately). JPEG, not SVG (WhatsApp will not render
// SVG) and not PNG: the same 1200x630 render is 777 kB as PNG against 103 kB at
// JPEG q90 / 4:4:4 with no visible loss, and WhatsApp silently drops cards whose
// image is too heavy to fetch. Regenerate it from scripts/og-preview.html — that
// file carries the command and the 1200x630 constraint.
const OG_DESCRIPTION =
  "Explore a modern aesthetic clinic website demo designed by Neptune B2B. Fully customizable with your clinic's branding, treatments, doctors, photos and contact details.";

export const metadata: Metadata = {
  metadataBase: new URL("https://aesthetic-clinic-prototype.vercel.app"),
  title: "Modern Website for Aesthetic Clinics | Neptune B2B",
  description: OG_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Modern Aesthetic Clinic Website Demo",
    description: OG_DESCRIPTION,
    url: "/",
    siteName: "Aesthetic Clinic",
    type: "website",
    images: [
      {
        url: "/website-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Modern aesthetic clinic website demo created by Neptune B2B",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern Aesthetic Clinic Website Demo",
    description:
      "A fully customizable website concept for aesthetic, cosmetic, skin and hair clinics.",
    images: ["/website-preview.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jost.variable}`}>
      <body>
        <SmoothScroll />
        <RouteTransition />
        {/* Two halves of one bar. BootProgress is a CSS keyframe that runs from
            the first painted frame, covering the wait before any script has
            hydrated — the window in which the deployed link looked broken.
            RouteProgress takes over at hydration and owns route changes.
            Both sit at z-[60], above the grain overlay (z-41) and the mobile
            Sheet (z-50) — a navigation started from the open menu still shows
            its progress. */}
        <BootProgress />
        <RouteProgress />
        <div className="grain-overlay" aria-hidden="true" />
        <MotionProvider>{children}</MotionProvider>
        {/* Outside MotionProvider — it uses no `motion` primitives, so the
            strict LazyMotion domain stays untouched. After {children} so it
            lands last in the tab order rather than ahead of the navbar. */}
        <StickyContact />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
