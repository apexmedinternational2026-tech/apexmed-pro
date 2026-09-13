import type { Metadata } from "next";
import { listTestimonialsAdmin } from "@/lib/supabase/queries/admin/testimonials";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TestimonialRowActions } from "@/components/admin/testimonial-row-actions";

export const metadata: Metadata = {
  title: "Testimonials — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await listTestimonialsAdmin();
  const pendingCount = testimonials.filter((testimonial) => !testimonial.is_approved).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-display-lg text-ink-900">Testimonials</h1>
        <p className="mt-1 text-body-sm text-slate-500">{pendingCount} pending review.</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Author</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Quote</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.length === 0 && <TableEmpty colSpan={6}>No testimonials yet.</TableEmpty>}
          {testimonials.map((testimonial) => (
            <TableRow key={testimonial.id}>
              <TableCell className="font-medium">
                {testimonial.author_name}
                {testimonial.author_title && (
                  <div className="text-caption text-slate-500">{testimonial.author_title}</div>
                )}
              </TableCell>
              <TableCell className="text-slate-500">{testimonial.program?.name ?? "—"}</TableCell>
              <TableCell className="max-w-xs truncate text-slate-500">{testimonial.quote}</TableCell>
              <TableCell>{testimonial.rating} / 5</TableCell>
              <TableCell>
                <Badge variant={testimonial.is_approved ? "gold" : "neutral"}>
                  {testimonial.is_approved ? "Approved" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <TestimonialRowActions id={testimonial.id} isApproved={testimonial.is_approved} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
