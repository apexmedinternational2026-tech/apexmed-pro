import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const containerVariants = cva("mx-auto w-full px-6 sm:px-8 lg:px-10", {
  variants: {
    bleed: {
      // Default: content is centered and width-capped, like every other
      // section on the page.
      false: "max-w-6xl",
      // The one deliberate exception per page: content runs edge to edge,
      // ignoring the shared max-width entirely — see the brief's "one
      // section per page that breaks the container width."
      true: "max-w-none px-0 sm:px-0 lg:px-0",
    },
  },
  defaultVariants: {
    bleed: false,
  },
});

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {}

export function Container({ className, bleed, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ bleed }), className)} {...props} />;
}
