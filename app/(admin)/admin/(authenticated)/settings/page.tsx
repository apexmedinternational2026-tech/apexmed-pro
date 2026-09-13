import type { Metadata } from "next";
import { getAllSettingsAdmin } from "@/lib/supabase/queries/admin/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = {
  title: "Settings — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getAllSettingsAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-display-lg text-ink-900">Settings</h1>
        <p className="mt-1 text-body-sm text-slate-500">
          Contact details and social links shown in the Footer and Organization JSON-LD across the whole public site.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
