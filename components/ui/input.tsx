import * as React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md border border-navy-800/30 bg-white px-3.5 text-body-md text-ink-900",
        "placeholder:text-slate-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-[invalid=true]:border-error",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
