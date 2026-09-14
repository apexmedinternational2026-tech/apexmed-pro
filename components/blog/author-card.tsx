import Link from "next/link";
import Image from "next/image";
import { getInitials } from "@/lib/text";
import { isSupabaseStorageUrl } from "@/lib/supabase-storage-url";

export interface AuthorCardData {
  slug: string;
  full_name: string;
  role_title?: string | null;
  photo_url: string | null;
}

export function AuthorCard({ author }: { author: AuthorCardData }) {
  return (
    <Link
      href={`/mentors/${author.slug}`}
      className="flex items-center gap-4 rounded-2xl border border-navy-800/10 bg-white p-5 transition-colors hover:border-gold-500/40"
    >
      {isSupabaseStorageUrl(author.photo_url) ? (
        <Image
          src={author.photo_url}
          alt={author.full_name}
          width={56}
          height={56}
          className="h-14 w-14 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-navy-950">
          <span className="font-display text-body-lg text-gold-400">{getInitials(author.full_name)}</span>
        </div>
      )}
      <div>
        <p className="text-caption font-semibold uppercase tracking-wide text-slate-500">Written by</p>
        <p className="font-display text-body-lg font-semibold text-ink-900">{author.full_name}</p>
        {author.role_title && <p className="text-body-sm text-slate-500">{author.role_title}</p>}
      </div>
    </Link>
  );
}
