"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APPLICATION_STATUS_OPTIONS, APPLICATION_STATUS_LABELS } from "@/lib/applications";

export interface ApplicationsFilterBarProps {
  services: { id: string; name: string }[];
}

const ALL_VALUE = "__all__";

/**
 * Same URL-as-state pattern as leads-filter-bar.tsx: filters live in the
 * URL (?status=&serviceId=&...), not component state — the applications
 * list is a Server Component reading `searchParams`, so a filter change is
 * a plain navigation and the result stays linkable/bookmarkable.
 */
export function ApplicationsFilterBar({ services }: ApplicationsFilterBarProps) {
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
    params.delete("page");
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
              {APPLICATION_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {APPLICATION_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="filter-service">Service</Label>
          <Select
            value={searchParams.get("serviceId") ?? ALL_VALUE}
            onValueChange={(value) => setParam("serviceId", value)}
          >
            <SelectTrigger id="filter-service">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>All services</SelectItem>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
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
