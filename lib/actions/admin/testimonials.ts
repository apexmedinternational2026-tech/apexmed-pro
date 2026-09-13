"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/supabase/auth";
import { approveTestimonialAdmin, rejectTestimonialAdmin } from "@/lib/supabase/queries/admin/testimonials";
import type { Result } from "@/lib/result";

export async function approveTestimonialAction(id: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const result = await approveTestimonialAdmin(id);
  if (result.ok) revalidatePath("/");
  return result;
}

export async function rejectTestimonialAction(id: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const result = await rejectTestimonialAdmin(id);
  if (result.ok) revalidatePath("/");
  return result;
}
