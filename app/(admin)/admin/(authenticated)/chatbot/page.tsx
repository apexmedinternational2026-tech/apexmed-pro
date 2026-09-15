import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listFaqsAdmin, listUnansweredQuestionsAdmin } from "@/lib/supabase/queries/admin/chatbot";
import { FaqsList } from "@/components/admin/chatbot/faqs-list";
import { SavedBanner } from "@/components/admin/saved-banner";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Chatbot — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminChatbotPage() {
  const [faqs, unanswered] = await Promise.all([
    listFaqsAdmin(),
    listUnansweredQuestionsAdmin(false, 1),
  ]);

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      {/* useSearchParams() inside SavedBanner needs a Suspense boundary. */}
      <Suspense fallback={null}>
        <SavedBanner label="FAQ saved — live in the chatbot now." />
      </Suspense>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-lg text-ink-900">Chatbot</h1>
          <p className="mt-1 text-body-sm text-slate-500">Drag to reorder — this is also the starter-chip order.</p>
        </div>
        <Button asChild variant="primary" size="md">
          <Link href="/admin/chatbot/new">
            <PlusIcon className="h-4 w-4" />
            New FAQ
          </Link>
        </Button>
      </div>

      {unanswered.total > 0 && (
        <Link
          href="/admin/chatbot/unanswered"
          className="rounded-lg border border-gold-500/30 bg-gold-500/10 p-4 text-body-sm font-medium text-ink-900 hover:bg-gold-500/15"
        >
          {unanswered.total} unanswered {unanswered.total === 1 ? "question" : "questions"} waiting for review →
        </Link>
      )}

      <FaqsList faqs={faqs} />
    </div>
  );
}
