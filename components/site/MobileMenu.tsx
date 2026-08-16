"use client";

import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BOOK_CTA_LABEL } from "@/components/site/BookButton";
import { telHref } from "@/lib/consultation";
import { navLinks, clinic, type NavLink as NavLinkType } from "@/lib/data/site";
import { cn } from "@/lib/utils";

// The sliding panel only — `@radix-ui/react-dialog` is the sole Radix consumer
// on the site, so it is code-split behind Navbar's dynamic import. The trigger
// deliberately lives in Navbar instead of here: a `ssr: false` chunk renders
// nothing on the server, and the mobile nav affordance has to be in the
// prerendered HTML. Navbar owns the open state and passes it down.
export const MobileMenu = ({
  open,
  onOpenChange,
  onNavigate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (link: NavLinkType) => void;
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
          {/* Not <SheetClose asChild><BookButton/></SheetClose>: SheetClose
              clones its child through Radix `Slot` to merge onClick and ref,
              and BookButton forwards neither — the panel would silently stay
              open over /book, since a client-side navigation does not close a
              Radix Dialog by itself. `buttonVariants` + Link is the composition
              that survives being cloned. */}
          <SheetClose asChild>
            <Link
              href="/book"
              className={cn(
                buttonVariants({ variant: "gold", size: "lg" }),
                "w-full rounded-full",
              )}
            >
              {BOOK_CTA_LABEL}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </SheetClose>
          <a
            href={telHref(clinic.phone)}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <Phone className="h-4 w-4" /> {clinic.phone}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
};
