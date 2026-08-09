"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, Loader2, Search } from "lucide-react";
import {
  downloadOperationExport,
  useAdminListOperationsQuery,
} from "@/redux/features/operations/operationsApi";

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
            Daily Operation Book
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Centralized sheet of all panels (super admin / admin).
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
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted"
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
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted"
          >
            <Download className="h-4 w-4" /> PDF
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            className="pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-background"
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
          className="px-3 py-2 text-sm rounded-lg border border-border bg-background"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            setPage(1);
          }}
        />
        <input
          type="date"
          className="px-3 py-2 text-sm rounded-lg border border-border bg-background"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5 font-bold">Name</th>
                <th className="px-3 py-2.5 font-bold">Member ID</th>
                <th className="px-3 py-2.5 font-bold">Task</th>
                <th className="px-3 py-2.5 font-bold">Description</th>
                <th className="px-3 py-2.5 font-bold">Date &amp; Time</th>
                <th className="px-3 py-2.5 font-bold">Mentors</th>
                <th className="px-3 py-2.5 font-bold">Attendees</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                    Loading…
                  </td>
                </tr>
              )}
              {!isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                    No operation entries found.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border align-top">
                  <td className="px-3 py-3 font-medium">{row.user.fullName}</td>
                  <td className="px-3 py-3 text-xs">{row.user.memberId ?? "—"}</td>
                  <td className="px-3 py-3">{row.taskName}</td>
                  <td
                    className="px-3 py-3 text-xs max-w-[16rem] truncate"
                    title={row.description}
                  >
                    {row.description}
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(row.startsAt).toLocaleString()}
                    <br />→ {new Date(row.endsAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-xs max-w-[12rem]">
                    {row.mentorsLabel || "—"}
                  </td>
                  <td className="px-3 py-3 text-xs">{row.attendees}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-lg border border-border text-sm disabled:opacity-40"
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
            className="px-3 py-1.5 rounded-lg border border-border text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
