"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { markUnansweredReviewedAction } from "@/lib/actions/admin/chatbot";

export function UnansweredRowActions({ id, reviewed }: { id: string; reviewed: boolean }) {
  const router = useRouter();

  async function handleToggle() {
    const result = await markUnansweredReviewedAction(id, !reviewed);
    if (!result.ok) throw new Error(result.error);
    router.refresh();
  }

  return (
    <Button type="button" variant={reviewed ? "ghost" : "secondary"} size="sm" onClick={handleToggle}>
      {reviewed ? "Mark unreviewed" : "Mark reviewed"}
    </Button>
  );
}
