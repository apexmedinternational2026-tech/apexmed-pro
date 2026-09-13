import { PostCard, type PostCardData } from "./post-card";

export function RelatedPosts({ posts }: { posts: PostCardData[] }) {
  if (posts.length === 0) return null;

  return (
    <div>
      <h2 className="font-display text-display-sm text-ink-900">Related reading</h2>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} size="sm" />
        ))}
      </div>
    </div>
  );
}
