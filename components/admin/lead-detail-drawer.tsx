"use client";

import * as React from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateLeadStatusAction, updateLeadNotesAction } from "@/lib/actions/admin/leads";
import { LEAD_STATUS_OPTIONS, LEAD_STATUS_LABELS, CURRENT_STATUS_LABELS, describeLeadInterest } from "@/lib/leads";
import type { AdminLead } from "@/lib/supabase/queries/admin/leads";

const FIELD_ROWS: { label: string; get: (lead: AdminLead) => string }[] = [
  { label: "Email", get: (lead) => lead.email },
  { label: "Phone", get: (lead) => lead.phone ?? "—" },
  { label: "Country", get: (lead) => lead.country ?? "—" },
  {
    label: "Current status",
    get: (lead) => (lead.current_status ? (CURRENT_STATUS_LABELS[lead.current_status] ?? lead.current_status) : "—"),
  },
  { label: "Source page", get: (lead) => lead.source_page ?? "—" },
  { label: "UTM source", get: (lead) => lead.utm_source ?? "—" },
  { label: "UTM medium", get: (lead) => lead.utm_medium ?? "—" },
  { label: "UTM campaign", get: (lead) => lead.utm_campaign ?? "—" },
  { label: "Submitted", get: (lead) => new Date(lead.created_at).toLocaleString() },
];

export function LeadDetailDrawer({ lead, trigger }: { lead: AdminLead; trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState(lead.status);
  const [notes, setNotes] = React.useState(lead.admin_notes ?? "");
  const [savingStatus, setSavingStatus] = React.useState(false);
  const [savingNotes, setSavingNotes] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  async function handleStatusChange(next: string) {
    setStatus(next);
    setSavingStatus(true);
    setMessage(null);
    const result = await updateLeadStatusAction(lead.id, next);
    setSavingStatus(false);
    setMessage(result.ok ? "Status updated." : result.error);
  }

  async function handleSaveNotes() {
    setSavingNotes(true);
    setMessage(null);
    const result = await updateLeadNotesAction(lead.id, notes);
    setSavingNotes(false);
    setMessage(result.ok ? "Notes saved." : result.error);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{lead.full_name}</DrawerTitle>
          <DrawerDescription>{describeLeadInterest(lead.interest_type, lead.program?.name ?? null)}</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lead-status">Status</Label>
            <Select value={status} onValueChange={handleStatusChange} disabled={savingStatus}>
              <SelectTrigger id="lead-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEAD_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {LEAD_STATUS_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <dl className="grid grid-cols-1 gap-3 rounded-lg bg-paper-50 p-4 sm:grid-cols-2">
            {FIELD_ROWS.map((row) => (
              <div key={row.label}>
                <dt className="text-caption font-semibold uppercase tracking-wide text-slate-500">{row.label}</dt>
                <dd className="mt-0.5 break-words text-body-sm text-ink-900">{row.get(lead)}</dd>
              </div>
            ))}
          </dl>

          {lead.message && (
            <div>
              <p className="text-caption font-semibold uppercase tracking-wide text-slate-500">Message</p>
              <p className="mt-1 whitespace-pre-wrap text-body-sm text-ink-900">{lead.message}</p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lead-notes">Admin notes</Label>
            <Textarea id="lead-notes" rows={5} value={notes} onChange={(event) => setNotes(event.target.value)} />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="w-fit"
            >
              {savingNotes ? "Saving…" : "Save notes"}
            </Button>
          </div>

          {message && <p className="text-body-sm text-slate-500">{message}</p>}

          <Badge variant="neutral" className="w-fit">
            Lead ID: {lead.id}
          </Badge>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
