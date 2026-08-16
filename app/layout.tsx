import type { Metadata, Viewport } from "next";
import { Fraunces, Jost } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { RouteTransition } from "@/components/site/RouteTransition";
import { RouteProgress } from "@/components/site/RouteProgress";
import { MotionProvider } from "@/components/site/MotionProvider";
import { StickyContact } from "@/components/site/StickyContact";
import { clinic } from "@/lib/data/site";
import "@/app/globals.css";

// Editorial serif for headings, geometric sans for body/eyebrows.
// Exposed as CSS variables consumed by --font-serif / --font-sans in globals.css.
// Loaded as a variable font (weight + optical size), matching the
// ital,opsz,wght axes the old Google Fonts <link> requested.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${clinic.name} — ${clinic.tagline}`,
  description:
    "A private aesthetic and cosmetic clinic in Mayfair, London, devoted to natural, considered results — where medical precision meets quiet luxury.",
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
        {/* Sits at z-[60], above both the grain overlay (z-41) and the mobile
            Sheet (z-50) — a navigation started from the open menu still shows
            its progress. */}
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
