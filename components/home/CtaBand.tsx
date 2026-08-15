import { ArrowUpRight } from "lucide-react";
import { ToastButton, BOOKING_TOAST } from "@/components/site/ToastButton";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Reveal } from "@/components/site/Reveal";
import { textures } from "@/lib/images";

export const CtaBand = () => (
  <section className="relative overflow-hidden">
    {/* Full-bleed background behind a smaller content block. Stays a CSS
        background on purpose: `bg-fixed` (the desktop parallax) has no
        next/image equivalent, and keeping the effect outranks the ~41 KB
        WebP would save here. */}
    <div
      className="absolute inset-0 bg-cover bg-center md:bg-fixed"
      style={{ backgroundImage: `url(${textures.ctaBand.src})` }}
      aria-hidden="true"
    />
    <div className="absolute inset-0 bg-espresso-deep/70" aria-hidden="true" />
    <div className="absolute inset-0 bg-gradient-to-r from-espresso-deep/85 via-espresso-deep/45 to-transparent" aria-hidden="true" />

    <div className="container relative z-10 mx-auto py-24 md:py-32">
      <div className="max-w-xl">
        <Reveal><SectionLabel onDark>Begin Your Journey</SectionLabel></Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 font-serif text-3xl leading-tight tracking-editorial text-bone text-balance sm:text-4xl lg:text-5xl">
            Your consultation begins with a conversation
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-bone/80">
            Share your goals with our team and we&rsquo;ll design a considered,
            unhurried plan — no pressure, only expertise.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-wrap gap-4">
            <ToastButton
              title={BOOKING_TOAST.title}
              description={BOOKING_TOAST.description}
              variant="gold"
              size="xl"
              className="rounded-full"
            >
              Book an Appointment
              <ArrowUpRight className="h-4 w-4" />
            </ToastButton>
            <ToastButton
              title="We&rsquo;ll be in touch"
              description="Leave your details and our team will call you back."
              variant="outlineBone"
              size="xl"
              className="rounded-full"
            >
              Request a Callback
            </ToastButton>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
