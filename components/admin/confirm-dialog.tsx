"use client";

import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  /** Runs on confirm. Thrown/rejected errors are surfaced inline rather than left silent. */
  onConfirm: () => Promise<void> | void;
}

/**
 * Every destructive admin action (delete a module, reject a testimonial,
 * remove a webinar) routes through this rather than firing on a single
 * click — CLAUDE.md's brief for this stage requires confirmation on
 * destructive actions explicitly, and centralizing it here means that
 * requirement can't be quietly skipped on any one "Delete" button.
 */
export function ConfirmDialog({ trigger, title, description, confirmLabel = "Delete", onConfirm }: ConfirmDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleConfirm() {
    setIsPending(true);
    setError(null);
    try {
      await onConfirm();
      setOpen(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {error && <p className="text-body-sm text-error">{error}</p>}
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            className="bg-error hover:bg-error/90"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Working…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
