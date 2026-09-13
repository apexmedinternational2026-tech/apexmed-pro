import "server-only";

export interface LeadNotificationInput {
  fullName: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  interestType?: string | null;
  message?: string | null;
}

/**
 * Best-effort transactional email via Resend's HTTP API. Never throws — a
 * failed notification email must not fail the lead submission itself,
 * since the lead is already safely in the database by the time this runs.
 * No-ops with a console.warn if EMAIL_API_KEY / LEAD_NOTIFICATION_EMAIL
 * aren't configured (e.g. local dev, this environment), rather than
 * hard-failing the request over a missing integration.
 */
export async function sendLeadNotificationEmail(input: LeadNotificationInput): Promise<void> {
  const apiKey = process.env.EMAIL_API_KEY;
  const recipients = process.env.LEAD_NOTIFICATION_EMAIL;

  if (!apiKey || !recipients) {
    console.warn("sendLeadNotificationEmail: EMAIL_API_KEY or LEAD_NOTIFICATION_EMAIL not set — skipping.");
    return;
  }

  const bodyLines = [
    `Name: ${input.fullName}`,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : null,
    input.country ? `Country: ${input.country}` : null,
    input.interestType ? `Interested in: ${input.interestType}` : null,
    input.message ? `Message: ${input.message}` : null,
  ].filter((line): line is string => line !== null);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ApexMed International <leads@apexmedinternational.com>",
        to: recipients.split(",").map((address) => address.trim()),
        subject: `New lead: ${input.fullName}`,
        text: bodyLines.join("\n"),
      }),
    });

    if (!response.ok) {
      console.error(`sendLeadNotificationEmail: provider responded with status ${response.status}`);
    }
  } catch (error) {
    console.error("sendLeadNotificationEmail: request failed", error);
  }
}
