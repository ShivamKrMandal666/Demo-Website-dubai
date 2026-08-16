"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookButton } from "@/components/site/BookButton";
// The mobile menu panel is the only thing on the site that uses Radix Dialog,
// and it is closed on first paint of every route, so it loads on demand and
// @radix-ui/react-dialog stays out of the initial bundle. `ssr: false` is safe
// because a closed Sheet renders no DOM at all — and the trigger it used to
// own now lives in this file, so the mobile nav affordance is in the
// server-rendered HTML rather than appearing only after hydration.
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
  const [menuOpen, setMenuOpen] = useState(false);
  // Gate on the panel chunk: false until we deliberately fetch it, so the
  // dynamic import is not part of the hydration critical path.
  const [panelReady, setPanelReady] = useState(false);
  const handleNavigate = useSiteNav();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Warm the panel chunk once the main thread is idle, so the first tap on the
  // trigger opens instantly instead of waiting on a network round trip.
  useEffect(() => {
    const warm = () => setPanelReady(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warm, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(warm, 2000);
    return () => window.clearTimeout(id);
  }, []);

  // If the tap beats the idle callback, load the chunk now — `open` is already
  // true, so the Sheet opens the moment the module resolves.
  const openMenu = () => {
    setPanelReady(true);
    setMenuOpen(true);
  };

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
          <BookButton
            variant="gold"
            size="sm"
            className="hidden rounded-full sm:inline-flex"
          />

          {/* Mobile menu trigger. Rendered here, not in MobileMenu, so it is
              present in the server-rendered HTML — see the import comment. */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={openMenu}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 lg:hidden",
              scrolled
                ? "border-border text-foreground hover:bg-muted"
                : "border-bone/40 text-bone hover:bg-bone/10",
            )}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* The panel itself — code-split, see the import at the top. */}
          {panelReady && (
            <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} onNavigate={handleNavigate} />
          )}
        </div>
      </nav>
    </header>
  );
};
