import "server-only";
import { createPublicClient } from "../public";
import { createAdminClient } from "../admin";
import { DatabaseQueryError, NotFoundError } from "../errors";
import { ok, err, type Result } from "../../result";
import type { Tables } from "../database.types";
import type { WebinarRegistrationInput } from "../../validation/webinar-registration";

export type Webinar = Tables<"webinars">;
export type WebinarRegistration = Tables<"webinar_registrations">;

export async function getUpcomingPublishedWebinars(): Promise<Webinar[]> {
  const supabase = createPublicClient();

  // No .eq("is_published", true): anon_select_published_webinars already
  // enforces it via RLS.
  const { data, error } = await supabase.from("webinars").select("*").order("starts_at", { ascending: true });

  if (error) {
    throw new DatabaseQueryError("Failed to load webinars.", {
      table: "webinars",
      originalError: error,
    });
  }

  return data;
}

export async function getWebinarSlugs(): Promise<{ slug: string }[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("webinars").select("slug");

  if (error) {
    throw new DatabaseQueryError("Failed to load webinar slugs.", {
      table: "webinars",
      originalError: error,
    });
  }

  return data;
}

export async function getWebinarBySlug(slug: string): Promise<Webinar> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("webinars").select("*").eq("slug", slug).maybeSingle();

  if (error) {
    throw new DatabaseQueryError(`Failed to load webinar "${slug}".`, {
      table: "webinars",
      originalError: error,
    });
  }

  if (!data) {
    throw new NotFoundError(`Webinar "${slug}" was not found or is not published.`);
  }

  return data;
}

// Write path — takes over from the anon INSERT policy on purpose: routing
// registrations through the admin client lets a Route Handler / Server
// Action enforce things RLS can't express well (a friendly "already
// registered" message instead of a raw unique-constraint error, capacity
// checks, confirmation emails) while still requiring validated input, since
// the parameter type is the Zod schema's inferred type — see
// lib/validation/webinar-registration.ts.
export async function registerForWebinar(
  input: WebinarRegistrationInput,
  userId: string | null = null,
): Promise<Result<WebinarRegistration, string>> {
  const admin = createAdminClient();

  const { data: webinar, error: webinarError } = await admin
    .from("webinars")
    .select("id, is_published, capacity")
    .eq("id", input.webinar_id)
    .maybeSingle();

  if (webinarError) {
    throw new DatabaseQueryError("Failed to look up webinar for registration.", {
      table: "webinars",
      originalError: webinarError,
    });
  }

  if (!webinar || !webinar.is_published) {
    return err("This webinar is not open for registration.");
  }

  const { data, error } = await admin
    .from("webinar_registrations")
    .insert({
      webinar_id: input.webinar_id,
      full_name: input.full_name,
      email: input.email,
      phone: input.phone || null,
      // Same NULL-unless-signed-in convention as leads.createLead.
      user_id: userId,
    })
    .select("*")
    .single();

  if (error) {
    // 23505 = unique_violation — the (webinar_id, email) constraint from
    // supabase/migrations/20260912100007_events.sql.
    if (error.code === "23505") {
      return err("This email is already registered for this webinar.");
    }

    throw new DatabaseQueryError("Failed to save webinar registration.", {
      table: "webinar_registrations",
      originalError: error,
    });
  }

  return ok(data);
}
