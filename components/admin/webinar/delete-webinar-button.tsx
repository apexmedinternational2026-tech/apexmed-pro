"use client";

import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@/components/ui/icons";
import { deleteWebinarAction } from "@/lib/actions/admin/webinars";

export function DeleteWebinarButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();

  async function handleDelete() {
    const result = await deleteWebinarAction(id);
    if (!result.ok) throw new Error(result.error);
    router.refresh();
  }

  return (
    <ConfirmDialog
      title={`Delete "${title}"?`}
      description="Registrant records for this webinar will be deleted too. This can't be undone."
      onConfirm={handleDelete}
      trigger={
        <Button type="button" variant="ghost" size="sm">
          <TrashIcon className="h-3.5 w-3.5" />
        </Button>
      }
    />
  );
}
