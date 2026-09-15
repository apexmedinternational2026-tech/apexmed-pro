import type { Metadata } from "next";
import { FaqForm } from "@/components/admin/chatbot/faq-form";

export const metadata: Metadata = {
  title: "New FAQ — ApexMed Admin",
  robots: { index: false, follow: false },
};

export default function NewFaqPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-display-lg text-ink-900">New FAQ</h1>
      <FaqForm />
    </div>
  );
}
