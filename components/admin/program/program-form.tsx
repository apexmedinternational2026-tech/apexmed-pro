"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { updateProgramAction } from "@/lib/actions/admin/programs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Tables } from "@/lib/supabase/database.types";

export interface ProgramFormProps {
  program: Tables<"programs">;
  disclaimers: Tables<"compliance_disclaimers">[];
}

export function ProgramForm({ program, disclaimers }: ProgramFormProps) {
  const router = useRouter();
  const [isPublished, setIsPublished] = React.useState(program.is_published);
  const [disclaimerKey, setDisclaimerKey] = React.useState(program.disclaimer_key);
  const [status, setStatus] = React.useState<{ type: "idle" | "saving" | "saved" | "error"; message?: string }>({
    type: "idle",
  });

  async function handleSubmit(formData: FormData) {
    setStatus({ type: "saving" });
    formData.set("id", program.id);
    formData.set("disclaimer_key", disclaimerKey);
    if (isPublished) formData.set("is_published", "on");

    const result = await updateProgramAction(formData, program.slug);
    if (!result.ok) {
      setStatus({ type: "error", message: result.error });
    } else {
      setStatus({ type: "saved" });
      router.refresh();
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={program.name} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="duration_label">Duration label</Label>
          <Input id="duration_label" name="duration_label" defaultValue={program.duration_label ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="headline">Headline</Label>
        <Input id="headline" name="headline" defaultValue={program.headline} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" name="summary" defaultValue={program.summary} rows={3} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="disclaimer_key">
          Compliance disclaimer <span className="text-error">*</span>
        </Label>
        <Select value={disclaimerKey} onValueChange={setDisclaimerKey}>
          <SelectTrigger id="disclaimer_key">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {disclaimers.map((disclaimer) => (
              <SelectItem key={disclaimer.key} value={disclaimer.key}>
                {disclaimer.key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-caption text-slate-500">
          Required — a program can never be saved without a disclaimer (CLAUDE.md rule 9).
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Checkbox
          id="is_published"
          checked={isPublished}
          onCheckedChange={(checked) => setIsPublished(checked === true)}
        />
        <Label htmlFor="is_published" className="cursor-pointer">
          Published (visible on the public site)
        </Label>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" size="lg" disabled={status.type === "saving"}>
          {status.type === "saving" ? "Saving…" : "Save changes"}
        </Button>
        {status.type === "saved" && <p className="text-body-sm text-slate-500">Saved.</p>}
        {status.type === "error" && <p className="text-body-sm text-error">{status.message}</p>}
      </div>
    </form>
  );
}
