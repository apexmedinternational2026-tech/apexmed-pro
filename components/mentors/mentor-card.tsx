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
        // automatically — no per-deployment config needed here. overflow-hidden
        // on the wrapper (not the Image itself) clips the hover zoom to the
        // circle instead of the image spilling past it as a square on hover.
        <div className={cn("overflow-hidden rounded-full", isLarge ? "h-40 w-40" : "h-24 w-24")}>
          <Image
            src={mentor.photo_url}
            alt={mentor.full_name}
            width={isLarge ? 160 : 96}
            height={isLarge ? 160 : 96}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
          />
        </div>
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
