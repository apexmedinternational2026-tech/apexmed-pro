import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./server";
import type { Tables } from "./database.types";

export interface AdminSession {
  userId: string;
  email: string;
  profile: Tables<"admin_profiles">;
}

/**
 * A valid Supabase Auth session is not sufficient for admin access — an
 * admin_profiles row is required too (see supabase/migrations/…
 * _governance.sql). This is the one place that combines both checks, so
 * middleware, every admin layout, and every Server Action all agree on
 * exactly what "is an admin" means.
 *
 * Uses auth.getUser() rather than getSession(): getSession() only reads
 * the (possibly stale, client-supplied) JWT out of the cookie, while
 * getUser() revalidates it against Supabase's own server — the
 * distinction Supabase's own docs call out for any server-side check that
 * gates access, as opposed to just reading who's "probably" signed in.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Relies on the authenticated_select_own_admin_profile RLS policy
  // (auth.uid() = id) — this query can only ever return the caller's own
  // row, never another staff member's, even if this function's return
  // value were mishandled somewhere downstream.
  const { data: profile } = await supabase.from("admin_profiles").select("*").eq("id", user.id).maybeSingle();

  if (!profile) return null;

  return { userId: user.id, email: user.email ?? "", profile };
}

/**
 * Every admin Server Action calls this first, before touching the admin
 * (service-role) client — middleware already blocks unauthenticated
 * requests to /admin/*, but a Server Action is just a POST endpoint under
 * the hood and must never assume middleware necessarily ran in front of
 * it. Redirecting here (rather than throwing) sends a stale or
 * since-revoked session straight back to the login screen instead of
 * surfacing a raw error.
 */
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export interface VisitorSession {
  userId: string;
  email: string;
  fullName: string | null;
}

/**
 * The public-visitor equivalent of getAdminSession — deliberately does NOT
 * check admin_profiles. A signed-in visitor and a signed-in admin are the
 * same Supabase Auth user pool; admin_profiles' presence/absence is what
 * tells the two apart, not a different table of visitor accounts (see
 * supabase/migrations/20260913100003_visitor_accounts.sql).
 */
export async function getVisitorSession(): Promise<VisitorSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const fullName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null;

  return { userId: user.id, email: user.email ?? "", fullName };
}

export async function requireVisitorSession(): Promise<VisitorSession> {
  const session = await getVisitorSession();
  if (!session) redirect("/login");
  return session;
}
