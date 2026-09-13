import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/supabase/auth";
import { getAllLeadsForExport, type LeadFilters } from "@/lib/supabase/queries/admin/leads";
import { describeLeadInterest, LEAD_STATUS_LABELS } from "@/lib/leads";
import { toCsv } from "@/lib/csv";

export const runtime = "nodejs";

// Living under /admin/leads/export means middleware's /admin/:path*
// matcher already protects this route — requireAdminSession() below is
// the same defense-in-depth re-check every Server Action does, since a
// Route Handler is reachable directly regardless of what protects the
// pages that link to it.
export async function GET(request: NextRequest) {
  await requireAdminSession();

  const params = request.nextUrl.searchParams;
  const filters: LeadFilters = {
    status: params.get("status") ?? undefined,
    programId: params.get("programId") ?? undefined,
    interestType: params.get("interestType") ?? undefined,
    dateFrom: params.get("dateFrom") ?? undefined,
    dateTo: params.get("dateTo") ?? undefined,
    search: params.get("search") ?? undefined,
  };

  const leads = await getAllLeadsForExport(filters);

  const csv = toCsv(
    [
      "Submitted",
      "Full Name",
      "Email",
      "Phone",
      "Country",
      "Current Status",
      "Interested In",
      "Status",
      "Source Page",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "Message",
      "Admin Notes",
    ],
    leads.map((lead) => [
      lead.created_at,
      lead.full_name,
      lead.email,
      lead.phone,
      lead.country,
      lead.current_status,
      describeLeadInterest(lead.interest_type, lead.program?.name ?? null),
      LEAD_STATUS_LABELS[lead.status] ?? lead.status,
      lead.source_page,
      lead.utm_source,
      lead.utm_medium,
      lead.utm_campaign,
      lead.message,
      lead.admin_notes,
    ]),
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
