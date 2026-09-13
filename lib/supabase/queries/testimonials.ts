import { createPublicClient } from "../public";
import { DatabaseQueryError } from "../errors";
import type { Tables } from "../database.types";

export type Testimonial = Tables<"testimonials">;

export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  const supabase = createPublicClient();

  // No .eq("is_approved", true): anon_select_approved_testimonials already
  // enforces it via RLS.
  const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });

  if (error) {
    throw new DatabaseQueryError("Failed to load testimonials.", {
      table: "testimonials",
      originalError: error,
    });
  }

  return data;
}

export async function getApprovedTestimonialsForProgram(programId: string): Promise<Testimonial[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("program_id", programId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new DatabaseQueryError(`Failed to load testimonials for program "${programId}".`, {
      table: "testimonials",
      originalError: error,
    });
  }

  return data;
}
