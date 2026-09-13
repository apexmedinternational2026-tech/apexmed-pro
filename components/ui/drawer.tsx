"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";
import { CloseIcon } from "./icons";

// A side-sheet built on the same Radix Dialog primitive as components/ui/
// dialog.tsx (focus trap, Escape, overlay all come for free) — only the
// content's position/animation-origin differs, so this isn't a second
// implementation of dialog behavior, just a different DialogContent shell.
export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-navy-950/50" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col overflow-y-auto border-l border-navy-800/10 bg-white p-6 shadow-xl focus:outline-none",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 text-slate-500 transition-colors hover:bg-navy-950/5 hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500">
        <CloseIcon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DrawerContent.displayName = "DrawerContent";

export function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-5 flex flex-col gap-1.5 pr-8", className)} {...props} />;
}

export const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("font-display text-display-sm text-ink-900", className)} {...props} />
));
DrawerTitle.displayName = DialogPrimitive.Title.displayName;

export const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-body-sm text-slate-500", className)} {...props} />
));
DrawerDescription.displayName = DialogPrimitive.Description.displayName;
