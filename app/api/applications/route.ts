import { NextResponse } from "next/server";
import { applicationSchema, CV_ALLOWED_EXTENSIONS, CV_ALLOWED_TYPES, CV_MAX_BYTES } from "@/lib/validation/application";
import {
  createApplication,
  getServiceNameById,
  hasRecentDuplicateApplication,
  uploadApplicationCv,
} from "@/lib/supabase/queries/applications";
import { sendApplicantConfirmationEmail, sendApplicationNotificationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

// Node runtime, not edge — file uploads go through the Supabase admin
// client's storage API, same requirement as the existing blog cover-image
// upload path.
export const runtime = "nodejs";

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function fieldToString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  const rateLimit = checkRateLimit(`applications:${ip}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // extra_fields arrives as a JSON-encoded string field (FormData has no
  // native nested-object support) — components/services/application-form.tsx
  // is the one place that encodes it, this is the one place that decodes it.
  let extraFields: Record<string, string> = {};
  const extraFieldsRaw = fieldToString(formData.get("extra_fields"));
  if (extraFieldsRaw) {
    try {
      const parsedExtra: unknown = JSON.parse(extraFieldsRaw);
      if (parsedExtra && typeof parsedExtra === "object" && !Array.isArray(parsedExtra)) {
        extraFields = parsedExtra as Record<string, string>;
      }
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }
  }

  const candidate = {
    service_id: fieldToString(formData.get("service_id")),
    full_name: fieldToString(formData.get("full_name")),
    email: fieldToString(formData.get("email")),
    phone: fieldToString(formData.get("phone")),
    institution: fieldToString(formData.get("institution")),
    education_level: fieldToString(formData.get("education_level")),
    year_of_study: fieldToString(formData.get("year_of_study")),
    country: fieldToString(formData.get("country")),
    motivation: fieldToString(formData.get("motivation")),
    extra_fields: extraFields,
    website: fieldToString(formData.get("website")),
  };

  const parsed = applicationSchema.safeParse(candidate);

  if (!parsed.success) {
    const isHoneypot = parsed.error.issues.some((issue) => issue.path[0] === "website");
    if (isHoneypot) {
      console.warn(`POST /api/applications: honeypot triggered (ip=${ip}).`);
    }

    return NextResponse.json(
      {
        ok: false,
        error: "Please check the highlighted fields and try again.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const isDuplicate = await hasRecentDuplicateApplication(parsed.data.email, parsed.data.service_id);
  if (isDuplicate) {
    return NextResponse.json(
      { ok: false, error: "You've already submitted an application for this program in the last 24 hours." },
      { status: 409 },
    );
  }

  // CV is optional — not every service's application asks for one (see
  // components/services/application-extra-fields.ts for which do).
  let cvUrl: string | null = null;
  const cvFile = formData.get("cv");
  if (cvFile instanceof File && cvFile.size > 0) {
    if (cvFile.size > CV_MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "CV file must be smaller than 5MB." }, { status: 400 });
    }
    const extension = `.${cvFile.name.split(".").pop()?.toLowerCase() ?? ""}`;
    const typeAllowed = CV_ALLOWED_TYPES.includes(cvFile.type as (typeof CV_ALLOWED_TYPES)[number]);
    const extensionAllowed = CV_ALLOWED_EXTENSIONS.includes(extension as (typeof CV_ALLOWED_EXTENSIONS)[number]);
    if (!typeAllowed && !extensionAllowed) {
      return NextResponse.json({ ok: false, error: "CV must be a PDF, DOC, or DOCX file." }, { status: 400 });
    }

    const uploadResult = await uploadApplicationCv(cvFile);
    if (!uploadResult.ok) {
      return NextResponse.json({ ok: false, error: uploadResult.error }, { status: 500 });
    }
    cvUrl = uploadResult.value;
  }

  const result = await createApplication(parsed.data, cvUrl);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }

  const serviceName = (await getServiceNameById(parsed.data.service_id)) ?? "ApexMed International";

  // Best-effort — never blocks or fails the response; the application is
  // already safely written by the time these run.
  void sendApplicationNotificationEmail({
    fullName: result.value.full_name,
    email: result.value.email,
    phone: result.value.phone,
    serviceName,
    institution: result.value.institution,
    country: result.value.country,
    motivation: result.value.motivation,
    hasCv: cvUrl !== null,
  });
  void sendApplicantConfirmationEmail({
    fullName: result.value.full_name,
    email: result.value.email,
    serviceName,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
