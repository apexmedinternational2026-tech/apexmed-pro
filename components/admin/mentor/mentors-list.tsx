"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DragReorderList } from "@/components/admin/drag-reorder-list";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@/components/ui/icons";
import { reorderMentorsAction, deleteMentorAction } from "@/lib/actions/admin/mentors";
import type { Tables } from "@/lib/supabase/database.types";

export function MentorsList({ mentors }: { mentors: Tables<"mentors">[] }) {
  const router = useRouter();

  async function handleReorder(orderedIds: string[]) {
    await reorderMentorsAction(orderedIds);
    router.refresh();
  }

  async function handleDelete(id: string) {
    const result = await deleteMentorAction(id);
    if (!result.ok) throw new Error(result.error);
    router.refresh();
  }

  return (
    <DragReorderList
      items={mentors}
      onReorder={handleReorder}
      emptyLabel="No mentors yet."
      renderItem={(mentor) => (
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-body-sm font-medium text-ink-900">{mentor.full_name}</p>
            <p className="text-caption text-slate-500">{mentor.role_title ?? "—"}</p>
          </div>
          <div className="flex items-center gap-2">
            {mentor.is_leadership && <Badge variant="gold">Leadership</Badge>}
            <Badge variant={mentor.is_published ? "gold" : "neutral"}>
              {mentor.is_published ? "Published" : "Draft"}
            </Badge>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/admin/mentors/${mentor.id}`}>Edit</Link>
            </Button>
            <ConfirmDialog
              title={`Delete ${mentor.full_name}?`}
              description="This can't be undone."
              onConfirm={() => handleDelete(mentor.id)}
              trigger={
                <Button type="button" variant="ghost" size="sm">
                  <TrashIcon className="h-3.5 w-3.5" />
                </Button>
              }
            />
          </div>
        </div>
      )}
    />
  );
}
