"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CheckIcon, CloseIcon } from "@/components/ui/icons";

/**
 * Shows a dismissible "Saved" confirmation on an admin list page after a
 * create/edit form redirects back to it — the four forms that redirect on
 * success (mentor, blog post, study field, webinar) previously did so with
 * no feedback at all: the admin just landed back on the list with nothing
 * to confirm the save actually happened, unlike settings-form.tsx's inline
 * "Saved" message (there's no list to redirect to for a single-record
 * settings page, so that one never needed this). Reads `?saved=1` off the
 * URL the form redirected to, then strips it via router.replace so a page
 * refresh doesn't keep re-showing a stale confirmation.
 */
export function SavedBanner({ label = "Saved successfully." }: { label?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = React.useState(searchParams.get("saved") === "1");

  React.useEffect(() => {
    if (searchParams.get("saved") !== "1") return;
    setVisible(true);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("saved");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    // Only ever needs to react to the URL actually carrying ?saved=1 once,
    // right after the redirect that put it there — not to router/pathname
    // identity, which would re-run this and re-strip a param that's
    // already gone.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-navy-800/15 bg-paper-50 px-4 py-3 text-body-sm text-ink-900"
    >
      <span className="flex items-center gap-2">
        <CheckIcon className="h-4 w-4 flex-none text-product-green" aria-hidden="true" />
        {label}
      </span>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss"
        className="flex-none text-slate-500 transition-colors hover:text-ink-900"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
