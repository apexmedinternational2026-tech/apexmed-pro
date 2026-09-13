import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { getInitials } from "@/lib/text";
import type { Mentor } from "@/lib/supabase/queries/mentors";

export interface MentorCardProps {
  mentor: Mentor;
  /** "lg" for leadership, "sm" for the wider faculty grid. */
  size?: "lg" | "sm";
}

export function MentorCard({ mentor, size = "sm" }: MentorCardProps) {
  const isLarge = size === "lg";

  return (
    <Link
      href={`/mentors/${mentor.slug}`}
      className="group flex flex-col items-start gap-4 rounded-2xl border border-navy-800/10 bg-white p-6 transition-colors hover:border-gold-500/40"
    >
      {mentor.photo_url ? (
        // next.config.mjs derives remotePatterns from NEXT_PUBLIC_SUPABASE_URL
        // automatically — no per-deployment config needed here, but no
        // seeded mentor has a photo yet, so this path is untested against
        // a live image today.
        <Image
          src={mentor.photo_url}
          alt={mentor.full_name}
          width={isLarge ? 160 : 96}
          height={isLarge ? 160 : 96}
          className={cn("rounded-full object-cover", isLarge ? "h-40 w-40" : "h-24 w-24")}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-navy-950",
            isLarge ? "h-40 w-40" : "h-24 w-24",
          )}
        >
          <span className={cn("font-display text-gold-400", isLarge ? "text-display-lg" : "text-display-sm")}>
            {getInitials(mentor.full_name)}
          </span>
        </div>
      )}

      <div>
        <h3
          className={cn(
            "font-display text-ink-900 group-hover:text-navy-950",
            isLarge ? "text-display-md" : "text-display-sm",
          )}
        >
          {mentor.full_name}
        </h3>
        {mentor.role_title && <p className="mt-1 text-body-sm font-medium text-gold-500">{mentor.role_title}</p>}
        {mentor.qualification && <p className="mt-1 text-caption text-slate-500">{mentor.qualification}</p>}
      </div>
    </Link>
  );
}
