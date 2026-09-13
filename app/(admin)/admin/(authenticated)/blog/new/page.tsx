import type { Metadata } from "next";
import { listBlogCategoriesAdmin, listTagsAdmin } from "@/lib/supabase/queries/admin/blog";
import { listMentorsAdmin } from "@/lib/supabase/queries/admin/mentors";
import { BlogPostForm } from "@/components/admin/blog/blog-post-form";

export const metadata: Metadata = {
  title: "New Post — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  const [categories, tags, mentors] = await Promise.all([
    listBlogCategoriesAdmin(),
    listTagsAdmin(),
    listMentorsAdmin(),
  ]);

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <h1 className="font-display text-display-lg text-ink-900">New post</h1>
      <BlogPostForm
        categories={categories}
        tags={tags}
        authors={mentors.map((mentor) => ({ id: mentor.id, full_name: mentor.full_name }))}
      />
    </div>
  );
}
