"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/cn";
import { ChevronDownIcon } from "./icons";

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b border-navy-800/15", className)} {...props} />
));
AccordionItem.displayName = AccordionPrimitive.Item.displayName;

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between gap-4 py-4 text-left font-display text-display-sm text-ink-900",
        "[&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200"
        aria-hidden="true"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  // No open/close animation here on purpose — the reveal keyframe in
  // app/globals.css is the site's one motion pattern, reserved for
  // scroll-entrance; an accordion doesn't get its own separate effect.
  <AccordionPrimitive.Content ref={ref} className="overflow-hidden text-body-md text-ink-900" {...props}>
    <div className={cn("pb-4", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
