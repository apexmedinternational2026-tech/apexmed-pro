"use client";

import * as React from "react";
import { webinarRegistrationSchema } from "@/lib/validation/webinar-registration";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import { Button } from "@/components/ui/button";
import { TurnstileWidget } from "@/components/ui/turnstile-widget";

interface FormValues {
  full_name: string;
  email: string;
  phone: string;
  website: string; // honeypot
}

const INITIAL_VALUES: FormValues = { full_name: "", email: "", phone: "", website: "" };

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function WebinarRegistrationForm({ webinarId }: { webinarId: string }) {
  const [values, setValues] = React.useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = React.useState<SubmitStatus>("idle");
  const [formError, setFormError] = React.useState<string | null>(null);
  // Same null-vs-empty-string distinction as ProfileAssessmentForm — see
  // components/ui/turnstile-widget.tsx.
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = webinarRegistrationSchema.safeParse({ ...values, webinar_id: webinarId });

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && key !== "webinar_id" && !(key in fieldErrors)) {
          fieldErrors[key as keyof FormValues] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/webinar-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, turnstile_token: turnstileToken ?? "" }),
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
      <p role="status" className="text-body-sm font-medium text-ink-900">
        You&apos;re registered — we&apos;ll email the joining link before the session.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <div className="hp-field" aria-hidden="true">
        <label htmlFor={`website-${webinarId}`}>Website</label>
        <input
          id={`website-${webinarId}`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => update("website", event.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor={`full_name-${webinarId}`}>Full name</Label>
          <Input
            id={`full_name-${webinarId}`}
            autoComplete="name"
            value={values.full_name}
            onChange={(event) => update("full_name", event.target.value)}
            aria-invalid={Boolean(errors.full_name)}
          />
          <FieldError>{errors.full_name}</FieldError>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor={`email-${webinarId}`}>Email</Label>
          <Input
            id={`email-${webinarId}`}
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
          <FieldError>{errors.email}</FieldError>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor={`phone-${webinarId}`}>Phone (optional)</Label>
        <Input
          id={`phone-${webinarId}`}
          type="tel"
          autoComplete="tel"
          placeholder="+923001234567"
          value={values.phone}
          onChange={(event) => update("phone", event.target.value)}
          aria-invalid={Boolean(errors.phone)}
        />
        <FieldError>{errors.phone}</FieldError>
      </div>

      {formError && (
        <p role="alert" className="text-body-sm text-error">
          {formError}
        </p>
      )}

      <TurnstileWidget onVerify={setTurnstileToken} />

      <Button type="submit" variant="gold" disabled={status === "submitting" || turnstileToken === null} className="w-fit">
        {status === "submitting" ? "Registering…" : "Reserve Your Seat"}
      </Button>
    </form>
  );
}
