"use client";

import { useRouter } from "next/navigation";
import { createStudyFieldCategoryAction } from "@/lib/actions/admin/study-fields";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import * as React from "react";

export function CategoryQuickAdd() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    const result = await createStudyFieldCategoryAction(formData);
    if (!result.ok) setError(result.error);
    else {
      setError(null);
      router.refresh();
    }
  }

  return (
    <form
      action={handleCreate}
      className="flex flex-wrap items-end gap-2 rounded-lg border border-dashed border-navy-800/20 p-3"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="cat-name" className="text-caption font-medium text-slate-500">
          New category name
        </label>
        <Input id="cat-name" name="name" required className="h-9 w-48" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="cat-slug" className="text-caption font-medium text-slate-500">
          Slug
        </label>
        <Input id="cat-slug" name="slug" required className="h-9 w-48" />
      </div>
      <Button type="submit" variant="secondary" size="sm">
        <PlusIcon className="h-3.5 w-3.5" />
        Add category
      </Button>
      {error && <p className="text-body-sm text-error">{error}</p>}
    </form>
  );
}
