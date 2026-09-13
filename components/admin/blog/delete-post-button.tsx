"use client";

import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@/components/ui/icons";
import { deletePostAction } from "@/lib/actions/admin/blog";

export function DeletePostButton({ id, slug, title }: { id: string; slug: string; title: string }) {
  const router = useRouter();

  async function handleDelete() {
    const result = await deletePostAction(id, slug);
    if (!result.ok) throw new Error(result.error);
    router.refresh();
  }

  return (
    <ConfirmDialog
      title={`Delete "${title}"?`}
      description="This permanently deletes the post. This can't be undone."
      onConfirm={handleDelete}
      trigger={
        <Button type="button" variant="ghost" size="sm">
          <TrashIcon className="h-3.5 w-3.5" />
        </Button>
      }
    />
  );
}
