"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DragReorderList } from "@/components/admin/drag-reorder-list";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@/components/ui/icons";
import { reorderFaqsAction, deleteFaqAction } from "@/lib/actions/admin/chatbot";
import type { Tables } from "@/lib/supabase/database.types";

export function FaqsList({ faqs }: { faqs: Tables<"chatbot_faqs">[] }) {
  const router = useRouter();

  async function handleReorder(orderedIds: string[]) {
    await reorderFaqsAction(orderedIds);
    router.refresh();
  }

  async function handleDelete(id: string) {
    const result = await deleteFaqAction(id);
    if (!result.ok) throw new Error(result.error);
    router.refresh();
  }

  return (
    <DragReorderList
      items={faqs}
      onReorder={handleReorder}
      emptyLabel="No FAQs yet."
      renderItem={(faq) => (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-body-sm font-medium text-ink-900">{faq.question}</p>
            <p className="truncate text-caption text-slate-500">{faq.category ?? "Uncategorized"}</p>
          </div>
          <div className="flex flex-none items-center gap-2">
            {faq.is_starter && <Badge variant="gold">Starter</Badge>}
            <Badge variant={faq.is_published ? "gold" : "neutral"}>{faq.is_published ? "Published" : "Draft"}</Badge>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/admin/chatbot/${faq.id}`}>Edit</Link>
            </Button>
            <ConfirmDialog
              title="Delete this FAQ?"
              description="This can't be undone."
              onConfirm={() => handleDelete(faq.id)}
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
