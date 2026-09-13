import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-body font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-navy-950 text-paper-50 hover:bg-navy-900",
        secondary: "border border-navy-800/40 bg-transparent text-navy-950 hover:bg-navy-950/5",
        ghost: "bg-transparent text-navy-950 hover:bg-navy-950/5",
        gold: "bg-gold-500 text-navy-950 hover:bg-gold-400",
      },
      size: {
        sm: "h-9 px-3.5 text-body-sm",
        md: "h-11 px-5 text-body-md",
        lg: "h-13 px-7 text-body-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Render as the single child element (e.g. next/link's `<Link>`) instead of a `<button>`, via Radix Slot. */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";

export { buttonVariants };
