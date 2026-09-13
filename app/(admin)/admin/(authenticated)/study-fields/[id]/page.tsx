import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStudyFieldByIdAdmin, listStudyFieldCategoriesAdmin } from "@/lib/supabase/queries/admin/study-fields";
import { NotFoundError } from "@/lib/supabase/errors";
import { StudyFieldForm } from "@/components/admin/study-field/study-field-form";

export const metadata: Metadata = {
  title: "Edit Study Field — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditStudyFieldPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let field;
  try {
    field = await getStudyFieldByIdAdmin(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const categories = await listStudyFieldCategoriesAdmin();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-display-lg text-ink-900">Edit study field</h1>
      <StudyFieldForm field={field} categories={categories} />
    </div>
  );
}
