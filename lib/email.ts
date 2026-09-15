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

export interface ApplicationNotificationInput {
  fullName: string;
  email: string;
  phone: string;
  serviceName: string;
  institution?: string | null;
  country?: string | null;
  motivation?: string | null;
  hasCv: boolean;
}

/** Admin-facing notification — same best-effort, never-throws contract as sendLeadNotificationEmail. */
export async function sendApplicationNotificationEmail(input: ApplicationNotificationInput): Promise<void> {
  const apiKey = process.env.EMAIL_API_KEY;
  const recipients = process.env.LEAD_NOTIFICATION_EMAIL;

  if (!apiKey || !recipients) {
    console.warn("sendApplicationNotificationEmail: EMAIL_API_KEY or LEAD_NOTIFICATION_EMAIL not set — skipping.");
    return;
  }

  const bodyLines = [
    `Service: ${input.serviceName}`,
    `Name: ${input.fullName}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    input.institution ? `Institution: ${input.institution}` : null,
    input.country ? `Country: ${input.country}` : null,
    `CV attached: ${input.hasCv ? "Yes (see admin panel)" : "No"}`,
    input.motivation ? `Motivation: ${input.motivation}` : null,
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
        subject: `New application: ${input.serviceName} — ${input.fullName}`,
        text: bodyLines.join("\n"),
      }),
    });

    if (!response.ok) {
      console.error(`sendApplicationNotificationEmail: provider responded with status ${response.status}`);
    }
  } catch (error) {
    console.error("sendApplicationNotificationEmail: request failed", error);
  }
}

/**
 * Confirmation email to the applicant themselves — the one piece this
 * flow has that leads/contact don't, since a lead is a passive inquiry but
 * an application is an active submission the applicant expects an
 * acknowledgment for. Deliberately makes no promise about outcome (see
 * CLAUDE.md's compliance rule — no implying guaranteed admission/acceptance).
 */
export async function sendApplicantConfirmationEmail(input: { fullName: string; email: string; serviceName: string }): Promise<void> {
  const apiKey = process.env.EMAIL_API_KEY;

  if (!apiKey) {
    console.warn("sendApplicantConfirmationEmail: EMAIL_API_KEY not set — skipping.");
    return;
  }

  const text = [
    `Dear ${input.fullName},`,
    "",
    `Thank you for applying to ${input.serviceName} with ApexMed International. We've received your application and our team will review it shortly.`,
    "",
    "This confirms receipt only and is not a decision on your application.",
    "",
    "If you have any questions in the meantime, you're welcome to reply to this email.",
    "",
    "Best regards,",
    "ApexMed International",
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ApexMed International <applications@apexmedinternational.com>",
        to: [input.email],
        subject: `We've received your application — ${input.serviceName}`,
        text,
      }),
    });

    if (!response.ok) {
      console.error(`sendApplicantConfirmationEmail: provider responded with status ${response.status}`);
    }
  } catch (error) {
    console.error("sendApplicantConfirmationEmail: request failed", error);
  }
}
