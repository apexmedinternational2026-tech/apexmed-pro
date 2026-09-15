import type { Metadata } from "next";
import Link from "next/link";
import { listUnansweredQuestionsAdmin } from "@/lib/supabase/queries/admin/chatbot";
import { UnansweredRowActions } from "@/components/admin/chatbot/unanswered-row-actions";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Unanswered Questions — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface UnansweredPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function AdminUnansweredQuestionsPage({ searchParams }: UnansweredPageProps) {
  const params = await searchParams;
  const showReviewed = params.showReviewed === "1";
  const page = Number(params.page) > 0 ? Number(params.page) : 1;

  const { questions, total, totalPages } = await listUnansweredQuestionsAdmin(showReviewed, page);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/chatbot" className="text-body-sm font-medium text-slate-500 hover:text-ink-900">
          ← Back to Chatbot
        </Link>
        <h1 className="mt-2 font-display text-display-lg text-ink-900">Unanswered Questions</h1>
        <p className="mt-1 text-body-sm text-slate-500">
          {total} {showReviewed ? "total" : "unreviewed"} — questions the chatbot couldn&apos;t confidently answer. Add a
          matching FAQ or extra keywords to close the gap.
        </p>
      </div>

      <Link
        href={showReviewed ? "/admin/chatbot/unanswered" : "/admin/chatbot/unanswered?showReviewed=1"}
        className="w-fit text-body-sm font-medium text-navy-900 underline decoration-navy-900/30 underline-offset-2 hover:decoration-navy-900"
      >
        {showReviewed ? "Show unreviewed only" : "Show all (including reviewed)"}
      </Link>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asked</TableHead>
            <TableHead>Question</TableHead>
            <TableHead>Best match score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.length === 0 && <TableEmpty colSpan={5}>Nothing here.</TableEmpty>}
          {questions.map((question) => (
            <TableRow key={question.id}>
              <TableCell className="whitespace-nowrap text-slate-500">
                {new Date(question.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="max-w-md">{question.question_text}</TableCell>
              <TableCell className="text-slate-500">
                {question.best_score !== null ? question.best_score.toFixed(2) : "—"}
              </TableCell>
              <TableCell>
                <Badge variant={question.reviewed ? "gold" : "neutral"}>
                  {question.reviewed ? "Reviewed" : "Needs review"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <UnansweredRowActions id={question.id} reviewed={question.reviewed} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/chatbot/unanswered" searchParams={params} />
    </div>
  );
}
