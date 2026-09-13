import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listWebinarsAdmin } from "@/lib/supabase/queries/admin/webinars";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteWebinarButton } from "@/components/admin/webinar/delete-webinar-button";
import { SavedBanner } from "@/components/admin/saved-banner";
import { PlusIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Webinars — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminWebinarsPage() {
  const webinars = await listWebinarsAdmin();

  return (
    <div className="flex flex-col gap-6">
      {/* useSearchParams() inside SavedBanner needs a Suspense boundary. */}
      <Suspense fallback={null}>
        <SavedBanner label="Webinar saved — live on the site now." />
      </Suspense>

      <div className="flex items-center justify-between">
        <h1 className="font-display text-display-lg text-ink-900">Webinars</h1>
        <Button asChild variant="primary" size="md">
          <Link href="/admin/webinars/new">
            <PlusIcon className="h-4 w-4" />
            New webinar
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Speaker</TableHead>
            <TableHead>Starts at</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {webinars.length === 0 && <TableEmpty colSpan={5}>No webinars yet.</TableEmpty>}
          {webinars.map((webinar) => (
            <TableRow key={webinar.id}>
              <TableCell className="font-medium">{webinar.title}</TableCell>
              <TableCell className="text-slate-500">{webinar.speaker?.full_name ?? "—"}</TableCell>
              <TableCell className="text-slate-500">{new Date(webinar.starts_at).toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={webinar.is_published ? "gold" : "neutral"}>
                  {webinar.is_published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/webinars/${webinar.id}`}>Manage</Link>
                  </Button>
                  <DeleteWebinarButton id={webinar.id} title={webinar.title} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
