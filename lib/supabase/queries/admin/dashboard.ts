import "server-only";
import { createAdminClient } from "../../admin";
import { DatabaseQueryError } from "../../errors";
import { describeLeadInterest } from "@/lib/leads";

export interface GroupedCount {
  label: string;
  count: number;
}

export interface DashboardStats {
  newLeads7d: number;
  newLeads30d: number;
  leadsByProgram: GroupedCount[];
  leadsBySourcePage: GroupedCount[];
  leadsByUtmCampaign: GroupedCount[];
  unreadContactMessages: number;
  pendingTestimonials: number;
  upcomingWebinars: { id: string; title: string; slug: string; starts_at: string }[];
  newApplications7d: number;
  newApplications30d: number;
  applicationsByService: GroupedCount[];
  unansweredChatbotQuestions: number;
}

function daysAgoIso(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function groupAndCount(labels: (string | null)[]): GroupedCount[] {
  const counts = new Map<string, number>();
  for (const raw of labels) {
    const label = raw?.trim() || "(not set)";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}

/**
 * Single dashboard read. There's no SQL "group by" available through
 * PostgREST without a dedicated view/RPC, so — same pattern as every other
 * aggregation already in this codebase (lib/germany-pathway's ItemList,
 * the homepage's publication-count reduce) — this fetches the narrow set
 * of columns actually needed and aggregates in JS. A leads table at this
 * business's scale (a handful of forms a day) never gets large enough for
 * that to matter.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const admin = createAdminClient();

  const [leadsResult, contactResult, testimonialsResult, webinarsResult, programsResult, applicationsResult, unansweredResult] =
    await Promise.all([
      admin.from("leads").select("interest_type, program_id, source_page, utm_campaign, created_at"),
      admin.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
      admin.from("testimonials").select("id", { count: "exact", head: true }).eq("is_approved", false),
      admin
        .from("webinars")
        .select("id, title, slug, starts_at")
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(5),
      admin.from("programs").select("id, name"),
      admin.from("applications").select("created_at, service:services(name)"),
      admin.from("chatbot_unanswered_questions").select("id", { count: "exact", head: true }).eq("reviewed", false),
    ]);

  if (leadsResult.error) {
    throw new DatabaseQueryError("Failed to load leads for dashboard.", {
      table: "leads",
      originalError: leadsResult.error,
    });
  }
  if (contactResult.error) {
    throw new DatabaseQueryError("Failed to count unread contact messages.", {
      table: "contact_messages",
      originalError: contactResult.error,
    });
  }
  if (testimonialsResult.error) {
    throw new DatabaseQueryError("Failed to count pending testimonials.", {
      table: "testimonials",
      originalError: testimonialsResult.error,
    });
  }
  if (webinarsResult.error) {
    throw new DatabaseQueryError("Failed to load upcoming webinars.", {
      table: "webinars",
      originalError: webinarsResult.error,
    });
  }
  if (programsResult.error) {
    throw new DatabaseQueryError("Failed to load programs for dashboard grouping.", {
      table: "programs",
      originalError: programsResult.error,
    });
  }
  if (applicationsResult.error) {
    throw new DatabaseQueryError("Failed to load applications for dashboard.", {
      table: "applications",
      originalError: applicationsResult.error,
    });
  }
  if (unansweredResult.error) {
    throw new DatabaseQueryError("Failed to count unanswered chatbot questions.", {
      table: "chatbot_unanswered_questions",
      originalError: unansweredResult.error,
    });
  }

  const leads = leadsResult.data;
  const applications = applicationsResult.data;
  const programNameById = new Map(programsResult.data.map((program) => [program.id, program.name]));

  const since7d = daysAgoIso(7);
  const since30d = daysAgoIso(30);

  return {
    newLeads7d: leads.filter((lead) => lead.created_at >= since7d).length,
    newLeads30d: leads.filter((lead) => lead.created_at >= since30d).length,
    // The single most valuable view: which package is actually converting,
    // whether or not the lead was ever linked to a concrete program row.
    leadsByProgram: groupAndCount(
      leads.map((lead) =>
        describeLeadInterest(
          lead.interest_type,
          lead.program_id ? (programNameById.get(lead.program_id) ?? null) : null,
        ),
      ),
    ),
    leadsBySourcePage: groupAndCount(leads.map((lead) => lead.source_page)),
    leadsByUtmCampaign: groupAndCount(leads.map((lead) => lead.utm_campaign)),
    unreadContactMessages: contactResult.count ?? 0,
    pendingTestimonials: testimonialsResult.count ?? 0,
    upcomingWebinars: webinarsResult.data,
    newApplications7d: applications.filter((application) => application.created_at >= since7d).length,
    newApplications30d: applications.filter((application) => application.created_at >= since30d).length,
    applicationsByService: groupAndCount(applications.map((application) => application.service?.name ?? null)),
    unansweredChatbotQuestions: unansweredResult.count ?? 0,
  };
}
