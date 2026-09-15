"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createStudyFieldAction, updateStudyFieldAction } from "@/lib/actions/admin/study-fields";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WordCountIndicator } from "@/components/admin/word-count-indicator";
import { getStudyFieldWordCount } from "@/lib/content-length";
import type { Tables } from "@/lib/supabase/database.types";

export function StudyFieldForm({
  field,
  categories,
}: {
  field?: Tables<"study_fields">;
  categories: Tables<"study_field_categories">[];
}) {
  const router = useRouter();
  const isEdit = Boolean(field);
  const [categoryId, setCategoryId] = React.useState(field?.category_id ?? categories[0]?.id ?? "");
  const [isPublished, setIsPublished] = React.useState(field?.is_published ?? false);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  // Controlled only so the word count below can update live — the Server
  // Action still re-validates the submitted FormData independently
  // (never trust client input), this is purely an editing aid.
  const [overview, setOverview] = React.useState(field?.overview ?? "");
  const [typicalUniversities, setTypicalUniversities] = React.useState(field?.typical_universities ?? "");
  const [entryRequirements, setEntryRequirements] = React.useState(field?.entry_requirements ?? "");
  const [languageRequirements, setLanguageRequirements] = React.useState(field?.language_requirements ?? "");
  const [careerOutlook, setCareerOutlook] = React.useState(field?.career_outlook ?? "");

  const wordCount = getStudyFieldWordCount({
    overview,
    typical_universities: typicalUniversities,
    entry_requirements: entryRequirements,
    language_requirements: languageRequirements,
    career_outlook: careerOutlook,
  });

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    formData.set("category_id", categoryId);
    if (isPublished) formData.set("is_published", "on");

    // Branches on `field` itself so TypeScript can narrow it, rather
    // than asserting non-null off the derived `isEdit` boolean.
    const result = field ? await updateStudyFieldAction(field.id, formData) : await createStudyFieldAction(formData);

    setIsPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/admin/study-fields?saved=1");
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={field?.name} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={field?.slug} required />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category_id">Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger id="category_id">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="overview">Overview</Label>
        <Textarea
          id="overview"
          name="overview"
          rows={3}
          value={overview}
          onChange={(event) => setOverview(event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="typical_universities">Typical universities</Label>
        <Textarea
          id="typical_universities"
          name="typical_universities"
          rows={2}
          value={typicalUniversities}
          onChange={(event) => setTypicalUniversities(event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="entry_requirements">Entry requirements</Label>
        <Textarea
          id="entry_requirements"
          name="entry_requirements"
          rows={2}
          value={entryRequirements}
          onChange={(event) => setEntryRequirements(event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="language_requirements">Language requirements</Label>
        <Textarea
          id="language_requirements"
          name="language_requirements"
          rows={2}
          value={languageRequirements}
          onChange={(event) => setLanguageRequirements(event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="career_outlook">Career outlook</Label>
        <Textarea
          id="career_outlook"
          name="career_outlook"
          rows={2}
          value={careerOutlook}
          onChange={(event) => setCareerOutlook(event.target.value)}
        />
      </div>

      <WordCountIndicator wordCount={wordCount} />

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

      {error && <p className="text-body-sm text-error">{error}</p>}

      <Button type="submit" variant="primary" size="lg" disabled={isPending} className="w-fit">
        {isPending ? "Saving…" : isEdit ? "Save changes" : "Create study field"}
      </Button>
    </form>
  );
}
