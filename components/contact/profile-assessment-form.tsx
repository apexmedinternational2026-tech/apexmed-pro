"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { leadSchema, CURRENT_STATUS_OPTIONS, INTEREST_TYPE_OPTIONS } from "@/lib/validation/lead";
import { CURRENT_STATUS_LABELS, INTEREST_TYPE_LABELS } from "@/lib/leads";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TurnstileWidget } from "@/components/ui/turnstile-widget";
import { CheckIcon } from "@/components/ui/icons";

interface FormValues {
  full_name: string;
  email: string;
  phone: string;
  country: string;
  current_status: string;
  interest_type: string;
  message: string;
  website: string; // honeypot
}

const INITIAL_VALUES: FormValues = {
  full_name: "",
  email: "",
  phone: "",
  country: "",
  current_status: "",
  interest_type: "",
  message: "",
  website: "",
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function ProfileAssessmentForm() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [values, setValues] = React.useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = React.useState<SubmitStatus>("idle");
  const [formError, setFormError] = React.useState<string | null>(null);
  // null = not yet verified (or verification expired) — kept distinct
  // from "" (verification not configured, see TurnstileWidget) so a
  // configured widget genuinely blocks submission until solved.
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  // Previously the success state was a dead end — the form was replaced
  // by a static thank-you block with no way back short of reloading the
  // page, which meant submitting a second request (a common real need:
  // wrong email, a colleague asks them to submit for their own profile
  // too) required leaving and re-navigating back to /contact.
  function handleReset() {
    setValues(INITIAL_VALUES);
    setErrors({});
    setStatus("idle");
    setFormError(null);
    setTurnstileToken(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = leadSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in fieldErrors)) {
          fieldErrors[key as keyof FormValues] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          source_page: pathname,
          utm_source: searchParams.get("utm_source") ?? undefined,
          utm_medium: searchParams.get("utm_medium") ?? undefined,
          utm_campaign: searchParams.get("utm_campaign") ?? undefined,
          turnstile_token: turnstileToken ?? "",
        }),
      });

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
          <p className="font-display text-display-md text-ink-900">Submitted — thank you.</p>
          <p className="mt-2 text-body-md text-slate-500">
            Your profile assessment request has been received. A mentor will contact you within 2 working days.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-body-sm font-medium text-navy-900 underline decoration-navy-900/30 underline-offset-2 hover:decoration-navy-900"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Honeypot: visually hidden via the .hp-field clip technique (see
          app/globals.css), not display:none — kept out of the tab order
          and the accessibility tree for real users via tabIndex/aria-hidden,
          but still physically present in the DOM for bots to fill in. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => update("website", event.target.value)}
        />
      </div>

      {/* Hidden fields, not just in-memory state — the UTM/source data
          actually lives in the DOM as the brief asks for. */}
      <input type="hidden" name="source_page" value={pathname} readOnly />
      <input type="hidden" name="utm_source" value={searchParams.get("utm_source") ?? ""} readOnly />
      <input type="hidden" name="utm_medium" value={searchParams.get("utm_medium") ?? ""} readOnly />
      <input type="hidden" name="utm_campaign" value={searchParams.get("utm_campaign") ?? ""} readOnly />

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
          <Label htmlFor="phone">Phone (optional)</Label>
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
          <Label htmlFor="country">Country</Label>
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
          <Label htmlFor="current_status">Current status</Label>
          <Select value={values.current_status} onValueChange={(value) => update("current_status", value)}>
            <SelectTrigger id="current_status" aria-invalid={Boolean(errors.current_status)}>
              <SelectValue placeholder="Select your status" />
            </SelectTrigger>
            <SelectContent>
              {CURRENT_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {CURRENT_STATUS_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError>{errors.current_status}</FieldError>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="interest_type">Interested in</Label>
          <Select value={values.interest_type} onValueChange={(value) => update("interest_type", value)}>
            <SelectTrigger id="interest_type" aria-invalid={Boolean(errors.interest_type)}>
              <SelectValue placeholder="Select a program" />
            </SelectTrigger>
            <SelectContent>
              {INTEREST_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {INTEREST_TYPE_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError>{errors.interest_type}</FieldError>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea
          id="message"
          rows={4}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        <FieldError id="message-error">{errors.message}</FieldError>
      </div>

      {formError && (
        <p role="alert" className="text-body-sm text-error">
          {formError}
        </p>
      )}

      <TurnstileWidget onVerify={setTurnstileToken} />

      <Button
        type="submit"
        variant="gold"
        size="lg"
        disabled={status === "submitting" || turnstileToken === null}
        className="w-fit"
      >
        {/* This is the form's own submit action, not a navigational CTA
            (it doesn't link anywhere — it posts the form) — "Send Message"
            names what the click actually does, on a page already titled
            "Contact Us". */}
        {status === "submitting" ? "Submitting…" : "Send Message"}
      </Button>
    </form>
  );
}
