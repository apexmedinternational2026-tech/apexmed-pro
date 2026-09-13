"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DragReorderList } from "@/components/admin/drag-reorder-list";
import { LabelListEditor } from "@/components/admin/program/label-list-editor";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TrashIcon, PencilIcon, PlusIcon } from "@/components/ui/icons";
import {
  createModuleAction,
  updateModuleAction,
  deleteModuleAction,
  reorderModulesAction,
  createModuleItemAction,
  updateModuleItemAction,
  deleteModuleItemAction,
  reorderModuleItemsAction,
} from "@/lib/actions/admin/programs";
import type { AdminProgramModule } from "@/lib/supabase/queries/admin/programs";

export function ModulesEditor({
  programId,
  programSlug,
  modules,
}: {
  programId: string;
  programSlug: string;
  modules: AdminProgramModule[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(modules[0]?.id ?? null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    formData.set("program_id", programId);
    const result = await createModuleAction(formData, programSlug);
    if (!result.ok) setError(result.error);
    else router.refresh();
  }

  async function handleUpdate(id: string, formData: FormData) {
    formData.set("id", id);
    const result = await updateModuleAction(formData, programSlug);
    if (!result.ok) setError(result.error);
    else {
      setEditingId(null);
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteModuleAction(id, programSlug);
    if (!result.ok) throw new Error(result.error);
    router.refresh();
  }

  async function handleReorder(orderedIds: string[]) {
    await reorderModulesAction(orderedIds, programId, programSlug);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-body-sm text-error">{error}</p>}

      <DragReorderList
        items={modules}
        onReorder={handleReorder}
        emptyLabel="No modules yet."
        renderItem={(module) => (
          <div>
            {editingId === module.id ? (
              <form action={(formData) => handleUpdate(module.id, formData)} className="flex flex-col gap-2">
                <Input name="title" defaultValue={module.title} placeholder="Module title" required autoFocus />
                <Textarea
                  name="description"
                  defaultValue={module.description ?? ""}
                  placeholder="Description (optional)"
                  rows={2}
                />
                <Input name="icon_key" defaultValue={module.icon_key ?? ""} placeholder="Icon key (optional)" />
                <div className="flex gap-2">
                  <Button type="submit" variant="secondary" size="sm">
                    Save
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === module.id ? null : module.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="text-body-sm font-medium text-ink-900">{module.title}</p>
                  {module.description && <p className="mt-0.5 text-caption text-slate-500">{module.description}</p>}
                  <p className="mt-1 text-caption text-slate-500">
                    {module.items.length} item{module.items.length === 1 ? "" : "s"} —{" "}
                    {expandedId === module.id ? "hide" : "show"} checklist
                  </p>
                </button>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(module.id)}>
                    <PencilIcon className="h-3.5 w-3.5" />
                  </Button>
                  <ConfirmDialog
                    title="Delete this module?"
                    description="Its checklist items will be deleted too. This can't be undone."
                    onConfirm={() => handleDelete(module.id)}
                    trigger={
                      <Button type="button" variant="ghost" size="sm">
                        <TrashIcon className="h-3.5 w-3.5" />
                      </Button>
                    }
                  />
                </div>
              </div>
            )}

            {expandedId === module.id && editingId !== module.id && (
              <div className="mt-3 border-t border-navy-800/10 pt-3">
                <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-slate-500">
                  Checklist items
                </p>
                <LabelListEditor
                  items={module.items.map((item) => ({ id: item.id, label: item.label }))}
                  parentId={module.id}
                  parentIdField="module_id"
                  programSlug={programSlug}
                  addLabel="New checklist item"
                  emptyLabel="No items yet."
                  createAction={createModuleItemAction}
                  updateAction={updateModuleItemAction}
                  deleteAction={deleteModuleItemAction}
                  reorderAction={reorderModuleItemsAction}
                />
              </div>
            )}
          </div>
        )}
      />

      <form
        action={handleCreate}
        className="flex flex-col gap-2 rounded-lg border border-dashed border-navy-800/20 p-3"
      >
        <Input name="title" placeholder="New module title" required className="h-9" />
        <Textarea name="description" placeholder="Description (optional)" rows={2} />
        <Button type="submit" variant="secondary" size="sm" className="w-fit">
          <PlusIcon className="h-3.5 w-3.5" />
          Add module
        </Button>
      </form>
    </div>
  );
}
