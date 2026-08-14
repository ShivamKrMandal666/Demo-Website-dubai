"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// The mobile menu is the only thing on the site that uses Radix Dialog, and it
// starts closed on every route. Loading it on demand keeps
// @radix-ui/react-dialog out of the initial bundle; `ssr: false` is safe
// because a closed Sheet renders nothing but its trigger, which lives below.
const MobileMenu = dynamic(
  () => import("@/components/site/MobileMenu").then((m) => m.MobileMenu),
  { ssr: false },
);
import { navLinks, clinic, type NavLink as NavLinkType } from "@/lib/data/site";
import { useSiteNav } from "@/lib/use-site-nav";

// The wordmark behaves like the Home nav link: scroll to top when already
// home, navigate home from anywhere else.
const homeLink: NavLinkType = { label: "Home", to: "/", scroll: "#top" };

interface NavLinkProps {
  link: NavLinkType;
  scrolled: boolean;
  onNavigate: (link: NavLinkType) => void;
}

const NavLink = ({ link, scrolled, onNavigate }: NavLinkProps) => (
  <button
    onClick={() => onNavigate(link)}
    className={cn(
      "group relative py-1 font-sans text-sm tracking-wide transition-colors duration-300",
      scrolled ? "text-foreground/80 hover:text-foreground" : "text-bone/85 hover:text-bone",
    )}
  >
    {link.label}
    <span
      className={cn(
        "absolute -bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 transition-[width] duration-300 group-hover:w-full",
        scrolled ? "bg-primary" : "bg-gold",
      )}
    />
  </button>
);

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const handleNavigate = useSiteNav();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleBook = () =>
    toast("Booking request received", {
      description: "Our concierge will confirm your appointment shortly.",
    });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter,border-color] duration-500",
        scrolled
          ? "border-b border-border/70 bg-background/85 shadow-soft backdrop-blur-lg"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="container mx-auto flex h-[72px] items-center justify-between">
        {/* Logo placeholder */}
        <button
          onClick={() => handleNavigate(homeLink)}
          className="flex items-center gap-3"
          aria-label={clinic.name}
        >
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300",
              scrolled ? "border-primary/40 text-primary" : "border-bone/50 text-bone",
            )}
          >
            <span className="font-serif text-lg italic leading-none">L</span>
          </span>
          <span className="flex flex-col leading-none">
            <span
              className={cn(
                "font-serif text-lg tracking-editorial transition-colors duration-300",
                scrolled ? "text-foreground" : "text-bone",
              )}
            >
              Maison Lumé
            </span>
            <span
              className={cn(
                "mt-1 font-sans text-[0.58rem] uppercase tracking-[0.34em] transition-colors duration-300",
                scrolled ? "text-muted-foreground" : "text-bone/60",
              )}
            >
              Aesthetic Clinic
            </span>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.label} link={link} scrolled={scrolled} onNavigate={handleNavigate} />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleBook}
            variant="gold"
            size="sm"
            className="hidden rounded-full sm:inline-flex"
          >
            Book an Appointment
            <ArrowUpRight className="h-4 w-4" />
          </Button>

          {/* Mobile menu — code-split, see the import at the top of the file */}
          <MobileMenu scrolled={scrolled} onNavigate={handleNavigate} />
        </div>
      </nav>
    </header>
  );
};
