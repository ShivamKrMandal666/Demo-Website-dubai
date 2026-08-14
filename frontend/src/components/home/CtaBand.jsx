import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Reveal } from "@/components/site/Reveal";
import { textures } from "@/lib/assets";

export const CtaBand = () => (
  <section className="relative overflow-hidden">
    {/* full-bleed background image behind a smaller content block */}
    <div
      className="absolute inset-0 bg-cover bg-center md:bg-fixed"
      style={{ backgroundImage: `url(${textures.ctaBand})` }}
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
            <Button
              onClick={() => toast("Booking request received", { description: "Our concierge will confirm your appointment shortly." })}
              variant="gold"
              size="xl"
              className="rounded-full"
            >
              Book an Appointment
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => toast("We&rsquo;ll be in touch", { description: "Leave your details and our team will call you back." })}
              variant="outlineBone"
              size="xl"
              className="rounded-full"
            >
              Request a Callback
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
