"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createMentorAction, updateMentorAction } from "@/lib/actions/admin/mentors";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/lib/supabase/database.types";

export function MentorForm({ mentor }: { mentor?: Tables<"mentors"> }) {
  const router = useRouter();
  const isEdit = Boolean(mentor);
  const [isLeadership, setIsLeadership] = React.useState(mentor?.is_leadership ?? false);
  const [isPublished, setIsPublished] = React.useState(mentor?.is_published ?? false);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    if (isLeadership) formData.set("is_leadership", "on");
    if (isPublished) formData.set("is_published", "on");

    // Branches on `mentor` itself so TypeScript can narrow it, rather
    // than asserting non-null off the derived `isEdit` boolean.
    const result = mentor ? await updateMentorAction(mentor.id, formData) : await createMentorAction(formData);

    setIsPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/admin/mentors?saved=1");
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="full_name">Full name</Label>
          <Input id="full_name" name="full_name" defaultValue={mentor?.full_name} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={mentor?.slug} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role_title">Role title</Label>
          <Input id="role_title" name="role_title" defaultValue={mentor?.role_title ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="qualification">Qualification</Label>
          <Input id="qualification" name="qualification" defaultValue={mentor?.qualification ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="institution">Institution</Label>
          <Input id="institution" name="institution" defaultValue={mentor?.institution ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="publications_count">Publications count</Label>
          <Input
            id="publications_count"
            name="publications_count"
            type="number"
            min={0}
            defaultValue={mentor?.publications_count ?? 0}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="photo_url">Photo URL</Label>
          <Input id="photo_url" name="photo_url" defaultValue={mentor?.photo_url ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input id="linkedin_url" name="linkedin_url" defaultValue={mentor?.linkedin_url ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={4} defaultValue={mentor?.bio ?? ""} />
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <Checkbox
            id="is_leadership"
            checked={isLeadership}
            onCheckedChange={(checked) => setIsLeadership(checked === true)}
          />
          <Label htmlFor="is_leadership" className="cursor-pointer">
            Leadership (shown before wider faculty on /about)
          </Label>
        </div>
        <div className="flex items-center gap-2.5">
          <Checkbox
            id="is_published"
            checked={isPublished}
            onCheckedChange={(checked) => setIsPublished(checked === true)}
          />
          <Label htmlFor="is_published" className="cursor-pointer">
            Published
          </Label>
        </div>
      </div>

      {error && <p className="text-body-sm text-error">{error}</p>}

      <Button type="submit" variant="primary" size="lg" disabled={isPending} className="w-fit">
        {isPending ? "Saving…" : isEdit ? "Save changes" : "Create mentor"}
      </Button>
    </form>
  );
}
