import * as React from "react";
import { cn } from "@/lib/cn";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-navy-950/8", className)} {...props} />;
}
