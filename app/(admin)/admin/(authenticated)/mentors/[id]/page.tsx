import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMentorByIdAdmin } from "@/lib/supabase/queries/admin/mentors";
import { NotFoundError } from "@/lib/supabase/errors";
import { MentorForm } from "@/components/admin/mentor/mentor-form";

export const metadata: Metadata = {
  title: "Edit Mentor — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditMentorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let mentor;
  try {
    mentor = await getMentorByIdAdmin(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-display-lg text-ink-900">Edit mentor</h1>
      <MentorForm mentor={mentor} />
    </div>
  );
}
