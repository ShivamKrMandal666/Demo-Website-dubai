import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { bookHref } from "@/lib/consultation";
import type { DoctorSlug, TreatmentSlug } from "@/lib/data/site";

// Every booking CTA on the site. Replaces ToastButton + BOOKING_TOAST, which
// fired a toast claiming a request had been received without one being made.
//
// No "use client" on purpose, and no hooks: that makes this a *shared*
// component. Imported by a server page (TreatmentsPage, TreatmentDetailPage,
// DoctorsPage, CtaBand) it stays on the server and ships nothing; imported by a
// client one (Hero, Navbar, Footer) it compiles into that bundle. Four pages
// therefore stop pulling a client leaf — and sonner with it — into their route
// chunks.
//
// The `asChild` + next/link composition is the same one already used at
// TreatmentDetailPage.tsx:273 and home/Doctors.tsx:169.

interface BookButtonProps
  extends Omit<ButtonProps, "asChild" | "onClick" | "children" | "type"> {
  /** Prefills Preferred Treatment on /book. */
  treatment?: TreatmentSlug;
  /** Prefills Preferred Doctor on /book. */
  doctor?: DoctorSlug;
  /** Contextual override, e.g. "Consult with Marcus". */
  label?: string;
  showIcon?: boolean;
}

/**
 * The one place this copy exists. "Consultation", never "Book Now" — the flow
 * is a request the clinic confirms, not instant self-booking, and the button
 * has to say so.
 */
export const BOOK_CTA_LABEL = "Book a Consultation";

export const BookButton = ({
  treatment,
  doctor,
  label,
  showIcon = true,
  ...buttonProps
}: BookButtonProps) => (
  <Button asChild {...buttonProps}>
    <Link href={bookHref({ treatment, doctor })}>
      {label ?? BOOK_CTA_LABEL}
      {showIcon && <ArrowUpRight className="h-4 w-4" />}
    </Link>
  </Button>
);
