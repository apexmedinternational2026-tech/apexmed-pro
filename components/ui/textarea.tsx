import * as React from "react";
import { cn } from "@/lib/cn";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-32 w-full rounded-md border border-navy-800/30 bg-white px-3.5 py-3 text-body-md text-ink-900",
        "placeholder:text-slate-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-[invalid=true]:border-error",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
