import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/supabase/auth";
import { getAllApplicationsForExport, type ApplicationFilters } from "@/lib/supabase/queries/admin/applications";
import { APPLICATION_STATUS_LABELS, EDUCATION_LEVEL_LABELS } from "@/lib/applications";
import { toCsv } from "@/lib/csv";

export const runtime = "nodejs";

// Living under /admin/applications/export means middleware's /admin/:path*
// matcher already protects this route — requireAdminSession() below is the
// same defense-in-depth re-check every Server Action does, since a Route
// Handler is reachable directly regardless of what protects the pages that
// link to it.
export async function GET(request: NextRequest) {
  await requireAdminSession();

  const params = request.nextUrl.searchParams;
  const filters: ApplicationFilters = {
    status: params.get("status") ?? undefined,
    serviceId: params.get("serviceId") ?? undefined,
    dateFrom: params.get("dateFrom") ?? undefined,
    dateTo: params.get("dateTo") ?? undefined,
    search: params.get("search") ?? undefined,
  };

  const applications = await getAllApplicationsForExport(filters);

  const csv = toCsv(
    [
      "Submitted",
      "Full Name",
      "Email",
      "Phone",
      "Service",
      "Country",
      "Institution",
      "Education Level",
      "Year of Study",
      "Status",
      "Has CV",
      "Motivation",
      "Admin Notes",
    ],
    applications.map((application) => [
      application.created_at,
      application.full_name,
      application.email,
      application.phone,
      application.service?.name ?? null,
      application.country,
      application.institution,
      application.education_level ? (EDUCATION_LEVEL_LABELS[application.education_level] ?? application.education_level) : null,
      application.year_of_study,
      APPLICATION_STATUS_LABELS[application.status] ?? application.status,
      application.cv_url ? "Yes" : "No",
      application.motivation,
      application.admin_notes,
    ]),
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="applications-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
