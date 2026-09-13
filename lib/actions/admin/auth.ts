"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signInSchema } from "@/lib/validation/admin/auth";

export interface SignInActionState {
  error?: string;
}

export async function signInAction(_prevState: SignInActionState, formData: FormData): Promise<SignInActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid email and password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return { error: "Invalid email or password." };
  }

  // A valid Supabase Auth session alone is not admin access — reject (and
  // immediately drop the session rather than leave a signed-in
  // non-admin browser sitting there) if there's no matching admin_profiles
  // row. Relies on authenticated_select_own_admin_profile's RLS policy, so
  // this can only ever see the row for the user who just signed in.
  const { data: profile } = await supabase.from("admin_profiles").select("id").eq("id", data.user.id).maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    return { error: "This account is not authorized for admin access." };
  }

  const next = formData.get("next");
  redirect(typeof next === "string" && next.startsWith("/admin") ? next : "/admin");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
