import Link from "next/link";
import type { Metadata } from "next";
import { getDashboardStats } from "@/lib/supabase/queries/admin/dashboard";
import { StatCard, GroupedCountList } from "@/components/admin/stat-card";

export const metadata: Metadata = {
  title: "Dashboard — ApexMed Admin",
  robots: { index: false, follow: false },
};

// Always fresh, never cached — a dashboard showing stale lead counts
// would defeat the point of having one.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-display-lg text-ink-900">Dashboard</h1>
        <p className="mt-1 text-body-sm text-slate-500">An overview of leads, content, and what needs attention.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="New leads (7 days)" value={stats.newLeads7d} />
        <StatCard label="New leads (30 days)" value={stats.newLeads30d} />
        <StatCard label="New applications (7 days)" value={stats.newApplications7d} />
        <StatCard label="New applications (30 days)" value={stats.newApplications30d} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Unread contact messages" value={stats.unreadContactMessages} />
        <StatCard label="Testimonials pending review" value={stats.pendingTestimonials} />
        <Link href="/admin/chatbot/unanswered" className="block">
          <StatCard label="Chatbot questions needing review" value={stats.unansweredChatbotQuestions} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-navy-800/10 bg-white p-6">
            <h2 className="font-display text-display-sm text-ink-900">Leads by package</h2>
            <p className="mt-1 text-body-sm text-slate-500">Which Card is actually converting — all time.</p>
            <div className="mt-5">
              <GroupedCountList items={stats.leadsByProgram} emptyLabel="No leads yet." />
            </div>
          </div>
          <div className="rounded-xl border border-navy-800/10 bg-white p-6">
            <h2 className="font-display text-display-sm text-ink-900">Applications by service</h2>
            <p className="mt-1 text-body-sm text-slate-500">Which service page is actually converting — all time.</p>
            <div className="mt-5">
              <GroupedCountList items={stats.applicationsByService} emptyLabel="No applications yet." />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-navy-800/10 bg-white p-6">
            <h2 className="font-display text-display-sm text-ink-900">Leads by source page</h2>
            <div className="mt-4">
              <GroupedCountList items={stats.leadsBySourcePage} emptyLabel="No leads yet." />
            </div>
          </div>
          <div className="rounded-xl border border-navy-800/10 bg-white p-6">
            <h2 className="font-display text-display-sm text-ink-900">Leads by UTM campaign</h2>
            <div className="mt-4">
              <GroupedCountList items={stats.leadsByUtmCampaign} emptyLabel="No campaign-tagged leads yet." />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-navy-800/10 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-display-sm text-ink-900">Upcoming webinars</h2>
          <Link href="/admin/webinars" className="text-body-sm font-medium text-navy-950 hover:underline">
            Manage webinars →
          </Link>
        </div>
        <div className="mt-4">
          {stats.upcomingWebinars.length === 0 ? (
            <p className="text-body-sm text-slate-500">No upcoming webinars scheduled.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {stats.upcomingWebinars.map((webinar) => (
                <li key={webinar.id} className="flex items-center justify-between text-body-sm">
                  <span className="text-ink-900">{webinar.title}</span>
                  <span className="text-slate-500">{new Date(webinar.starts_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
