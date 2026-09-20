"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

/** Clickable column header that cycles asc → desc for table sorts. */
export function SortHeader({
  label,
  column,
  sortBy,
  sortOrder,
  onSort,
  align = "left",
}: {
  label: string;
  column: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
  align?: "left" | "right";
}) {
  const active = sortBy === column;
  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider hover:text-foreground transition-colors ${
        align === "right" ? "ml-auto" : ""
      } ${active ? "text-foreground" : "text-muted-foreground"}`}
    >
      {label}
      {active ? (
        sortOrder === "asc" ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-40" />
      )}
    </button>
  );
}

export const BOOK_PANELS = [
  "MEMBER",
  "COUNSELLOR",
  "MENTOR",
  "EDITOR",
  "MODERATOR",
  "AUTHOR",
  "FINANCE_MANAGER",
  "HR_MANAGER",
  "ADMIN",
  "SUPER_ADMIN",
  "SYSTEM_ADMIN",
] as const;

export function toggleSort(
  currentBy: string,
  currentOrder: "asc" | "desc",
  nextBy: string
): { sortBy: string; sortOrder: "asc" | "desc" } {
  if (currentBy === nextBy) {
    return { sortBy: nextBy, sortOrder: currentOrder === "asc" ? "desc" : "asc" };
  }
  return { sortBy: nextBy, sortOrder: "desc" };
}
