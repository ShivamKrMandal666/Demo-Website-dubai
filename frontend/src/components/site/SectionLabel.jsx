import { cn } from "@/lib/utils";

// Editorial eyebrow: a hairline rule + letter-spaced label.
export const SectionLabel = ({ children, onDark = false, align = "left", className }) => (
  <div
    className={cn(
      "flex items-center gap-3",
      align === "center" && "justify-center",
      className,
    )}
  >
    <span className={cn("h-px w-8", onDark ? "bg-gold" : "bg-primary/70")} />
    <span
      className={cn(
        "font-sans text-[0.7rem] font-medium uppercase tracking-[0.3em]",
        onDark ? "text-gold" : "text-primary",
      )}
    >
      {children}
    </span>
  </div>
);
