"use client";

import { Star, ExternalLink, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Reveal, RevealStagger, RevealItem } from "@/components/site/Reveal";
import { testimonials, googleRating } from "@/lib/data/site";
import { textures } from "@/lib/images";

const GoogleG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const Stars = ({ value = 5, className }: { value?: number; className?: string }) => (
  <div className={cn("flex items-center gap-0.5", className)}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={cn("h-4 w-4", i < value ? "fill-gold text-gold" : "text-muted-foreground/40")} />
    ))}
  </div>
);

export const Testimonials = () => (
  <section id="testimonials" className="relative overflow-hidden py-24 md:py-32">
    {/* travertine background behind an inset content block */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${textures.testimonial})` }}
      aria-hidden="true"
    />
    <div className="absolute inset-0 bg-gradient-fade-bone" aria-hidden="true" />

    <div className="container relative z-10 mx-auto">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <SectionLabel align="center">What Our Clients Say</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-6 max-w-3xl text-center font-serif text-3xl leading-tight tracking-editorial text-foreground text-balance sm:text-4xl lg:text-5xl">
            Trusted by those who value the quiet difference
          </h2>
        </Reveal>

        {/* Google ratings display block */}
        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-between gap-6 rounded-2xl border border-border bg-card/85 p-6 shadow-soft backdrop-blur-sm sm:flex-row sm:p-7">
            <div className="flex items-center gap-4">
              <GoogleG className="h-10 w-10" />
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-serif text-4xl leading-none text-foreground">{googleRating.score}</span>
                  <Stars value={5} />
                </div>
                <p className="mt-1 font-sans text-sm text-muted-foreground">
                  Based on {googleRating.reviews.toLocaleString()} Google reviews
                </p>
              </div>
            </div>
            <Button
              onClick={() => toast("Opening Google Reviews", { description: "Live link will be connected shortly." })}
              variant="outlineSage"
              size="lg"
              className="rounded-full"
            >
              View on Google
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>

        {/* Testimonial cards */}
        <RevealStagger stagger={0.12} className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <RevealItem key={t.name} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card/90 p-7 shadow-soft backdrop-blur-sm transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-elegant">
                <Quote className="h-7 w-7 text-gold" />
                <blockquote className="mt-4 font-serif text-lg leading-relaxed text-foreground/90">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-auto pt-6">
                  <Stars value={5} className="mb-3" />
                  <p className="font-sans text-sm font-medium text-foreground">{t.name}</p>
                  <p className="font-sans text-xs uppercase tracking-[0.16em] text-muted-foreground">{t.treatment}</p>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </div>
  </section>
);
