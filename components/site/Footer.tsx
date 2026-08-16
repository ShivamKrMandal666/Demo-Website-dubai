"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Youtube, Linkedin, Phone, Mail, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BookButton } from "@/components/site/BookButton";
import { navLinks, treatments, clinic } from "@/lib/data/site";
import { useSiteNav } from "@/lib/use-site-nav";
import { textures } from "@/lib/images";

const socials = [
  { Icon: Instagram, label: "Instagram" },
  { Icon: Facebook, label: "Facebook" },
  { Icon: Youtube, label: "YouTube" },
  { Icon: Linkedin, label: "LinkedIn" },
];

export const Footer = () => {
  const handleNav = useSiteNav();

  return (
    // Sits as its own block below the map section — no overlap. The gold
    // hairline plus the top border define the seam against the page above.
    // `id="contact"` used to live here, as the target of the Contact nav link
    // back when there was no Contact page. /contact is a real route now, so the
    // id has no consumers — and keeping it would put a duplicate `#contact` in
    // the DOM on the very page that replaced it.
    <footer className="relative overflow-hidden border-t border-gold/20 bg-secondary pt-20 shadow-elegant md:pt-28">
      {/* espresso texture */}
      <div className="absolute inset-0 opacity-40" aria-hidden="true">
        <Image src={textures.footer} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-secondary/60" aria-hidden="true" />
      {/* top hairline accent to define the overlap edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" aria-hidden="true" />

      <div className="container relative z-10 mx-auto">
        <div className="grid gap-12 pb-14 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-bone/40 text-bone">
                <span className="font-serif text-lg italic leading-none">L</span>
              </span>
              <span className="font-serif text-2xl tracking-editorial text-bone">{clinic.name}</span>
            </div>
            <p className="mt-5 max-w-xs font-sans text-sm leading-relaxed text-bone/60">
              A private aesthetic &amp; cosmetic clinic devoted to natural,
              considered results — in the heart of Mayfair.
            </p>
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
          </div>

          {/* Quick links */}
          <div className="md:col-span-2">
            <h4 className="font-sans text-xs uppercase tracking-[0.24em] text-gold">Explore</h4>
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
          </div>

          {/* Treatments */}
          <div className="md:col-span-3">
            <h4 className="font-sans text-xs uppercase tracking-[0.24em] text-gold">Treatments</h4>
            <ul className="mt-5 space-y-3">
              {treatments.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/treatments/${t.slug}`}
                    className="text-left font-sans text-sm text-bone/70 transition-colors duration-300 hover:text-bone"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="font-sans text-xs uppercase tracking-[0.24em] text-gold">Visit &amp; Contact</h4>
            <ul className="mt-5 space-y-4 font-sans text-sm text-bone/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" /> {clinic.address}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold/80" /> {clinic.phone}
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold/80" /> {clinic.email}
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-gold/80" /> {clinic.hours}
              </li>
            </ul>
            <BookButton variant="gold" size="sm" className="mt-6 rounded-full" />
          </div>
        </div>

        {/* bottom bar */}
        <div className={cn("flex flex-col items-center justify-between gap-4 border-t border-bone/15 py-7 sm:flex-row")}>
          <p className="font-sans text-xs text-bone/50">
            © {new Date().getFullYear()} {clinic.name}. All rights reserved.
          </p>
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
        </div>
      </div>
    </footer>
  );
};
