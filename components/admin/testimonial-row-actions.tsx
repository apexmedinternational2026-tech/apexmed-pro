"use client";

import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { approveTestimonialAction, rejectTestimonialAction } from "@/lib/actions/admin/testimonials";

export function TestimonialRowActions({ id, isApproved }: { id: string; isApproved: boolean }) {
  const router = useRouter();

  async function handleApprove() {
    const result = await approveTestimonialAction(id);
    if (result.ok) router.refresh();
  }

  async function handleReject() {
    const result = await rejectTestimonialAction(id);
    if (!result.ok) throw new Error(result.error);
    router.refresh();
  }

  return (
    <div className="flex justify-end gap-2">
      {!isApproved && (
        <Button type="button" variant="secondary" size="sm" onClick={handleApprove}>
          Approve
        </Button>
      )}
      <ConfirmDialog
        title="Reject this testimonial?"
        description="It will be permanently removed. This can't be undone."
        confirmLabel="Reject"
        onConfirm={handleReject}
        trigger={
          <Button type="button" variant="ghost" size="sm">
            Reject
          </Button>
        }
      />
    </div>
  );
}
