import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWebinarByIdAdmin, getWebinarRegistrantsAdmin } from "@/lib/supabase/queries/admin/webinars";
import { listMentorsAdmin } from "@/lib/supabase/queries/admin/mentors";
import { NotFoundError } from "@/lib/supabase/errors";
import { WebinarForm } from "@/components/admin/webinar/webinar-form";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Edit Webinar — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditWebinarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let webinar;
  try {
    webinar = await getWebinarByIdAdmin(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const [mentors, registrants] = await Promise.all([listMentorsAdmin(), getWebinarRegistrantsAdmin(id)]);

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div>
        <h1 className="font-display text-display-lg text-ink-900">Edit webinar</h1>
      </div>

      <section className="rounded-xl border border-navy-800/10 bg-white p-6">
        <WebinarForm
          webinar={webinar}
          speakers={mentors.map((mentor) => ({ id: mentor.id, full_name: mentor.full_name }))}
        />
      </section>

      <section className="rounded-xl border border-navy-800/10 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-display-sm text-ink-900">Registrants</h2>
            <p className="mt-1 text-body-sm text-slate-500">
              {registrants.length}
              {webinar.capacity ? ` / ${webinar.capacity}` : ""} registered.
            </p>
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href={`/admin/webinars/${id}/export`}>
              <DownloadIcon className="h-4 w-4" />
              Export CSV
            </Link>
          </Button>
        </div>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrants.length === 0 && <TableEmpty colSpan={4}>No registrants yet.</TableEmpty>}
              {registrants.map((registrant) => (
                <TableRow key={registrant.id}>
                  <TableCell className="font-medium">{registrant.full_name}</TableCell>
                  <TableCell>{registrant.email}</TableCell>
                  <TableCell className="text-slate-500">{registrant.phone ?? "—"}</TableCell>
                  <TableCell className="text-slate-500">{new Date(registrant.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
