"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DragReorderList } from "@/components/admin/drag-reorder-list";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TrashIcon, PencilIcon, PlusIcon } from "@/components/ui/icons";
import {
  createJourneyStepAction,
  updateJourneyStepAction,
  deleteJourneyStepAction,
  reorderJourneyStepsAction,
} from "@/lib/actions/admin/programs";
import type { Tables } from "@/lib/supabase/database.types";

export function JourneyStepsEditor({
  programId,
  programSlug,
  steps,
}: {
  programId: string;
  programSlug: string;
  steps: Tables<"program_journey_steps">[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    formData.set("program_id", programId);
    const result = await createJourneyStepAction(formData, programSlug);
    if (!result.ok) setError(result.error);
    else router.refresh();
  }

  async function handleUpdate(id: string, formData: FormData) {
    formData.set("id", id);
    const result = await updateJourneyStepAction(formData, programSlug);
    if (!result.ok) setError(result.error);
    else {
      setEditingId(null);
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteJourneyStepAction(id, programSlug);
    if (!result.ok) throw new Error(result.error);
    router.refresh();
  }

  async function handleReorder(orderedIds: string[]) {
    await reorderJourneyStepsAction(orderedIds, programId, programSlug);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-body-sm text-error">{error}</p>}

      <DragReorderList
        items={steps}
        onReorder={handleReorder}
        emptyLabel="No journey steps yet."
        renderItem={(step) =>
          editingId === step.id ? (
            <form action={(formData) => handleUpdate(step.id, formData)} className="flex flex-col gap-2">
              <Input name="step_label" defaultValue={step.step_label} placeholder="Step label" required autoFocus />
              <Textarea
                name="description"
                defaultValue={step.description ?? ""}
                placeholder="Description (optional)"
                rows={2}
              />
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
              <div>
                <p className="text-body-sm font-medium text-ink-900">{step.step_label}</p>
                {step.description && <p className="mt-0.5 text-caption text-slate-500">{step.description}</p>}
              </div>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(step.id)}>
                  <PencilIcon className="h-3.5 w-3.5" />
                </Button>
                <ConfirmDialog
                  title="Delete this journey step?"
                  description="This can't be undone."
                  onConfirm={() => handleDelete(step.id)}
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

      <form
        action={handleCreate}
        className="flex flex-col gap-2 rounded-lg border border-dashed border-navy-800/20 p-3"
      >
        <Input name="step_label" placeholder="New step label" required className="h-9" />
        <Textarea name="description" placeholder="Description (optional)" rows={2} />
        <Button type="submit" variant="secondary" size="sm" className="w-fit">
          <PlusIcon className="h-3.5 w-3.5" />
          Add step
        </Button>
      </form>
    </div>
  );
}
