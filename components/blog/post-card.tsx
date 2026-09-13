import Link from "next/link";
import Image from "next/image";

export interface PostCardData {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt: string;
  category?: { name: string } | null;
  reading_minutes?: number | null;
  published_at?: string | null;
}

export function PostCard({ post, size = "md" }: { post: PostCardData; size?: "md" | "sm" }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-navy-800/10 bg-white p-4 transition-colors hover:border-gold-500/40"
    >
      <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-xl bg-paper-50">
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.cover_image_alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-navy-950">
            <span className="font-display text-display-sm text-gold-400">ApexMed</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {post.category && (
          <span className="text-caption font-semibold uppercase tracking-wide text-gold-500">{post.category.name}</span>
        )}
        <h3
          className={
            size === "sm" ? "font-display text-display-sm text-ink-900" : "font-display text-display-md text-ink-900"
          }
        >
          {post.title}
        </h3>
        {post.excerpt && <p className="line-clamp-2 text-body-sm text-slate-500">{post.excerpt}</p>}
        {typeof post.reading_minutes === "number" && (
          <p className="text-caption text-slate-500">{post.reading_minutes} min read</p>
        )}
      </div>
    </Link>
  );
}
