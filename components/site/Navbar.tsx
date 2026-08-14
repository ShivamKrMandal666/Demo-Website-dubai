"use client";

import { useEffect, useState } from "react";
import { Menu, ArrowUpRight, Phone } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { navLinks, clinic, type NavLink as NavLinkType } from "@/lib/data/site";
import { scrollToId } from "@/lib/smooth-scroll";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavigate = (link: NavLinkType) => {
    if (link.soon) {
      toast("Gallery is on its way", {
        description: "This page is coming soon — check back shortly.",
      });
      return;
    }
    scrollToId(link.target);
  };

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
          onClick={() => scrollToId("#top")}
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

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 lg:hidden",
                  scrolled
                    ? "border-border text-foreground hover:bg-muted"
                    : "border-bone/40 text-bone hover:bg-bone/10",
                )}
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm border-border bg-background">
              <SheetHeader>
                <SheetTitle className="text-left font-serif text-2xl text-foreground">
                  Maison Lumé
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.label}>
                    <button
                      onClick={() => handleNavigate(link)}
                      className="group flex items-center justify-between border-b border-border/60 py-4 text-left font-serif text-xl text-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </SheetClose>
                ))}
              </div>
              <div className="mt-8 space-y-4">
                <SheetClose asChild>
                  <Button onClick={handleBook} variant="gold" size="lg" className="w-full rounded-full">
                    Book an Appointment
                  </Button>
                </SheetClose>
                <a
                  href={`tel:${clinic.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                >
                  <Phone className="h-4 w-4" /> {clinic.phone}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};
