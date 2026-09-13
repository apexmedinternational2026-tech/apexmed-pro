import type { Metadata } from "next";
import { GermanyDetailLayout } from "@/components/germany/detail-layout";
import { GERMANY_DETAIL_CONTENT } from "@/lib/germany-content";
import { getComplianceDisclaimer } from "@/lib/supabase/queries/compliance-disclaimers";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

const content = GERMANY_DETAIL_CONTENT.kp;

export const metadata: Metadata = {
  title: `${content.title} — ApexMed International`,
  description: content.summary,
  alternates: { canonical: absoluteUrl(`/germany/${content.slug}`) },
};

export default async function KpPage() {
  const disclaimer = await getComplianceDisclaimer("germany_licensing");
  return <GermanyDetailLayout content={content} disclaimer={disclaimer} />;
}
