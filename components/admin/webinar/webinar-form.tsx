"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createWebinarAction, updateWebinarAction } from "@/lib/actions/admin/webinars";
import { WEBINAR_PLATFORM_OPTIONS } from "@/lib/validation/admin/webinar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SeoCharCount } from "@/components/admin/seo-char-count";
import type { Tables } from "@/lib/supabase/database.types";

const PLATFORM_LABELS: Record<(typeof WEBINAR_PLATFORM_OPTIONS)[number], string> = {
  zoom: "Zoom",
  google_meet: "Google Meet",
  ms_teams: "Microsoft Teams",
  youtube_live: "YouTube Live",
  other: "Other",
};

function toLocalInputValue(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
}

export function WebinarForm({
  webinar,
  speakers,
}: {
  webinar?: Tables<"webinars">;
  speakers: Pick<Tables<"mentors">, "id" | "full_name">[];
}) {
  const router = useRouter();
  const isEdit = Boolean(webinar);
  const [platform, setPlatform] = React.useState<(typeof WEBINAR_PLATFORM_OPTIONS)[number]>(
    (webinar?.platform as never) ?? "zoom",
  );
  const [speakerId, setSpeakerId] = React.useState(webinar?.speaker_id ?? "");
  const [isPublished, setIsPublished] = React.useState(webinar?.is_published ?? false);
  const [seoTitle, setSeoTitle] = React.useState(webinar?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = React.useState(webinar?.seo_description ?? "");
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    formData.set("platform", platform);
    formData.set("speaker_id", speakerId);
    if (isPublished) formData.set("is_published", "on");

    // Branches on `webinar` itself so TypeScript can narrow it, rather
    // than asserting non-null off the derived `isEdit` boolean.
    const result = webinar ? await updateWebinarAction(webinar.id, formData) : await createWebinarAction(formData);

    setIsPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/admin/webinars");
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={webinar?.title} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={webinar?.slug} required />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} defaultValue={webinar?.description ?? ""} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="speaker_id">Speaker</Label>
          <Select value={speakerId} onValueChange={setSpeakerId}>
            <SelectTrigger id="speaker_id">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              {speakers.map((speaker) => (
                <SelectItem key={speaker.id} value={speaker.id}>
                  {speaker.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="platform">Platform</Label>
          <Select value={platform} onValueChange={(value) => setPlatform(value as typeof platform)}>
            <SelectTrigger id="platform">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WEBINAR_PLATFORM_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {PLATFORM_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="starts_at">Starts at</Label>
          <Input
            id="starts_at"
            name="starts_at"
            type="datetime-local"
            defaultValue={toLocalInputValue(webinar?.starts_at)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="duration_minutes">Duration (minutes)</Label>
          <Input
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            min={1}
            defaultValue={webinar?.duration_minutes ?? 60}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="join_url">Join URL</Label>
          <Input id="join_url" name="join_url" defaultValue={webinar?.join_url ?? ""} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="capacity">Capacity</Label>
          <Input id="capacity" name="capacity" type="number" min={1} defaultValue={webinar?.capacity ?? ""} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cover_image_url">Cover image URL</Label>
          <Input id="cover_image_url" name="cover_image_url" defaultValue={webinar?.cover_image_url ?? ""} />
        </div>
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

      <fieldset className="flex flex-col gap-4 rounded-xl border border-navy-800/10 p-4">
        <legend className="px-1 text-body-sm font-semibold text-ink-900">SEO</legend>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="seo_title">SEO title</Label>
          <Input
            id="seo_title"
            name="seo_title"
            value={seoTitle}
            onChange={(event) => setSeoTitle(event.target.value)}
          />
          <SeoCharCount value={seoTitle} min={50} max={60} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="seo_description">SEO description</Label>
          <Textarea
            id="seo_description"
            name="seo_description"
            rows={2}
            value={seoDescription}
            onChange={(event) => setSeoDescription(event.target.value)}
          />
          <SeoCharCount value={seoDescription} min={140} max={160} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="canonical_path">Canonical path</Label>
          <Input id="canonical_path" name="canonical_path" defaultValue={webinar?.canonical_path ?? ""} />
        </div>
      </fieldset>

      {error && <p className="text-body-sm text-error">{error}</p>}

      <Button type="submit" variant="primary" size="lg" disabled={isPending} className="w-fit">
        {isPending ? "Saving…" : isEdit ? "Save changes" : "Create webinar"}
      </Button>
    </form>
  );
}
