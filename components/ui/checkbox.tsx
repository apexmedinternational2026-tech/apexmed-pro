"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/cn";
import { CheckIcon } from "./icons";

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded border border-navy-800/40 bg-white transition-colors",
      "data-[state=checked]:border-navy-950 data-[state=checked]:bg-navy-950",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-paper-50">
      <CheckIcon className="h-3.5 w-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
