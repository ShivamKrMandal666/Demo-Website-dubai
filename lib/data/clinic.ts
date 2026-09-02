// ---------------------------------------------------------------------------
// The two pieces of site data that CLIENT components need: the clinic details
// and the nav order. Split out of lib/data/site.ts, which re-exports both, so
// every existing import path still works.
//
// Why the split exists — it is a bundle boundary, not a taxonomy.
// StickyContact (root layout, so every route) imports `clinic`, and Navbar and
// MobileMenu import `navLinks`. All three are client components, so whatever
// module they import gets compiled into the client bundle.
//
// That was the whole of lib/data/site.ts. It could not be tree-shaken down to
// the two constants actually used, because line 471 of that file is
//
//     export const treatmentSlugs = treatments.map((t) => t.slug);
//
// a module-scope call webpack cannot prove is side-effect free — so it must
// evaluate `treatments` to produce it, and `treatments` (and `doctors` beside
// it) is retained for every importer. The result was all ten treatment records
// and all five doctor bios sitting in the layout chunk of every route,
// measured at 23.6 kB raw / 9.5 kB brotli, for the sake of a phone number and
// five nav labels.
//
// So: nothing in this file may import from site.ts, or the boundary is gone.
// Keep it a leaf.
// ---------------------------------------------------------------------------

export interface Clinic {
  name: string;
  tagline: string;
  established: number;
  phone: string;
  /** Separate from `phone` on purpose — the landline cannot receive WhatsApp. */
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
}

/**
 * Routes that actually exist in the App Router today. Widen this union when a
 * new route ships — never hand a NavLink a string.
 */
export type SupportedRoute =
  | "/"
  | "/treatments"
  | "/doctors"
  | "/contact"
  | "/gallery"
  | "/book";

/**
 * A nav link is either a "coming soon" placeholder, or a real destination that
 * MUST carry both the route it lives on and an in-page `scroll` target. The
 * union makes the inert-link bug unrepresentable: after the `soon` check,
 * `to` and `scroll` are both guaranteed.
 */
export type NavLink =
  | {
      label: string;
      /** Renders a "coming soon" toast instead of navigating. */
      soon: true;
    }
  | {
      label: string;
      soon?: false;
      /** Route the section lives on. Required — drives cross-page navigation. */
      to: SupportedRoute;
      /** In-page selector to smooth-scroll to once on `to`. Required. */
      scroll: string;
    };

export const clinic: Clinic = {
  name: "Maison Lumé",
  tagline: "Aesthetic & Cosmetic Clinic",
  established: 2009,
  phone: "+44 20 7946 0123",
  // PLACEHOLDER — Ofcom drama-reserved mobile range, unmistakably fake. Swap
  // for the real number before any of this is shown to a visitor.
  whatsapp: "+44 7700 900123",
  email: "hello@maisonlume.com",
  address: "24 Marchmont Row, Mayfair, London W1",
  hours: "Mon – Sat · 9:00 – 19:00",
};

// Every link is live now that /gallery has shipped. Order is deliberate:
// Gallery sits last because it is a design-isolated full-screen experience
// (see app/gallery/) rather than another page of the site proper — leaving the
// site is the point of it, so it reads as the end of the list.
//
// This one array is the only place nav order is expressed: Navbar, MobileMenu
// and the Footer "Explore" column all map over it, so reordering here reorders
// all three. The `soon` arm of NavLink has no instances at the moment; it stays
// because it is how the next unbuilt page gets listed without a dead link.
//
// `/book` is deliberately absent: it is a CTA destination, not a section of the
// site, and listing it would put "Book" directly above the gold Book a
// Consultation button in both the footer column and the mobile menu.
export const navLinks: NavLink[] = [
  { label: "Home", to: "/", scroll: "#top" },
  // Every entry scrolls to "#top". A section hash here would be pushed as a URL
  // fragment on cross-page navigation (see lib/use-site-nav.ts) and then honoured
  // by <RouteTransition />, so the main nav item would open the route part-way
  // down — and the hash would persist through refresh and back/forward.
  { label: "Treatments", to: "/treatments", scroll: "#top" },
  { label: "Doctors", to: "/doctors", scroll: "#top" },
  { label: "Contact", to: "/contact", scroll: "#top" },
  { label: "Gallery", to: "/gallery", scroll: "#top" },
];
