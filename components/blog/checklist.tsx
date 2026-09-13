import { CheckIcon } from "@/components/ui/icons";

/** MDX shortcode: <Checklist items={["...", "..."]} /> */
export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5 rounded-xl border border-navy-800/10 bg-paper-50 p-5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-body-md text-ink-900">
          <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-navy-950 text-paper-50">
            <CheckIcon className="h-3 w-3" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
