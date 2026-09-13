import type { Metadata } from "next";
import Link from "next/link";
import { listPostsAdmin } from "@/lib/supabase/queries/admin/blog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeletePostButton } from "@/components/admin/blog/delete-post-button";
import { PlusIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Blog — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS_VARIANT: Record<string, "gold" | "neutral"> = {
  published: "gold",
};

export default async function AdminBlogPage() {
  const posts = await listPostsAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-lg text-ink-900">Blog</h1>
          <p className="mt-1 text-body-sm text-slate-500">{posts.length} posts.</p>
        </div>
        <Button asChild variant="primary" size="md">
          <Link href="/admin/blog/new">
            <PlusIcon className="h-4 w-4" />
            New post
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 && <TableEmpty colSpan={6}>No posts yet.</TableEmpty>}
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell className="text-slate-500">{post.category?.name ?? "—"}</TableCell>
              <TableCell className="text-slate-500">{post.author?.full_name ?? "—"}</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[post.status] ?? "neutral"} className="capitalize">
                  {post.status}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-500">{new Date(post.updated_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/blog/${post.id}`}>Edit</Link>
                  </Button>
                  <DeletePostButton id={post.id} slug={post.slug} title={post.title} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
