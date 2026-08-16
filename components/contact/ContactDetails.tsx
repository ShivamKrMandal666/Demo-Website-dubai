import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ScrollButton } from "@/components/site/ScrollButton";
import { SectionLabel } from "@/components/site/SectionLabel";
import { RESPONSE_WINDOW_HOURS } from "@/lib/data/consultation";
import { telHref } from "@/lib/consultation";
import { clinic } from "@/lib/data/site";

// The footer already lists the same address, phone, email and hours, and the
// map card repeats the address again. Restating them here would be the third
// copy — so this block's job is to make them *actionable* rather than to
// introduce anything new: `tel:` and `mailto:` that work on a phone, an anchor
// into the map further down the page, and the one thing the footer cannot say —
// how long a reply takes.
export const ContactDetails = () => (
  <aside className="rounded-3xl border border-border bg-card p-8 shadow-soft md:p-10">
    <SectionLabel>Speak to us directly</SectionLabel>

    <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground">
      Prefer not to fill in a form? Call or write, and the same team answers.
      Either way we reply within {RESPONSE_WINDOW_HOURS} hours.
    </p>

    <ul className="mt-8 space-y-6">
      <li className="flex items-start gap-4">
        <Phone className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
            Telephone
          </p>
          <a
            href={telHref(clinic.phone)}
            className="mt-1 block font-sans text-base text-foreground underline-offset-4 transition-colors duration-300 hover:text-primary hover:underline"
          >
            {clinic.phone}
          </a>
        </div>
      </li>

      <li className="flex items-start gap-4">
        <Mail className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
            Email
          </p>
          <a
            href={`mailto:${clinic.email}`}
            className="mt-1 block font-sans text-base text-foreground underline-offset-4 transition-colors duration-300 hover:text-primary hover:underline"
          >
            {clinic.email}
          </a>
        </div>
      </li>

      <li className="flex items-start gap-4">
        <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
            The clinic
          </p>
          <p className="mt-1 font-sans text-base text-foreground">
            {clinic.address}
          </p>
          {/* MapSection sits further down this same page. ScrollButton rather
              than a bare anchor: it is the Lenis-aware path, and it applies the
              72px offset that stops the heading landing under the fixed navbar. */}
          <ScrollButton
            to="#location"
            variant="link"
            className="mt-1 h-auto justify-start px-0 text-sm"
          >
            See it on the map
          </ScrollButton>
        </div>
      </li>

      <li className="flex items-start gap-4">
        <Clock className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
            Opening hours
          </p>
          <p className="mt-1 font-sans text-base text-foreground">
            {clinic.hours}
          </p>
          <p className="mt-1 font-sans text-sm text-muted-foreground">
            Closed Sundays and bank holidays.
          </p>
        </div>
      </li>
    </ul>
  </aside>
);
