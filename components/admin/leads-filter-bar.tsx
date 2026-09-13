"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LEAD_STATUS_OPTIONS, LEAD_STATUS_LABELS, INTEREST_TYPE_LABELS } from "@/lib/leads";

export interface LeadsFilterBarProps {
  programs: { id: string; name: string }[];
}

const ALL_VALUE = "__all__";

/**
 * Filters live entirely in the URL (?status=&programId=&...) rather than
 * component state — the leads list itself is a Server Component reading
 * `searchParams`, so a filter change is just a navigation, and the result
 * is directly linkable/bookmarkable/shareable between admins.
 */
export function LeadsFilterBar({ programs }: LeadsFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === ALL_VALUE) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page"); // any filter change resets to page 1
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setParam("search", String(formData.get("search") ?? ""));
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-navy-800/10 bg-white p-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <Input
          name="search"
          defaultValue={searchParams.get("search") ?? ""}
          placeholder="Search name, email, phone, country…"
          className="max-w-sm"
        />
        <Button type="submit" variant="secondary" size="md">
          Search
        </Button>
      </form>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="filter-status">Status</Label>
          <Select value={searchParams.get("status") ?? ALL_VALUE} onValueChange={(value) => setParam("status", value)}>
            <SelectTrigger id="filter-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>All statuses</SelectItem>
              {LEAD_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {LEAD_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="filter-program">Program</Label>
          <Select
            value={searchParams.get("programId") ?? ALL_VALUE}
            onValueChange={(value) => setParam("programId", value)}
          >
            <SelectTrigger id="filter-program">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>All programs</SelectItem>
              {programs.map((program) => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="filter-interest">Interest type</Label>
          <Select
            value={searchParams.get("interestType") ?? ALL_VALUE}
            onValueChange={(value) => setParam("interestType", value)}
          >
            <SelectTrigger id="filter-interest">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>All interests</SelectItem>
              {Object.entries(INTEREST_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="filter-date-from">From</Label>
          <Input
            id="filter-date-from"
            type="date"
            defaultValue={searchParams.get("dateFrom")?.slice(0, 10) ?? ""}
            onChange={(event) =>
              setParam("dateFrom", event.target.value ? new Date(event.target.value).toISOString() : "")
            }
          />
        </div>
      </div>
    </div>
  );
}
