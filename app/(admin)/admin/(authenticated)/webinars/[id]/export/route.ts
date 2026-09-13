import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/supabase/auth";
import { getWebinarByIdAdmin, getWebinarRegistrantsAdmin } from "@/lib/supabase/queries/admin/webinars";
import { toCsv } from "@/lib/csv";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;

  const [webinar, registrants] = await Promise.all([getWebinarByIdAdmin(id), getWebinarRegistrantsAdmin(id)]);

  const csv = toCsv(
    ["Full Name", "Email", "Phone", "Registered At"],
    registrants.map((registrant) => [registrant.full_name, registrant.email, registrant.phone, registrant.created_at]),
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${webinar.slug}-registrants.csv"`,
    },
  });
}
