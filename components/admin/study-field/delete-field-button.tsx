"use client";

import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@/components/ui/icons";
import { deleteStudyFieldAction } from "@/lib/actions/admin/study-fields";

export function DeleteFieldButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  async function handleDelete() {
    const result = await deleteStudyFieldAction(id);
    if (!result.ok) throw new Error(result.error);
    router.refresh();
  }

  return (
    <ConfirmDialog
      title={`Delete "${name}"?`}
      description="This can't be undone."
      onConfirm={handleDelete}
      trigger={
        <Button type="button" variant="ghost" size="sm">
          <TrashIcon className="h-3.5 w-3.5" />
        </Button>
      }
    />
  );
}
