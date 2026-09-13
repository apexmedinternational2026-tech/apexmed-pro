import type { Metadata } from "next";
import { MentorForm } from "@/components/admin/mentor/mentor-form";

export const metadata: Metadata = {
  title: "New Mentor — ApexMed Admin",
  robots: { index: false, follow: false },
};

export default function NewMentorPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-display-lg text-ink-900">New mentor</h1>
      <MentorForm />
    </div>
  );
}
