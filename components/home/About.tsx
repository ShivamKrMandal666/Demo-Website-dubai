import Image from "next/image";
import { ImageIcon, ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Reveal } from "@/components/site/Reveal";
import { ScrollButton } from "@/components/site/ScrollButton";
import { textures } from "@/lib/images";

const stats = [
  { value: "15+", label: "Years of practice" },
  { value: "40k+", label: "Treatments delivered" },
  { value: "98%", label: "Would recommend" },
];

export const About = () => (
  <section id="about" className="relative bg-background py-24 md:py-32">
    <div className="container mx-auto">
      <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
        {/* Foreground image placeholder (client-supplied) */}
        <Reveal x={-30} y={0} className="md:col-span-5">
          <div className="relative">
            {/* offset texture panel for depth */}
            <div
              className="absolute -left-4 -top-4 hidden h-full w-full overflow-hidden rounded-2xl opacity-70 md:block"
              aria-hidden="true"
            >
              <Image
                src={textures.about}
                alt=""
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -left-4 -top-4 hidden h-full w-full rounded-2xl bg-primary/10 md:block" aria-hidden="true" />
            <div className="relative flex aspect-[4/5] flex-col items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-muted/70 shadow-soft">
              <ImageIcon className="h-8 w-8 text-primary/50" />
              <span className="mt-3 font-sans text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground">
                Foreground image
              </span>
            </div>
            {/* floating accent stat */}
            <div className="absolute -bottom-6 -right-4 rounded-xl bg-secondary px-6 py-4 shadow-elegant md:-right-6">
              <p className="font-serif text-3xl text-gold">Est. 2009</p>
              <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-bone/70">
                Mayfair, London
              </p>
            </div>
          </div>
        </Reveal>

        {/* Content */}
        <div className="md:col-span-6 md:col-start-7">
          <Reveal><SectionLabel>About the Maison</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-serif text-3xl leading-tight tracking-editorial text-foreground text-balance sm:text-4xl lg:text-[2.75rem]">
              Less a clinic, more a sanctuary for confident, natural beauty
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 space-y-4 font-sans text-base leading-relaxed text-muted-foreground">
              <p>
                Maison Lumé was founded on a simple belief — that aesthetic
                medicine should feel less like a procedure and more like being
                truly cared for. Every treatment begins with listening.
              </p>
              <p>
                Led by a team of doctors and specialists, we blend the latest in
                regenerative science with a restrained, natural aesthetic. No two
                faces are alike, and no two plans should be either.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-9 grid grid-cols-3 gap-4 border-y border-border py-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-3xl text-primary sm:text-4xl">{s.value}</p>
                  <p className="mt-1 font-sans text-xs leading-snug text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <ScrollButton
              to="#doctors"
              variant="outlineSage"
              size="lg"
              className="mt-8 rounded-full"
            >
              Meet our specialists
              <ArrowUpRight className="h-4 w-4" />
            </ScrollButton>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);
