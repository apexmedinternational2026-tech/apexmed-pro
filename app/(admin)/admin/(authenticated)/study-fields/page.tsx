import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listStudyFieldCategoriesAdmin, listStudyFieldsAdmin } from "@/lib/supabase/queries/admin/study-fields";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryQuickAdd } from "@/components/admin/study-field/category-quick-add";
import { DeleteFieldButton } from "@/components/admin/study-field/delete-field-button";
import { SavedBanner } from "@/components/admin/saved-banner";
import { PlusIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Study Fields — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminStudyFieldsPage() {
  const [categories, fields] = await Promise.all([listStudyFieldCategoriesAdmin(), listStudyFieldsAdmin()]);

  return (
    <div className="flex flex-col gap-6">
      {/* useSearchParams() inside SavedBanner needs a Suspense boundary. */}
      <Suspense fallback={null}>
        <SavedBanner label="Study field saved — live on the site now." />
      </Suspense>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-lg text-ink-900">Study Fields</h1>
          <p className="mt-1 text-body-sm text-slate-500">
            {categories.length} categories, {fields.length} fields.
          </p>
        </div>
        <Button asChild variant="primary" size="md">
          <Link href="/admin/study-fields/new">
            <PlusIcon className="h-4 w-4" />
            New field
          </Link>
        </Button>
      </div>

      <CategoryQuickAdd />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.length === 0 && <TableEmpty colSpan={4}>No study fields yet.</TableEmpty>}
          {fields.map((field) => (
            <TableRow key={field.id}>
              <TableCell className="font-medium">{field.name}</TableCell>
              <TableCell className="text-slate-500">{field.category.name}</TableCell>
              <TableCell>
                <Badge variant={field.is_published ? "gold" : "neutral"}>
                  {field.is_published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/study-fields/${field.id}`}>Edit</Link>
                  </Button>
                  <DeleteFieldButton id={field.id} name={field.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
