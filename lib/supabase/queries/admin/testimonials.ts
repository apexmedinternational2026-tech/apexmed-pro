import "server-only";
import { createAdminClient } from "../../admin";
import { DatabaseQueryError } from "../../errors";
import { ok, err, type Result } from "../../../result";
import type { Tables } from "../../database.types";

export type AdminTestimonial = Tables<"testimonials"> & { program: Pick<Tables<"programs">, "id" | "name"> | null };

export async function listTestimonialsAdmin(): Promise<AdminTestimonial[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("testimonials")
    .select("*, program:programs(id, name)")
    .order("is_approved", { ascending: true })
    .order("created_at", { ascending: false });

  if (error)
    throw new DatabaseQueryError("Failed to load testimonials.", { table: "testimonials", originalError: error });
  return data;
}

export async function approveTestimonialAdmin(id: string): Promise<Result<true, string>> {
  const admin = createAdminClient();
  const { error } = await admin.from("testimonials").update({ is_approved: true }).eq("id", id);
  if (error) return err("Failed to approve the testimonial.");
  return ok(true);
}

// "Reject" has no separate state in the schema (is_approved is a boolean,
// not a tri-state) — an unmoderated testimonial that fails review is
// removed outright rather than kept around in a permanent "rejected" limbo
// nobody would ever revisit.
export async function rejectTestimonialAdmin(id: string): Promise<Result<true, string>> {
  const admin = createAdminClient();
  const { error } = await admin.from("testimonials").delete().eq("id", id);
  if (error) return err("Failed to reject the testimonial.");
  return ok(true);
}
