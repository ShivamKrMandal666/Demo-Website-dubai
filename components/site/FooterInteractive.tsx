"use client";

import { Instagram, Facebook, Youtube, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { navLinks } from "@/lib/data/clinic";
import { useSiteNav } from "@/lib/use-site-nav";

// ---------------------------------------------------------------------------
// The three interactive clusters lifted out of Footer.tsx so the Footer itself
// can go back to being a server component.
//
// Why it was worth splitting: Footer was `"use client"` and imported
// `treatments` from lib/data/site, which put all ten treatment records — the
// largest array in that 682-line module, ~288 lines of prose — into the client
// graph on EVERY route, Footer being shared chrome. The Footer's treatment list
// is a plain list of links with no interactivity; only these three clusters
// ever needed the client.
//
// `navLinks` still crosses the boundary here, and that costs nothing new:
// Navbar is a client component on every route and already imports it, as does
// StickyContact for `clinic`. What no longer crosses is `treatments`.
//
// Markup is carried over verbatim — same elements, same classNames, same hover
// transitions — so nothing about the rendered footer changes. These are leaves,
// not wrappers: they own only their own buttons, which keeps the rest of the
// footer (headings, the treatment links, the contact block and its four lucide
// icons) server-rendered.
// ---------------------------------------------------------------------------

const socials = [
  { Icon: Instagram, label: "Instagram" },
  { Icon: Facebook, label: "Facebook" },
  { Icon: Youtube, label: "YouTube" },
  { Icon: Linkedin, label: "LinkedIn" },
];

export const FooterSocials = () => (
  <div className="mt-6 flex gap-3">
    {socials.map(({ Icon, label }) => (
      <button
        key={label}
        aria-label={label}
        onClick={() => toast(`${label} link coming soon`)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-bone/20 text-bone/70 transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-accent-foreground"
      >
        <Icon className="h-4 w-4" />
      </button>
    ))}
  </div>
);

// Navigates with router.push from a <button>, never an <a> — see the note in
// lib/use-site-nav.ts and the one in RouteProgress about why the progress bar
// has to be told explicitly.
export const FooterNavLinks = () => {
  const handleNav = useSiteNav();

  return (
    <ul className="mt-5 space-y-3">
      {navLinks.map((link) => (
        <li key={link.label}>
          <button
            onClick={() => handleNav(link)}
            className="font-sans text-sm text-bone/70 transition-colors duration-300 hover:text-bone"
          >
            {link.label}
          </button>
        </li>
      ))}
    </ul>
  );
};

export const FooterLegal = () => (
  <div className="flex gap-6">
    {["Privacy Policy", "Terms", "Cookies"].map((l) => (
      <button
        key={l}
        onClick={() => toast(`${l} — coming soon`)}
        className="font-sans text-xs text-bone/50 transition-colors hover:text-bone/80"
      >
        {l}
      </button>
    ))}
  </div>
);
