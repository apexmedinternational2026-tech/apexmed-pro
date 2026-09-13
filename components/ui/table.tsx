import * as React from "react";
import { cn } from "@/lib/cn";

// Plain semantic-HTML table wrappers, not a headless data-table library —
// every admin list in this app is small enough (paginated server-side)
// that virtualization/column-sorting infrastructure would be pure
// overhead. Filtering/sorting live in the query layer instead.

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-navy-800/10">
      <table className={cn("w-full min-w-[640px] border-collapse text-left", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-paper-50", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-navy-800/10", className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("transition-colors hover:bg-navy-950/[0.02]", className)} {...props} />;
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-navy-800/15 px-4 py-3 text-caption font-semibold uppercase tracking-wide text-slate-500",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3 text-body-sm text-ink-900", className)} {...props} />;
}

export function TableEmpty({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-body-sm text-slate-500">
        {children}
      </td>
    </tr>
  );
}
