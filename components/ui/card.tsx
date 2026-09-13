import * as React from "react";
import { cn } from "@/lib/cn";
import { accentStyle, type AccentToken } from "@/lib/accent";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tints the top border and any descendant using the `--accent` var — see lib/accent.ts. */
  accent?: AccentToken;
}

export function Card({ className, accent, style, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-navy-800/10 bg-white p-6",
        "shadow-[0_1px_2px_rgba(10,26,60,0.04),0_8px_24px_-12px_rgba(10,26,60,0.16)]",
        accent && "border-t-4 border-t-[var(--accent)]",
        className,
      )}
      style={accent ? { ...accentStyle(accent), ...style } : style}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 flex flex-col gap-1.5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-display text-display-md text-ink-900", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-body-sm text-slate-500", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-body-md text-ink-900", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-5 flex items-center gap-3", className)} {...props} />;
}
