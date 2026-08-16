"use client";

import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { telHref, whatsappHref } from "@/lib/consultation";
import { clinic } from "@/lib/data/site";

// Quick-contact rail: chat or call from anywhere, on every page. Deliberately
// NOT a booking affordance — /book stays the only way into the consultation
// flow, so neither button is `gold`-as-CTA in the BookButton sense.
//
// Mounted once in the root layout, which makes it the first shared chrome to
// live there (Navbar and Footer are still rendered per page).

/**
 * Routes that own the whole viewport and opt out of shared chrome. The
 * exclusion lives here rather than in `app/gallery/` because that route is a
 * design island and may not import from `components/` (AGENTS.md) — it excludes
 * Navbar/Footer/Map by simply never importing them, which a root-layout
 * component cannot be excluded by. `startsWith` so any future `/gallery/*`
 * segment inherits it.
 */
const CHROMELESS_ROUTES = ["/gallery"];

// `size="icon"` is `h-10 w-10 rounded-md`; these turn it into a circular pill
// with a 44px tap target on mobile. `[&_svg]:size-5` has to sit on the parent:
// the button base's `[&_svg]:size-4` outranks any class put on the <svg> itself.
const PILL =
  "h-11 w-11 rounded-full hover:shadow-elegant sm:h-12 sm:w-12 [&_svg]:size-5";

// lucide-react ships no brand marks, so the glyph is inline — the same approach
// as the gallery's back chevron. Single path from simple-icons (CC0), rendered
// in `currentColor` so it takes the button variant's foreground token rather
// than WhatsApp green: no hardcoded colours outside app/gallery/.
const WhatsAppGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.4" />
  </svg>
);

export const StickyContact = () => {
  const pathname = usePathname();

  if (CHROMELESS_ROUTES.some((route) => pathname.startsWith(route))) return null;

  return (
    // z-40, not z-50: the mobile Sheet's overlay and panel are both z-50 and
    // this renders *after* {children} in the layout, so an equal z-index would
    // win the tie and float over an open menu. Under 50 means under the grain
    // overlay (z-index 41) too — the documented content/grain/chrome order.
    <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-2.5 md:bottom-8 md:right-6 md:gap-3">
      <Button asChild size="icon" className={PILL}>
        {/* Bare <a>, not next/link: wa.me is external and tel: is a protocol
            URL — the same composition MobileMenu already uses for the phone. */}
        <a
          href={whatsappHref(clinic.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
        >
          <WhatsAppGlyph />
        </a>
      </Button>

      <Button asChild variant="gold" size="icon" className={PILL}>
        <a href={telHref(clinic.phone)} aria-label={`Call ${clinic.name}`}>
          <Phone />
        </a>
      </Button>
    </div>
  );
};
