"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TuitionFiltersProps {
  subjects: string[];
  classLevels: string[];
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  allLabel: string;
  onChange: (value: string) => void;
}

function FilterSelect({ label, value, options, allLabel, onChange }: FilterSelectProps) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <option value="">{allLabel}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// The filters live in the URL, so the server can search and filter the data
export function TuitionFilters({ subjects, classLevels }: TuitionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [search, setSearch] = useState(params.get("search") ?? "");

  const subject = params.get("subject") ?? "";
  const classLevel = params.get("classLevel") ?? "";
  const mode = params.get("mode") ?? "";
  const hasFilters = Boolean(search || subject || classLevel || mode);

  function update(changes: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    next.delete("page"); // always go back to page 1 after a change
    const text = next.toString();
    router.push(text ? `${pathname}?${text}` : pathname, { scroll: false });
  }

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    update({ search: search.trim() });
  }

  function clearAll() {
    setSearch("");
    router.push(pathname, { scroll: false });
  }

  return (
    <div className="space-y-4 rounded-2xl border bg-card p-4 sm:p-5">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title or subject"
            aria-label="Search tuitions"
            className="h-10 w-full rounded-lg border bg-background pr-3 pl-9 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FilterSelect
          label="Subject"
          value={subject}
          options={subjects}
          allLabel="All subjects"
          onChange={(value) => update({ subject: value })}
        />
        <FilterSelect
          label="Class level"
          value={classLevel}
          options={classLevels}
          allLabel="All class levels"
          onChange={(value) => update({ classLevel: value })}
        />
        <FilterSelect
          label="Mode"
          value={mode}
          options={["Online", "Offline"]}
          allLabel="Online & Offline"
          onChange={(value) => update({ mode: value })}
        />
        <Button type="button" variant="outline" onClick={clearAll} disabled={!hasFilters}>
          <X className="size-4" /> Clear filters
        </Button>
      </div>
    </div>
  );
}