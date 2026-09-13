"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/supabase/auth";
import { approveTestimonialAdmin, rejectTestimonialAdmin } from "@/lib/supabase/queries/admin/testimonials";
import type { Result } from "@/lib/result";

// "/" for the homepage's testimonials section; "/testimonials" is the
// dedicated listing page added later in this project — approving or
// rejecting one needs to reach both immediately, not just the one that
// existed when this file was first written.
function revalidateTestimonials() {
  revalidatePath("/");
  revalidatePath("/testimonials");
}

export async function approveTestimonialAction(id: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const result = await approveTestimonialAdmin(id);
  if (result.ok) revalidateTestimonials();
  return result;
}

export async function rejectTestimonialAction(id: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const result = await rejectTestimonialAdmin(id);
  if (result.ok) revalidateTestimonials();
  return result;
}
