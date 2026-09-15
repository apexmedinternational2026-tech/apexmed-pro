import type { Metadata } from "next";
import Link from "next/link";
import { listApplicationsAdmin, type ApplicationFilters } from "@/lib/supabase/queries/admin/applications";
import { getPublishedServices } from "@/lib/supabase/queries/services";
import { APPLICATION_STATUS_LABELS } from "@/lib/applications";
import { ApplicationsFilterBar } from "@/components/admin/applications-filter-bar";
import { ApplicationDetailDrawer } from "@/components/admin/application-detail-drawer";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Applications — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface ApplicationsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function readFilters(params: Record<string, string | undefined>): ApplicationFilters {
  return {
    status: params.status,
    serviceId: params.serviceId,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    search: params.search,
  };
}

export default async function AdminApplicationsPage({ searchParams }: ApplicationsPageProps) {
  const params = await searchParams;
  const filters = readFilters(params);
  const page = Number(params.page) > 0 ? Number(params.page) : 1;

  const [{ applications, total, totalPages }, services] = await Promise.all([
    listApplicationsAdmin(filters, page),
    getPublishedServices(),
  ]);

  const exportQuery = new URLSearchParams(
    Object.entries(filters).filter((entry): entry is [string, string] => Boolean(entry[1])),
  ).toString();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-display-lg text-ink-900">Applications</h1>
          <p className="mt-1 text-body-sm text-slate-500">{total} matching applications.</p>
        </div>
        <Button asChild variant="secondary" size="md">
          <Link href={`/admin/applications/export${exportQuery ? `?${exportQuery}` : ""}`}>
            <DownloadIcon className="h-4 w-4" />
            Export CSV
          </Link>
        </Button>
      </div>

      <ApplicationsFilterBar services={services.map((service) => ({ id: service.id, name: service.name }))} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Submitted</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>CV</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 && <TableEmpty colSpan={6}>No applications match these filters.</TableEmpty>}
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="whitespace-nowrap text-slate-500">
                {new Date(application.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-medium">
                {application.full_name}
                <div className="text-caption text-slate-500">{application.email}</div>
              </TableCell>
              <TableCell>{application.service?.name ?? "—"}</TableCell>
              <TableCell>
                <Badge variant="neutral">{APPLICATION_STATUS_LABELS[application.status] ?? application.status}</Badge>
              </TableCell>
              <TableCell className="text-slate-500">{application.cv_url ? "Yes" : "—"}</TableCell>
              <TableCell className="text-right">
                <ApplicationDetailDrawer
                  application={application}
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

      <Pagination page={page} totalPages={totalPages} basePath="/admin/applications" searchParams={params} />
    </div>
  );
}
