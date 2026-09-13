import * as React from "react";
import { cn } from "@/lib/cn";

export interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

/**
 * Renders nothing when there's no message, so a form can unconditionally
 * mount `<FieldError>{errors.email?.message}</FieldError>` under every
 * field without an extra `{errors.email && ...}` guard at each call site.
 */
export function FieldError({ children, className, ...props }: FieldErrorProps) {
  if (!children) return null;

  return (
    <p role="alert" className={cn("text-caption text-error", className)} {...props}>
      {children}
    </p>
  );
}
