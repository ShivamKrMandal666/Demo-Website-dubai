import type { Metadata, Viewport } from "next";
import { Fraunces, Jost } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScroll } from "@/components/site/SmoothScroll";
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
        <div className="grain-overlay" aria-hidden="true" />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
