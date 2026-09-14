import "server-only";

export interface LeadWhatsAppInput {
  fullName: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  interestType?: string | null;
}

/**
 * Best-effort WhatsApp alert via CallMeBot — an unofficial, single-recipient
 * relay: no Meta Business verification or paid API needed, just a personal
 * API key tied to one WhatsApp number (see docs/RUNBOOK.md for the one-time
 * setup). That trade-off is deliberate for this site's volume — same
 * "never block the lead" contract as sendLeadNotificationEmail in
 * lib/email.ts: this never throws, and a failed/unconfigured alert must
 * never fail the submission itself, since the lead is already saved by the
 * time this runs. If lead volume ever outgrows a single WhatsApp number,
 * this is the file to swap for the official Meta Cloud API or Twilio.
 */
export async function sendLeadWhatsAppNotification(input: LeadWhatsAppInput): Promise<void> {
  const apiKey = process.env.CALLMEBOT_API_KEY;
  const phone = process.env.CALLMEBOT_PHONE;

  if (!apiKey || !phone) {
    console.warn("sendLeadWhatsAppNotification: CALLMEBOT_API_KEY or CALLMEBOT_PHONE not set — skipping.");
    return;
  }

  const lines = [
    "New lead — ApexMed International",
    `Name: ${input.fullName}`,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : null,
    input.country ? `Country: ${input.country}` : null,
    input.interestType ? `Interested in: ${input.interestType}` : null,
  ].filter((line): line is string => line !== null);

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", phone);
  url.searchParams.set("text", lines.join("\n"));
  url.searchParams.set("apikey", apiKey);

  try {
    const response = await fetch(url.toString(), { method: "GET" });
    // CallMeBot returns 200 with an error message in the body on failure
    // (e.g. an expired API key) rather than a non-2xx status, so the body
    // has to be checked too, not just response.ok.
    const text = await response.text();
    if (!response.ok || !text.includes("Message queued")) {
      console.error(`sendLeadWhatsAppNotification: CallMeBot responded unexpectedly: ${text}`);
    }
  } catch (error) {
    console.error("sendLeadWhatsAppNotification: request failed", error);
  }
}
