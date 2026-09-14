import Link from "next/link";
import { Button, type ButtonProps } from "@/components/ui/button";
import { PROFILE_ASSESSMENT_HREF } from "@/lib/navigation";

export interface ProfileAssessmentButtonProps {
  size?: ButtonProps["size"];
  className?: string;
}

/**
 * The one CTA repeated across roughly a dozen files site-wide — originally
 * labeled "Book a Free Profile Assessment" (a responsive audit found that
 * phrase was the single most common cause of page overflow at 320–375px,
 * 9 separate instances, since it doesn't fit a phone-width button on one
 * line). Relabeled to "Contact Us" — it always pointed at /contact, which
 * is the site's actual contact form, so the shorter label matches what the
 * link does and needs no responsive text-swap to fit. Consolidated into
 * one component both so a copy change like this only has to happen once
 * instead of drifting across a dozen files the way the destination href
 * already had (some used the PROFILE_ASSESSMENT_HREF constant, others
 * hard-coded "/contact").
 */
export function ProfileAssessmentButton({ size = "lg", className }: ProfileAssessmentButtonProps) {
  return (
    <Button asChild variant="gold" size={size} className={className}>
      <Link href={PROFILE_ASSESSMENT_HREF}>Contact Us</Link>
    </Button>
  );
}
