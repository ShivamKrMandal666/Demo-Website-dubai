import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-wide transition-[transform,background-color,box-shadow,color,border-color,filter] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 hover:-translate-y-0.5",
        gold: "bg-accent text-accent-foreground shadow-gold hover:-translate-y-0.5 hover:brightness-[1.05]",
        espresso: "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/90 hover:-translate-y-0.5",
        hero: "border border-bone/40 bg-bone/10 text-bone backdrop-blur-md hover:bg-bone/20 hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-transparent hover:bg-muted hover:text-foreground",
        outlineSage: "border border-primary/40 bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        outlineGold: "border border-gold/50 bg-transparent text-gold hover:bg-gold hover:text-accent-foreground",
        outlineBone: "border border-bone/30 bg-transparent text-bone hover:bg-bone/10",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        linkGold: "text-gold underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-md px-8 text-[0.9rem]",
        // Stepped, because the base is `whitespace-nowrap`: two xl buttons in a
        // flex-wrap row ("Book a Consultation" + "Request a Callback") overflow
        // the content box on a 320px viewport at px-10/text-sm. Seven call sites
        // pair them that way, so the fix belongs here rather than at each one.
        xl: "h-12 rounded-md px-6 text-xs sm:h-14 sm:px-10 sm:text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
