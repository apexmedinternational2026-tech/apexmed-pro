import type { Metadata } from "next";
import Link from "next/link";
import { listMentorsAdmin } from "@/lib/supabase/queries/admin/mentors";
import { MentorsList } from "@/components/admin/mentor/mentors-list";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Mentors — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminMentorsPage() {
  const mentors = await listMentorsAdmin();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-lg text-ink-900">Mentors</h1>
          <p className="mt-1 text-body-sm text-slate-500">Drag to reorder — this order is what /about renders.</p>
        </div>
        <Button asChild variant="primary" size="md">
          <Link href="/admin/mentors/new">
            <PlusIcon className="h-4 w-4" />
            New mentor
          </Link>
        </Button>
      </div>

      <MentorsList mentors={mentors} />
    </div>
  );
}
