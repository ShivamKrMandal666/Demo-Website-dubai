import { MapPin, Navigation } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { clinic } from "@/data/site";

// Stylised map placeholder (no live API integration in this prototype).
// Sits with a negative bottom margin so it bleeds behind the footer top.
export const MapSection = () => (
  <section id="location" className="relative z-0 -mb-28 px-5 md:-mb-40 md:px-8 lg:px-16">
    <div className="mx-auto max-w-7xl">
      <Reveal y={40}>
        <div className="relative h-[440px] overflow-hidden rounded-3xl border border-border shadow-elegant md:h-[560px]">
          {/* faux map surface */}
          <div className="absolute inset-0 bg-muted" />
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
              backgroundSize: "46px 46px",
            }}
            aria-hidden="true"
          />
          {/* diagonal 'avenues' */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(115deg, transparent 48%, hsl(var(--primary) / 0.25) 48.6%, hsl(var(--primary) / 0.25) 49.4%, transparent 50%), linear-gradient(200deg, transparent 62%, hsl(var(--accent) / 0.3) 62.6%, hsl(var(--accent) / 0.3) 63.4%, transparent 64%)",
            }}
            aria-hidden="true"
          />

          {/* centre pin */}
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex items-center justify-center">
              <span className="absolute h-16 w-16 rounded-full bg-primary/30 animate-pulse-ring" />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elegant">
                <MapPin className="h-6 w-6" />
              </span>
            </div>
          </div>

          {/* placeholder chip */}
          <div className="absolute left-5 top-5 rounded-full border border-border bg-background/85 px-4 py-2 backdrop-blur-sm">
            <span className="font-sans text-[0.66rem] uppercase tracking-[0.22em] text-muted-foreground">
              Google Maps embed placeholder
            </span>
          </div>

          {/* floating address card */}
          <div className="absolute bottom-5 left-5 max-w-xs rounded-2xl border border-border bg-background/90 p-5 shadow-soft backdrop-blur-md">
            <p className="font-serif text-lg text-foreground">{clinic.name}</p>
            <p className="mt-1 font-sans text-sm text-muted-foreground">{clinic.address}</p>
            <button
              className="mt-3 inline-flex items-center gap-2 font-sans text-xs font-medium uppercase tracking-[0.18em] text-primary transition-colors hover:text-primary/70"
            >
              <Navigation className="h-3.5 w-3.5" /> Get directions
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
