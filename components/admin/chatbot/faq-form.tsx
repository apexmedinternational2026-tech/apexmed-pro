"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createFaqAction, updateFaqAction } from "@/lib/actions/admin/chatbot";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/lib/supabase/database.types";

export function FaqForm({ faq }: { faq?: Tables<"chatbot_faqs"> }) {
  const router = useRouter();
  const isEdit = Boolean(faq);
  const [isStarter, setIsStarter] = React.useState(faq?.is_starter ?? false);
  const [isPublished, setIsPublished] = React.useState(faq?.is_published ?? true);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    if (isStarter) formData.set("is_starter", "on");
    if (isPublished) formData.set("is_published", "on");

    const result = faq ? await updateFaqAction(faq.id, formData) : await createFaqAction(formData);

    setIsPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/admin/chatbot?saved=1");
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="question">Question</Label>
        <Input id="question" name="question" defaultValue={faq?.question} required />
        <p className="text-caption text-slate-500">
          Shown as a starter chip (if enabled below) and matched against what visitors type.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="answer">Answer</Label>
        <Textarea id="answer" name="answer" rows={5} defaultValue={faq?.answer} required />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="keywords">Extra keywords</Label>
          <Input id="keywords" name="keywords" defaultValue={faq?.keywords ?? ""} placeholder="synonyms, abbreviations…" />
          <p className="text-caption text-slate-500">
            Space-separated extra search terms (synonyms, abbreviations) beyond what&apos;s already in the question/answer.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" defaultValue={faq?.category ?? ""} placeholder="e.g. research, germany, general" />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <Checkbox id="is_starter" checked={isStarter} onCheckedChange={(checked) => setIsStarter(checked === true)} />
          <Label htmlFor="is_starter" className="cursor-pointer">
            Starter question (shown as a suggestion chip before the visitor types)
          </Label>
        </div>
        <div className="flex items-center gap-2.5">
          <Checkbox id="is_published" checked={isPublished} onCheckedChange={(checked) => setIsPublished(checked === true)} />
          <Label htmlFor="is_published" className="cursor-pointer">
            Published (visible to the chatbot)
          </Label>
        </div>
      </div>

      {error && <p className="text-body-sm text-error">{error}</p>}

      <Button type="submit" variant="primary" size="lg" disabled={isPending} className="w-fit">
        {isPending ? "Saving…" : isEdit ? "Save changes" : "Create FAQ"}
      </Button>
    </form>
  );
}
