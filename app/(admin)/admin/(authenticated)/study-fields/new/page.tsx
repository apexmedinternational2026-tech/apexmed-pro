import type { Metadata } from "next";
import { listStudyFieldCategoriesAdmin } from "@/lib/supabase/queries/admin/study-fields";
import { StudyFieldForm } from "@/components/admin/study-field/study-field-form";

export const metadata: Metadata = {
  title: "New Study Field — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewStudyFieldPage() {
  const categories = await listStudyFieldCategoriesAdmin();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-display-lg text-ink-900">New study field</h1>
      {categories.length === 0 ? (
        <p className="text-body-sm text-slate-500">Create a category first from the Study Fields list page.</p>
      ) : (
        <StudyFieldForm categories={categories} />
      )}
    </div>
  );
}
