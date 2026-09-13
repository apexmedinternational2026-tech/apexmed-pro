import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostByIdAdmin, listBlogCategoriesAdmin, listTagsAdmin } from "@/lib/supabase/queries/admin/blog";
import { listMentorsAdmin } from "@/lib/supabase/queries/admin/mentors";
import { NotFoundError } from "@/lib/supabase/errors";
import { BlogPostForm } from "@/components/admin/blog/blog-post-form";

export const metadata: Metadata = {
  title: "Edit Post — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let post;
  try {
    post = await getPostByIdAdmin(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const [categories, tags, mentors] = await Promise.all([
    listBlogCategoriesAdmin(),
    listTagsAdmin(),
    listMentorsAdmin(),
  ]);

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <h1 className="font-display text-display-lg text-ink-900">Edit post</h1>
      <BlogPostForm
        post={post}
        categories={categories}
        tags={tags}
        authors={mentors.map((mentor) => ({ id: mentor.id, full_name: mentor.full_name }))}
      />
    </div>
  );
}
