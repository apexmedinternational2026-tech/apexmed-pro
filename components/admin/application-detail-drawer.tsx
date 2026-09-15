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
import {
  updateApplicationStatusAction,
  updateApplicationNotesAction,
  getApplicationCvDownloadUrlAction,
} from "@/lib/actions/admin/applications";
import { APPLICATION_STATUS_OPTIONS, APPLICATION_STATUS_LABELS, EDUCATION_LEVEL_LABELS } from "@/lib/applications";
import type { AdminApplication } from "@/lib/supabase/queries/admin/applications";

const FIELD_ROWS: { label: string; get: (application: AdminApplication) => string }[] = [
  { label: "Email", get: (application) => application.email },
  { label: "Phone", get: (application) => application.phone },
  { label: "Country", get: (application) => application.country ?? "—" },
  { label: "Institution", get: (application) => application.institution ?? "—" },
  {
    label: "Education level",
    get: (application) =>
      application.education_level ? (EDUCATION_LEVEL_LABELS[application.education_level] ?? application.education_level) : "—",
  },
  { label: "Year of study", get: (application) => application.year_of_study ?? "—" },
  { label: "Submitted", get: (application) => new Date(application.created_at).toLocaleString() },
];

export function ApplicationDetailDrawer({ application, trigger }: { application: AdminApplication; trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState(application.status);
  const [notes, setNotes] = React.useState(application.admin_notes ?? "");
  const [savingStatus, setSavingStatus] = React.useState(false);
  const [savingNotes, setSavingNotes] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [loadingCv, setLoadingCv] = React.useState(false);

  const extraFieldEntries = Object.entries((application.extra_fields as Record<string, string> | null) ?? {});

  async function handleStatusChange(next: string) {
    setStatus(next);
    setSavingStatus(true);
    setMessage(null);
    const result = await updateApplicationStatusAction(application.id, next);
    setSavingStatus(false);
    setMessage(result.ok ? "Status updated." : result.error);
  }

  async function handleSaveNotes() {
    setSavingNotes(true);
    setMessage(null);
    const result = await updateApplicationNotesAction(application.id, notes);
    setSavingNotes(false);
    setMessage(result.ok ? "Notes saved." : result.error);
  }

  async function handleDownloadCv() {
    if (!application.cv_url) return;
    setLoadingCv(true);
    setMessage(null);
    const result = await getApplicationCvDownloadUrlAction(application.cv_url);
    setLoadingCv(false);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    // Signed URL, short-lived (5 min) — opened directly rather than stored,
    // consistent with the private-bucket contract in the applications
    // migration (never a public URL for a CV).
    window.open(result.value, "_blank", "noopener,noreferrer");
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{application.full_name}</DrawerTitle>
          <DrawerDescription>{application.service?.name ?? "Unknown service"}</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="application-status">Status</Label>
            <Select value={status} onValueChange={handleStatusChange} disabled={savingStatus}>
              <SelectTrigger id="application-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {APPLICATION_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {APPLICATION_STATUS_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <dl className="grid grid-cols-1 gap-3 rounded-lg bg-paper-50 p-4 sm:grid-cols-2">
            {FIELD_ROWS.map((row) => (
              <div key={row.label}>
                <dt className="text-caption font-semibold uppercase tracking-wide text-slate-500">{row.label}</dt>
                <dd className="mt-0.5 break-words text-body-sm text-ink-900">{row.get(application)}</dd>
              </div>
            ))}
          </dl>

          {extraFieldEntries.length > 0 && (
            <div>
              <p className="text-caption font-semibold uppercase tracking-wide text-slate-500">
                Service-specific answers
              </p>
              <dl className="mt-2 flex flex-col gap-2">
                {extraFieldEntries.map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-caption text-slate-500">{key}</dt>
                    <dd className="text-body-sm text-ink-900">{value || "—"}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {application.motivation && (
            <div>
              <p className="text-caption font-semibold uppercase tracking-wide text-slate-500">Motivation</p>
              <p className="mt-1 whitespace-pre-wrap text-body-sm text-ink-900">{application.motivation}</p>
            </div>
          )}

          <div>
            <p className="text-caption font-semibold uppercase tracking-wide text-slate-500">CV / Resume</p>
            {application.cv_url ? (
              <Button type="button" variant="secondary" size="sm" onClick={handleDownloadCv} disabled={loadingCv} className="mt-1.5 w-fit">
                {loadingCv ? "Preparing download…" : "Download CV"}
              </Button>
            ) : (
              <p className="mt-1 text-body-sm text-slate-500">No CV was submitted.</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="application-notes">Admin notes</Label>
            <Textarea id="application-notes" rows={5} value={notes} onChange={(event) => setNotes(event.target.value)} />
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
            Application ID: {application.id}
          </Badge>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
