"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DragReorderList } from "@/components/admin/drag-reorder-list";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrashIcon, PencilIcon, PlusIcon } from "@/components/ui/icons";
import type { Result } from "@/lib/result";

export interface LabelItem {
  id: string;
  label: string;
}

export interface LabelListEditorProps {
  items: LabelItem[];
  parentId: string;
  parentIdField: string;
  programSlug: string;
  addLabel: string;
  emptyLabel: string;
  createAction: (formData: FormData, slug: string) => Promise<Result<true, string>>;
  updateAction: (formData: FormData, slug: string) => Promise<Result<true, string>>;
  deleteAction: (id: string, slug: string) => Promise<Result<true, string>>;
  reorderAction: (orderedIds: string[], parentId: string, slug: string) => Promise<Result<true, string>>;
}

/**
 * Generic single-field ("label") reorderable CRUD list — used as-is for
 * program audiences, and reused inside ModulesEditor for each module's
 * checklist items, so that create/edit/delete/reorder logic for a flat
 * list of labels exists exactly once.
 */
export function LabelListEditor({
  items,
  parentId,
  parentIdField,
  programSlug,
  addLabel,
  emptyLabel,
  createAction,
  updateAction,
  deleteAction,
  reorderAction,
}: LabelListEditorProps) {
  const router = useRouter();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    formData.set(parentIdField, parentId);
    const result = await createAction(formData, programSlug);
    if (!result.ok) setError(result.error);
    else router.refresh();
  }

  async function handleUpdate(id: string, formData: FormData) {
    formData.set("id", id);
    const result = await updateAction(formData, programSlug);
    if (!result.ok) setError(result.error);
    else {
      setEditingId(null);
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteAction(id, programSlug);
    if (!result.ok) throw new Error(result.error);
    router.refresh();
  }

  async function handleReorder(orderedIds: string[]) {
    await reorderAction(orderedIds, parentId, programSlug);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-body-sm text-error">{error}</p>}

      <DragReorderList
        items={items}
        onReorder={handleReorder}
        emptyLabel={emptyLabel}
        renderItem={(item) =>
          editingId === item.id ? (
            <form action={(formData) => handleUpdate(item.id, formData)} className="flex items-center gap-2">
              <Input name="label" defaultValue={item.label} className="h-9" autoFocus />
              <Button type="submit" variant="secondary" size="sm">
                Save
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <span className="text-body-sm text-ink-900">{item.label}</span>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(item.id)}>
                  <PencilIcon className="h-3.5 w-3.5" />
                </Button>
                <ConfirmDialog
                  title="Delete this item?"
                  description="This can't be undone."
                  onConfirm={() => handleDelete(item.id)}
                  trigger={
                    <Button type="button" variant="ghost" size="sm">
                      <TrashIcon className="h-3.5 w-3.5" />
                    </Button>
                  }
                />
              </div>
            </div>
          )
        }
      />

      <form action={handleCreate} className="flex items-center gap-2">
        <Input name="label" placeholder={addLabel} required className="h-9" />
        <Button type="submit" variant="secondary" size="sm">
          <PlusIcon className="h-3.5 w-3.5" />
          Add
        </Button>
      </form>
    </div>
  );
}
