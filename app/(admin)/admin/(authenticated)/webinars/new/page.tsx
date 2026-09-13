import type { Metadata } from "next";
import { listMentorsAdmin } from "@/lib/supabase/queries/admin/mentors";
import { WebinarForm } from "@/components/admin/webinar/webinar-form";

export const metadata: Metadata = {
  title: "New Webinar — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewWebinarPage() {
  const mentors = await listMentorsAdmin();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-display-lg text-ink-900">New webinar</h1>
      <WebinarForm speakers={mentors.map((mentor) => ({ id: mentor.id, full_name: mentor.full_name }))} />
    </div>
  );
}
