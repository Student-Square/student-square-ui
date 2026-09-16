"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  CalendarRange,
  Download,
  Loader2,
  Search,
  Users,
} from "lucide-react";
import {
  downloadOperationExport,
  useAdminListOperationsQuery,
} from "@/redux/features/operations/operationsApi";

function formatRange(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "—";
  const day = start.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const t1 = start.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const t2 = end.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const sameDay = start.toDateString() === end.toDateString();
  return sameDay
    ? { day, time: `${t1} – ${t2}` }
    : {
        day: `${day} → ${end.toLocaleDateString(undefined, {
          day: "numeric",
          month: "short",
        })}`,
        time: `${t1} – ${t2}`,
      };
}

/**
 * All DOB — site-wide read-only operation log.
 * Personal create/edit lives on My DOB (/admin/my-operations).
 */
export default function AdminOperationsPage() {
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const params = {
    ...(q.trim() ? { q: q.trim() } : {}),
    ...(from ? { from: new Date(from).toISOString() } : {}),
    ...(to ? { to: new Date(to).toISOString() } : {}),
    page,
    limit: 50,
  };

  const { data, isLoading } = useAdminListOperationsQuery(params);
  const rows = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const exportQuery = new URLSearchParams();
  if (params.q) exportQuery.set("q", params.q);
  if (params.from) exportQuery.set("from", params.from);
  if (params.to) exportQuery.set("to", params.to);
  const qs = exportQuery.toString();
  const suffix = qs ? `?${qs}` : "";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            All DOB
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every panel&apos;s Daily Operation Book. View and export only — add
            your own entries under{" "}
            <Link
              href="/admin/my-operations"
              className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
            >
              My DOB
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              downloadOperationExport(
                `/admin/operations/export.csv${suffix}`,
                "daily-operation-book-all.csv"
              ).catch(() => toast.error("CSV download failed"))
            }
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted"
          >
            <Download className="h-4 w-4" /> CSV
          </button>
          <button
            type="button"
            onClick={() =>
              downloadOperationExport(
                `/admin/operations/export.pdf${suffix}`,
                "daily-operation-book-all.pdf"
              ).catch(() => toast.error("PDF download failed"))
            }
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted"
          >
            <Download className="h-4 w-4" /> PDF
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <div className="relative min-w-[16rem] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border bg-background"
            placeholder="Search name, Member ID, task…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <input
          type="date"
          className="px-3 py-2.5 text-sm rounded-xl border border-border bg-background"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            setPage(1);
          }}
        />
        <input
          type="date"
          className="px-3 py-2.5 text-sm rounded-xl border border-border bg-background"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
          <CalendarRange className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-semibold">No operation entries found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try clearing filters, or add an entry in My DOB.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => {
            const range = formatRange(row.startsAt, row.endsAt);
            return (
              <li
                key={row.id}
                className="rounded-2xl border border-border bg-card p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {row.user.fullName}
                      </span>
                      {row.user.memberId ? ` · ${row.user.memberId}` : ""}
                      <span className="mx-1.5 text-border">·</span>
                      <span className="uppercase tracking-wider text-[10px] font-bold">
                        {row.panelScope.replace(/_/g, " ")}
                      </span>
                    </p>
                    <h2 className="mt-1 text-base font-bold tracking-tight">
                      {row.taskName}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {typeof range === "string"
                        ? range
                        : `${range.day} · ${range.time}`}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {row.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {row.mentorsLabel ? (
                    <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs">
                      <Users className="h-3 w-3 shrink-0 text-emerald-600" />
                      <span className="truncate">
                        <span className="font-semibold">Mentors:</span>{" "}
                        {row.mentorsLabel}
                      </span>
                    </span>
                  ) : null}
                  <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs">
                    <Users className="h-3 w-3 shrink-0 text-sky-600" />
                    <span className="truncate">
                      <span className="font-semibold">Attendees:</span>{" "}
                      {row.attendees || "—"}
                    </span>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 mt-5">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-xl border border-border text-sm disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-xs text-muted-foreground">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-xl border border-border text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
