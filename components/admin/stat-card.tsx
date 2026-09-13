export function StatCard({ label, value, caption }: { label: string; value: number | string; caption?: string }) {
  return (
    <div className="rounded-xl border border-navy-800/10 bg-white p-5">
      <p className="text-caption font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 font-display text-display-lg text-ink-900">{value}</p>
      {caption && <p className="mt-1 text-body-sm text-slate-500">{caption}</p>}
    </div>
  );
}

export function GroupedCountList({
  items,
  emptyLabel,
}: {
  items: { label: string; count: number }[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-body-sm text-slate-500">{emptyLabel}</p>;
  }

  const max = Math.max(...items.map((item) => item.count));

  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="min-w-0 flex-1 truncate text-body-sm text-ink-900">{item.label}</span>
            <span className="text-body-sm font-semibold text-ink-900">{item.count}</span>
          </div>
          <div className="hidden h-1.5 w-24 flex-none overflow-hidden rounded-full bg-navy-950/5 sm:block">
            <div className="h-full rounded-full bg-gold-500" style={{ width: `${(item.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
