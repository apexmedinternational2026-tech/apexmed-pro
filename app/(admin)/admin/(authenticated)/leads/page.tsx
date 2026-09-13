import type { Metadata } from "next";
import Link from "next/link";
import { listLeadsAdmin, type LeadFilters } from "@/lib/supabase/queries/admin/leads";
import { listProgramsAdmin } from "@/lib/supabase/queries/admin/programs";
import { describeLeadInterest, LEAD_STATUS_LABELS } from "@/lib/leads";
import { LeadsFilterBar } from "@/components/admin/leads-filter-bar";
import { LeadDetailDrawer } from "@/components/admin/lead-detail-drawer";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Leads — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface LeadsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function readFilters(params: Record<string, string | undefined>): LeadFilters {
  return {
    status: params.status,
    programId: params.programId,
    interestType: params.interestType,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    search: params.search,
  };
}

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;
  const filters = readFilters(params);
  const page = Number(params.page) > 0 ? Number(params.page) : 1;

  const [{ leads, total, totalPages }, programs] = await Promise.all([
    listLeadsAdmin(filters, page),
    listProgramsAdmin(),
  ]);

  const exportQuery = new URLSearchParams(
    Object.entries(filters).filter((entry): entry is [string, string] => Boolean(entry[1])),
  ).toString();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-display-lg text-ink-900">Leads</h1>
          <p className="mt-1 text-body-sm text-slate-500">{total} matching leads.</p>
        </div>
        <Button asChild variant="secondary" size="md">
          <Link href={`/admin/leads/export${exportQuery ? `?${exportQuery}` : ""}`}>
            <DownloadIcon className="h-4 w-4" />
            Export CSV
          </Link>
        </Button>
      </div>

      <LeadsFilterBar programs={programs.map((program) => ({ id: program.id, name: program.name }))} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Submitted</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Interested in</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 && <TableEmpty colSpan={6}>No leads match these filters.</TableEmpty>}
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="whitespace-nowrap text-slate-500">
                {new Date(lead.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-medium">
                {lead.full_name}
                <div className="text-caption text-slate-500">{lead.email}</div>
              </TableCell>
              <TableCell>{describeLeadInterest(lead.interest_type, lead.program?.name ?? null)}</TableCell>
              <TableCell>
                <Badge variant="neutral">{LEAD_STATUS_LABELS[lead.status] ?? lead.status}</Badge>
              </TableCell>
              <TableCell className="text-slate-500">{lead.source_page ?? "—"}</TableCell>
              <TableCell className="text-right">
                <LeadDetailDrawer
                  lead={lead}
                  trigger={
                    <Button type="button" variant="ghost" size="sm">
                      View
                    </Button>
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/leads" searchParams={params} />
    </div>
  );
}
