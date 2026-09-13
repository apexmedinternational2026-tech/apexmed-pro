"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fraction of the element that must be visible before it reveals. */
  threshold?: number;
}

/**
 * The site's one entrance animation (see .reveal-init/.reveal-visible in
 * app/globals.css), applied via IntersectionObserver instead of a
 * scroll-linked library. Use sparingly — wrapping every element on a page
 * defeats the "restraint" this exists for. prefers-reduced-motion is
 * handled entirely in CSS, so this component doesn't need to branch on it.
 */
export function Reveal({ className, threshold = 0.2, ...props }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return <div ref={ref} className={cn(visible ? "reveal-visible" : "reveal-init", className)} {...props} />;
}
