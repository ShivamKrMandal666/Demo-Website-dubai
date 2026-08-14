"use client";

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
import { BOOKING_TOAST } from "@/components/site/ToastButton";
import { navLinks, clinic, type NavLink as NavLinkType } from "@/lib/data/site";

// Split out of Navbar so `@radix-ui/react-dialog` can be code-split behind a
// dynamic import — it is the only consumer of Radix on the whole site, and the
// menu is closed on first paint of every route. Markup is unchanged from when
// this lived inline in Navbar.
export const MobileMenu = ({
  scrolled,
  onNavigate,
}: {
  scrolled: boolean;
  onNavigate: (link: NavLinkType) => void;
}) => {
  const handleBook = () => toast(BOOKING_TOAST.title, { description: BOOKING_TOAST.description });

  return (
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
                onClick={() => onNavigate(link)}
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
  );
};
