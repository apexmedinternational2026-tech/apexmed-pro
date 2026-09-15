import {
  Microscope,
  Stethoscope,
  GraduationCap,
  FlaskConical,
  ClipboardCheck,
  Award,
  BadgeCheck,
  HeartHandshake,
  BrainCircuit,
  Leaf,
  Circle,
  type LucideProps,
} from "lucide-react";

// services.icon_key / service_items.icon_key store a lucide icon name
// (kebab-case, matching lucide's own published icon-name convention —
// "brain-circuit", not "BrainCircuit") as free-text admin-entered data,
// same trade-off as programs.icon_key. Only the names actually seeded are
// registered here; anything else (a typo, an icon renamed upstream) falls
// back to a plain circle rather than crashing the page the way an
// unresolved next/image host did in components/mentors/mentor-card.tsx —
// same "bad content-layer data must degrade, never 500" principle.
const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  microscope: Microscope,
  stethoscope: Stethoscope,
  "graduation-cap": GraduationCap,
  "flask-conical": FlaskConical,
  "clipboard-check": ClipboardCheck,
  award: Award,
  "badge-check": BadgeCheck,
  "heart-handshake": HeartHandshake,
  "brain-circuit": BrainCircuit,
  leaf: Leaf,
};

export function ServiceIcon({ iconKey, ...props }: { iconKey: string | null } & LucideProps) {
  const Icon = (iconKey && ICONS[iconKey]) || Circle;
  return <Icon {...props} />;
}
