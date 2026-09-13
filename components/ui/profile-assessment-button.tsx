import Link from "next/link";
import { Button, type ButtonProps } from "@/components/ui/button";
import { PROFILE_ASSESSMENT_HREF } from "@/lib/navigation";

export interface ProfileAssessmentButtonProps {
  size?: ButtonProps["size"];
  className?: string;
}

/**
 * The one CTA phrase repeated across roughly a dozen files site-wide — a
 * responsive audit found it was the single most common cause of page
 * overflow at 320–375px (9 separate instances): "Book a Free Profile
 * Assessment" at size="lg" simply doesn't fit a phone-width button on one
 * line, and Button's fixed height (not a min-height) means letting it
 * wrap to a second line would just clip that line instead of fixing
 * anything. Consolidated into one component both so every call site gets
 * the same fix at once, and so a future copy change only has to happen
 * once instead of drifting across a dozen files the way the destination
 * href already had (some used the PROFILE_ASSESSMENT_HREF constant,
 * others hard-coded "/contact").
 */
export function ProfileAssessmentButton({ size = "lg", className }: ProfileAssessmentButtonProps) {
  return (
    <Button asChild variant="gold" size={size} className={className}>
      <Link href={PROFILE_ASSESSMENT_HREF}>
        <span className="sm:hidden">Book Assessment</span>
        <span className="hidden sm:inline">Book a Free Profile Assessment</span>
      </Link>
    </Button>
  );
}
