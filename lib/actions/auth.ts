"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { absoluteUrl } from "@/lib/site-url";
import {
  signInSchema,
  signUpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validation/auth";

export interface AuthActionState {
  error?: string;
  message?: string;
}

function safeAccountRedirect(next: FormDataEntryValue | null): string {
  // Only ever redirect somewhere inside this app's own /account tree —
  // `next` comes from a query string a user could hand-edit, so treating
  // it as a trusted destination (an open redirect) would be a real bug.
  return typeof next === "string" && next.startsWith("/account") ? next : "/account";
}

export async function signUpAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
      emailRedirectTo: absoluteUrl("/auth/callback?next=/account"),
    },
  });

  if (error) {
    // Supabase returns the same generic shape for "already registered" as
    // for other validation failures in some configurations — surfacing
    // its own message here (rather than inventing one) keeps that honest
    // without this code having to guess at Supabase's internal error codes.
    return { error: error.message };
  }

  if (!data.session) {
    // Email confirmation is required by this Supabase project's Auth
    // settings — signUp() succeeds but doesn't return an active session
    // until the visitor clicks the confirmation link, so there's nothing
    // to redirect into yet.
    return { message: "Check your email to confirm your account before signing in." };
  }

  redirect("/account");
}

export async function signInAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect(safeAccountRedirect(formData.get("next")));
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function forgotPasswordAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: absoluteUrl("/auth/callback?next=/reset-password"),
  });

  // Deliberately the same success message whether or not the email is
  // actually registered — resetPasswordForEmail itself doesn't error for
  // an unknown address (Supabase avoids leaking which emails have
  // accounts), and this route shouldn't invent a way to distinguish them
  // either; that's exactly the account-enumeration hole a "no account
  // found" message would open.
  if (error) {
    return { error: "Something went wrong. Please try again." };
  }

  return { message: "If an account exists for that email, a reset link is on its way." };
}

export async function resetPasswordAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = await createClient();

  // By the time this runs, /auth/callback has already exchanged the
  // recovery link's code for a session and set it in this request's
  // cookies — updateUser() here is operating on that session, not a fresh
  // sign-in. No session at all (an expired or already-used link) means
  // Supabase rejects this with its own error rather than this code having
  // to check for a session up front.
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { error: "This reset link has expired or already been used. Request a new one." };
  }

  redirect("/account");
}
