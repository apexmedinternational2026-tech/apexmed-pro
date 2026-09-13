import type { Metadata } from "next";
import { requireVisitorSession } from "@/lib/supabase/auth";
import { getMyLeads, getMyWebinarRegistrations } from "@/lib/supabase/queries/account";
import { INTEREST_TYPE_LABELS, LEAD_STATUS_LABELS } from "@/lib/leads";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const metadata: Metadata = {
  title: "My Account — ApexMed International",
  robots: { index: false, follow: false },
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

export default async function AccountPage() {
  // Redirects to /login if there's no session — this page has nothing
  // meaningful to render without one, unlike a page that merely varies
  // its content for a signed-in visitor.
  const session = await requireVisitorSession();
  const [leads, registrations] = await Promise.all([getMyLeads(), getMyWebinarRegistrations()]);

  return (
    <>
      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-eyebrow uppercase text-gold-400">My Account</p>
            <h1 className="mt-2 font-display text-display-xl text-paper-50">
              {session.fullName ? `Welcome back, ${session.fullName.split(" ")[0]}` : "Welcome back"}
            </h1>
            <p className="mt-2 text-body-md text-paper-50/80">{session.email}</p>
          </div>
          <SignOutButton />
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container className="flex flex-col gap-10">
          <div>
            <h2 className="font-display text-display-md text-ink-900">Your profile assessment requests</h2>
            {leads.length === 0 ? (
              <p className="mt-3 text-body-md text-slate-500">
                You haven&apos;t submitted a profile assessment yet.
              </p>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {leads.map((lead) => (
                  <Card key={lead.id}>
                    <CardContent className="flex flex-col gap-1.5">
                      <p className="font-medium text-ink-900">
                        {lead.interest_type ? INTEREST_TYPE_LABELS[lead.interest_type] ?? lead.interest_type : "General Inquiry"}
                      </p>
                      <p className="text-caption uppercase tracking-wide text-slate-500">
                        {LEAD_STATUS_LABELS[lead.status] ?? lead.status} · {formatDate(lead.created_at)}
                      </p>
                      {lead.message && <p className="mt-1 text-body-sm text-slate-500">{lead.message}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-display text-display-md text-ink-900">Your webinar registrations</h2>
            {registrations.length === 0 ? (
              <p className="mt-3 text-body-md text-slate-500">You haven&apos;t registered for a webinar yet.</p>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {registrations.map((registration) => (
                  <Card key={registration.id}>
                    <CardContent className="flex flex-col gap-1.5">
                      <p className="font-medium text-ink-900">{registration.webinar?.title ?? "Webinar"}</p>
                      <p className="text-caption uppercase tracking-wide text-slate-500">
                        Registered {formatDate(registration.created_at)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
