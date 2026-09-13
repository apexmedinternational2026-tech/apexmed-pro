import type { Metadata } from "next";
import Link from "next/link";
import { listProgramsAdmin } from "@/lib/supabase/queries/admin/programs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Programs — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminProgramsPage() {
  const programs = await listProgramsAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-display-lg text-ink-900">Programs</h1>
        <p className="mt-1 text-body-sm text-slate-500">
          Edit content, SEO fields, and manage modules, audiences, and journey steps for each Card.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Family</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.length === 0 && <TableEmpty colSpan={4}>No programs found.</TableEmpty>}
          {programs.map((program) => (
            <TableRow key={program.id}>
              <TableCell className="font-medium">{program.name}</TableCell>
              <TableCell className="text-slate-500">{program.family.name}</TableCell>
              <TableCell>
                <Badge variant={program.is_published ? "gold" : "neutral"}>
                  {program.is_published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/programs/${program.id}`}>Edit</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
