import "server-only";
import { createAdminClient } from "../../admin";
import { DatabaseQueryError, NotFoundError } from "../../errors";
import { ok, err, type Result } from "../../../result";
import type { Tables } from "../../database.types";

export type AdminLead = Tables<"leads"> & { program: Pick<Tables<"programs">, "id" | "name" | "slug"> | null };

const PAGE_SIZE = 25;

export interface LeadFilters {
  status?: string;
  programId?: string;
  interestType?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface LeadListResult {
  leads: AdminLead[];
  total: number;
  page: number;
  totalPages: number;
}

// Builds the OR-search fragment shared by listLeadsAdmin (paginated) and
// getAllLeadsForExport (all matching rows), so the two can never silently
// disagree about what "search" means. The filter/eq/gte/lte calls
// themselves are inlined at each call site rather than factored out — the
// PostgREST query builder's type narrows with every chained call, which
// makes a shared "apply all filters" helper function fight the type
// checker for no real benefit at this size.
function searchFragment(term: string): string {
  const pattern = `%${term}%`;
  return `full_name.ilike.${pattern},email.ilike.${pattern},phone.ilike.${pattern},country.ilike.${pattern}`;
}

export async function listLeadsAdmin(filters: LeadFilters, page = 1): Promise<LeadListResult> {
  const admin = createAdminClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = admin
    .from("leads")
    .select("*, program:programs(id, name, slug)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.programId) query = query.eq("program_id", filters.programId);
  if (filters.interestType) query = query.eq("interest_type", filters.interestType);
  if (filters.dateFrom) query = query.gte("created_at", filters.dateFrom);
  if (filters.dateTo) query = query.lte("created_at", filters.dateTo);
  if (filters.search) query = query.or(searchFragment(filters.search));

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw new DatabaseQueryError("Failed to load leads.", { table: "leads", originalError: error });
  }

  const total = count ?? 0;

  return {
    leads: data,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getAllLeadsForExport(filters: LeadFilters): Promise<AdminLead[]> {
  const admin = createAdminClient();
  let query = admin
    .from("leads")
    .select("*, program:programs(id, name, slug)")
    .order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.programId) query = query.eq("program_id", filters.programId);
  if (filters.interestType) query = query.eq("interest_type", filters.interestType);
  if (filters.dateFrom) query = query.gte("created_at", filters.dateFrom);
  if (filters.dateTo) query = query.lte("created_at", filters.dateTo);
  if (filters.search) query = query.or(searchFragment(filters.search));

  const { data, error } = await query;

  if (error) {
    throw new DatabaseQueryError("Failed to load leads for export.", { table: "leads", originalError: error });
  }

  return data;
}

export async function getLeadByIdAdmin(id: string): Promise<AdminLead> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("leads")
    .select("*, program:programs(id, name, slug)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new DatabaseQueryError(`Failed to load lead "${id}".`, { table: "leads", originalError: error });
  }
  if (!data) {
    throw new NotFoundError(`Lead "${id}" was not found.`);
  }

  return data;
}

export async function updateLeadStatusAdmin(id: string, status: string): Promise<Result<Tables<"leads">, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("leads").update({ status }).eq("id", id).select("*").single();

  if (error) {
    return err("Failed to update lead status.");
  }
  return ok(data);
}

export async function updateLeadNotesAdmin(id: string, adminNotes: string): Promise<Result<Tables<"leads">, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("leads")
    .update({ admin_notes: adminNotes || null })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return err("Failed to save notes.");
  }
  return ok(data);
}
