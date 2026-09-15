import "server-only";
import { createAdminClient } from "../../admin";
import { DatabaseQueryError, NotFoundError } from "../../errors";
import { ok, err, type Result } from "../../../result";
import type { Tables } from "../../database.types";

export type AdminApplication = Tables<"applications"> & { service: Pick<Tables<"services">, "id" | "name" | "slug"> | null };

const PAGE_SIZE = 25;

export interface ApplicationFilters {
  status?: string;
  serviceId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface ApplicationListResult {
  applications: AdminApplication[];
  total: number;
  page: number;
  totalPages: number;
}

// Same reasoning as leads.ts's searchFragment: shared by listApplicationsAdmin
// (paginated) and getAllApplicationsForExport (all matching rows), so the two
// can never silently disagree about what "search" means.
function searchFragment(term: string): string {
  const pattern = `%${term}%`;
  return `full_name.ilike.${pattern},email.ilike.${pattern},phone.ilike.${pattern},country.ilike.${pattern}`;
}

export async function listApplicationsAdmin(filters: ApplicationFilters, page = 1): Promise<ApplicationListResult> {
  const admin = createAdminClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = admin
    .from("applications")
    .select("*, service:services(id, name, slug)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.serviceId) query = query.eq("service_id", filters.serviceId);
  if (filters.dateFrom) query = query.gte("created_at", filters.dateFrom);
  if (filters.dateTo) query = query.lte("created_at", filters.dateTo);
  if (filters.search) query = query.or(searchFragment(filters.search));

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw new DatabaseQueryError("Failed to load applications.", { table: "applications", originalError: error });
  }

  const total = count ?? 0;

  return {
    applications: data,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getAllApplicationsForExport(filters: ApplicationFilters): Promise<AdminApplication[]> {
  const admin = createAdminClient();
  let query = admin
    .from("applications")
    .select("*, service:services(id, name, slug)")
    .order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.serviceId) query = query.eq("service_id", filters.serviceId);
  if (filters.dateFrom) query = query.gte("created_at", filters.dateFrom);
  if (filters.dateTo) query = query.lte("created_at", filters.dateTo);
  if (filters.search) query = query.or(searchFragment(filters.search));

  const { data, error } = await query;

  if (error) {
    throw new DatabaseQueryError("Failed to load applications for export.", { table: "applications", originalError: error });
  }

  return data;
}

export async function getApplicationByIdAdmin(id: string): Promise<AdminApplication> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("applications")
    .select("*, service:services(id, name, slug)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new DatabaseQueryError(`Failed to load application "${id}".`, { table: "applications", originalError: error });
  }
  if (!data) {
    throw new NotFoundError(`Application "${id}" was not found.`);
  }

  return data;
}

export async function updateApplicationStatusAdmin(id: string, status: string): Promise<Result<Tables<"applications">, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("applications").update({ status }).eq("id", id).select("*").single();

  if (error) {
    return err("Failed to update application status.");
  }
  return ok(data);
}

export async function updateApplicationNotesAdmin(id: string, adminNotes: string): Promise<Result<Tables<"applications">, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("applications")
    .update({ admin_notes: adminNotes || null })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return err("Failed to save notes.");
  }
  return ok(data);
}

/** Short-lived signed URL for a private-bucket CV download — never a public URL (see the applications storage bucket migration). */
export async function getApplicationCvSignedUrl(cvPath: string): Promise<Result<string, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from("applications").createSignedUrl(cvPath, 60 * 5);

  if (error || !data) {
    return err("Failed to generate a download link for this CV.");
  }
  return ok(data.signedUrl);
}
