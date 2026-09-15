"use client";

import * as React from "react";
import { applicationSchema, EDUCATION_LEVEL_OPTIONS, CV_ALLOWED_EXTENSIONS } from "@/lib/validation/application";
import { EDUCATION_LEVEL_LABELS } from "@/lib/applications";
import { getApplicationExtraFields, shouldShowCvUpload, type ApplicationExtraField } from "./application-extra-fields";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";

interface FormValues {
  full_name: string;
  email: string;
  phone: string;
  institution: string;
  education_level: string;
  year_of_study: string;
  country: string;
  motivation: string;
  website: string; // honeypot
}

const INITIAL_VALUES: FormValues = {
  full_name: "",
  email: "",
  phone: "",
  institution: "",
  education_level: "",
  year_of_study: "",
  country: "",
  motivation: "",
  website: "",
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

/**
 * The one reusable application form for every service — not a form per
 * service. What varies per service (extra questions, whether a CV is asked
 * for) is driven entirely by application-extra-fields.ts, keyed on
 * serviceSlug, so a new service's application needs a config entry, not a
 * new component.
 */
export function ApplicationForm({ serviceId, serviceSlug, serviceName }: { serviceId: string; serviceSlug: string; serviceName: string }) {
  const extraFieldDefs = React.useMemo(() => getApplicationExtraFields(serviceSlug), [serviceSlug]);
  const showCv = shouldShowCvUpload(serviceSlug);

  const [values, setValues] = React.useState<FormValues>(INITIAL_VALUES);
  const [extraValues, setExtraValues] = React.useState<Record<string, string>>({});
  const [cvFile, setCvFile] = React.useState<File | null>(null);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormValues, string>>>({});
  const [extraErrors, setExtraErrors] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<SubmitStatus>("idle");
  const [formError, setFormError] = React.useState<string | null>(null);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  function updateExtra(key: string, value: string) {
    setExtraValues((previous) => ({ ...previous, [key]: value }));
  }

  function handleReset() {
    setValues(INITIAL_VALUES);
    setExtraValues({});
    setCvFile(null);
    setErrors({});
    setExtraErrors({});
    setStatus("idle");
    setFormError(null);
  }

  function validateExtraFields(): boolean {
    const nextErrors: Record<string, string> = {};
    for (const field of extraFieldDefs) {
      if (field.required && !extraValues[field.key]?.trim()) {
        nextErrors[field.key] = "This field is required.";
      }
    }
    setExtraErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = applicationSchema.safeParse({
      service_id: serviceId,
      full_name: values.full_name,
      email: values.email,
      phone: values.phone,
      institution: values.institution,
      education_level: values.education_level,
      year_of_study: values.year_of_study,
      country: values.country,
      motivation: values.motivation,
      extra_fields: extraValues,
      website: values.website,
    });

    const extraFieldsValid = validateExtraFields();

    if (!parsed.success || !extraFieldsValid) {
      const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const key = issue.path[0];
          if (typeof key === "string" && key in values && !(key in fieldErrors)) {
            fieldErrors[key as keyof FormValues] = issue.message;
          }
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const formData = new FormData();
      formData.set("service_id", serviceId);
      formData.set("full_name", parsed.data.full_name);
      formData.set("email", parsed.data.email);
      formData.set("phone", parsed.data.phone);
      formData.set("institution", parsed.data.institution ?? "");
      formData.set("education_level", parsed.data.education_level ?? "");
      formData.set("year_of_study", parsed.data.year_of_study ?? "");
      formData.set("country", parsed.data.country ?? "");
      formData.set("motivation", parsed.data.motivation ?? "");
      formData.set("extra_fields", JSON.stringify(extraValues));
      formData.set("website", values.website);
      if (cvFile) {
        formData.set("cv", cvFile);
      }

      const response = await fetch("/api/applications", { method: "POST", body: formData });
      const data: { ok: boolean; error?: string } = await response.json();

      if (!response.ok || !data.ok) {
        setStatus("error");
        setFormError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setFormError("Something went wrong. Please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-center gap-4 rounded-2xl border border-navy-800/15 bg-white p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-product-green/10">
          <CheckIcon className="h-6 w-6 text-product-green" aria-hidden="true" />
        </span>
        <div>
          <p className="font-display text-display-md text-ink-900">Application submitted — thank you.</p>
          <p className="mt-2 text-body-md text-slate-500">
            We&apos;ve received your application for {serviceName}. A confirmation has been sent to your email, and our team
            will follow up shortly.
          </p>
          {/* CLAUDE.md compliance rule: never imply guaranteed admission/acceptance/licensing/etc. */}
          <p className="mt-2 text-caption text-slate-400">
            This confirms receipt only and is not a decision on your application.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-body-sm font-medium text-navy-900 underline decoration-navy-900/30 underline-offset-2 hover:decoration-navy-900"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Honeypot: same visually-hidden .hp-field clip technique as
          profile-assessment-form.tsx — kept out of the tab order and
          accessibility tree for real users, still present for bots. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="application-website">Website</label>
        <input
          id="application-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => update("website", event.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="full_name">Full name</Label>
          <Input
            id="full_name"
            autoComplete="name"
            value={values.full_name}
            onChange={(event) => update("full_name", event.target.value)}
            aria-invalid={Boolean(errors.full_name)}
            aria-describedby={errors.full_name ? "full_name-error" : undefined}
          />
          <FieldError id="full_name-error">{errors.full_name}</FieldError>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          <FieldError id="email-error">{errors.email}</FieldError>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+923001234567"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          <FieldError id="phone-error">{errors.phone}</FieldError>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="country">Country (optional)</Label>
          <Input
            id="country"
            autoComplete="country-name"
            value={values.country}
            onChange={(event) => update("country", event.target.value)}
            aria-invalid={Boolean(errors.country)}
            aria-describedby={errors.country ? "country-error" : undefined}
          />
          <FieldError id="country-error">{errors.country}</FieldError>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="institution">Institution (optional)</Label>
          <Input
            id="institution"
            value={values.institution}
            onChange={(event) => update("institution", event.target.value)}
            aria-invalid={Boolean(errors.institution)}
            aria-describedby={errors.institution ? "institution-error" : undefined}
          />
          <FieldError id="institution-error">{errors.institution}</FieldError>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="education_level">Education level (optional)</Label>
          <Select value={values.education_level} onValueChange={(value) => update("education_level", value)}>
            <SelectTrigger id="education_level" aria-invalid={Boolean(errors.education_level)}>
              <SelectValue placeholder="Select your level" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_LEVEL_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {EDUCATION_LEVEL_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError>{errors.education_level}</FieldError>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="year_of_study">Year of study / graduation (optional)</Label>
          <Input
            id="year_of_study"
            value={values.year_of_study}
            onChange={(event) => update("year_of_study", event.target.value)}
            aria-invalid={Boolean(errors.year_of_study)}
            aria-describedby={errors.year_of_study ? "year_of_study-error" : undefined}
          />
          <FieldError id="year_of_study-error">{errors.year_of_study}</FieldError>
        </div>
      </div>

      {extraFieldDefs.map((field) => (
        <ExtraField
          key={field.key}
          field={field}
          value={extraValues[field.key] ?? ""}
          error={extraErrors[field.key]}
          onChange={(value) => updateExtra(field.key, value)}
        />
      ))}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="motivation">Why are you applying? (optional)</Label>
        <Textarea
          id="motivation"
          rows={4}
          value={values.motivation}
          onChange={(event) => update("motivation", event.target.value)}
          aria-invalid={Boolean(errors.motivation)}
          aria-describedby={errors.motivation ? "motivation-error" : undefined}
        />
        <FieldError id="motivation-error">{errors.motivation}</FieldError>
      </div>

      {showCv && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cv">CV / Resume (optional, PDF/DOC/DOCX, max 5MB)</Label>
          <Input
            id="cv"
            type="file"
            accept={CV_ALLOWED_EXTENSIONS.join(",")}
            onChange={(event) => setCvFile(event.target.files?.[0] ?? null)}
          />
        </div>
      )}

      {formError && (
        <p role="alert" className="text-body-sm text-error">
          {formError}
        </p>
      )}

      <Button type="submit" variant="gold" size="lg" disabled={status === "submitting"} className="w-fit">
        {status === "submitting" ? "Submitting…" : "Submit Application"}
      </Button>

      {/* CLAUDE.md compliance rule: no component rendering a program/package
          may omit this disclaimer for layout convenience. */}
      <p className="text-caption text-slate-400">
        Submitting this form does not guarantee admission, licensing, publication, or any other outcome. It begins a
        review of your application by our team.
      </p>
    </form>
  );
}

function ExtraField({
  field,
  value,
  error,
  onChange,
}: {
  field: ApplicationExtraField;
  value: string;
  error: string | undefined;
  onChange: (value: string) => void;
}) {
  const inputId = `extra-${field.key}`;

  if (field.type === "select" && field.options) {
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={inputId}>
          {field.label} {field.required && <span className="text-error">*</span>}
        </Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={inputId} aria-invalid={Boolean(error)}>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError>{error}</FieldError>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={inputId}>
          {field.label} {field.required && <span className="text-error">*</span>}
        </Label>
        <Textarea
          id={inputId}
          rows={3}
          placeholder={field.placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
        />
        <FieldError>{error}</FieldError>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={inputId}>
        {field.label} {field.required && <span className="text-error">*</span>}
      </Label>
      <Input
        id={inputId}
        placeholder={field.placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
      />
      <FieldError>{error}</FieldError>
    </div>
  );
}
