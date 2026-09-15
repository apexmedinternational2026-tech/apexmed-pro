import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFaqByIdAdmin } from "@/lib/supabase/queries/admin/chatbot";
import { NotFoundError } from "@/lib/supabase/errors";
import { FaqForm } from "@/components/admin/chatbot/faq-form";

export const metadata: Metadata = {
  title: "Edit FAQ — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let faq;
  try {
    faq = await getFaqByIdAdmin(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-display-lg text-ink-900">Edit FAQ</h1>
      <FaqForm faq={faq} />
    </div>
  );
}
