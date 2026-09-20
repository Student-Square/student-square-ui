"use client";

import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChevronDown, ChevronRight, Loader2, RotateCcw, Search, ShieldAlert } from "lucide-react";
import Pagination from "@/components/common/Pagination";
import { TABLE_PAGE_SIZE } from "@/lib/pagination";
import { selectUserRole } from "@/redux/features/auth/authSlice";
import {
  useGetAuditFacetsQuery,
  useGetAuditLogsQuery,
  type AuditEntry,
} from "@/redux/features/audit/auditApi";

/**
 * System Admin only — the API refuses everyone else (audit.routes.ts). Every
 * recorded admin action and every sign-in to an existing account, newest first.
 */

const PAGE_SIZE = TABLE_PAGE_SIZE;

const FIELD =
  "text-sm rounded-lg border border-border bg-background px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30";

/** Colour by consequence, not by module: red destroys or signals attack, amber changes access. */
const actionTone = (action: string) => {
  if (/DELETE|LOCKED|FAILED|REFUND|MARK_SPAM|REJECT/.test(action))
    return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (/PASSWORD|MFA|LOGOUT|CLOSE_PERIOD|ARCHIVE|PAUSE|CANCEL/.test(action))
    return "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300";
  if (/LOGIN/.test(action))
    return "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300";
  return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
};

const humanise = (s: string) => s.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export default function AuditLogPage() {
  const role = useSelector(selectUserRole);
  const isSystemAdmin = role === "SYSTEM_ADMIN";

  const [page, setPage] = useState(1);
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  // Debounce the search box so typing a name is one request, not one per key.
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(qInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [qInput]);

  const { data: facets } = useGetAuditFacetsQuery(undefined, { skip: !isSystemAdmin });
  const { data, isFetching, isError } = useGetAuditLogsQuery(
    {
      page,
      limit: PAGE_SIZE,
      ...(q ? { q } : {}),
      ...(action ? { action } : {}),
      ...(entityType ? { entityType } : {}),
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    },
    { skip: !isSystemAdmin }
  );

  if (!isSystemAdmin) {
    return (
      <div className="max-w-2xl flex items-start gap-3 rounded-lg border border-border bg-card p-5">
        <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-foreground">System Admin only</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The audit log is restricted to the system administrator.
          </p>
        </div>
      </div>
    );
  }

  const total = data?.meta.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtered = Boolean(q || action || entityType || from || to);

  const reset = () => {
    setQInput("");
    setQ("");
    setAction("");
    setEntityType("");
    setFrom("");
    setTo("");
    setPage(1);
  };

  return (
    <div className="space-y-5 max-w-6xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Audit Log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every admin action and every sign-in, newest first. Times are Asia/Dhaka; IP addresses are
          stored to the nearest /24 block.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder="Search who — name or email…"
            aria-label="Search by actor name or email"
            className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border bg-background w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/60"
          />
        </div>
        <select
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(1); }}
          aria-label="Action"
          className={FIELD}
        >
          <option value="">All actions</option>
          {facets?.actions.map((a) => <option key={a} value={a}>{humanise(a)}</option>)}
        </select>
        <select
          value={entityType}
          onChange={(e) => { setEntityType(e.target.value); setPage(1); }}
          aria-label="Record type"
          className={FIELD}
        >
          <option value="">All record types</option>
          {facets?.entityTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          From
          <input type="date" value={from} max={to || undefined} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className={FIELD} />
        </label>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          To
          <input type="date" value={to} min={from || undefined} onChange={(e) => { setTo(e.target.value); setPage(1); }} className={FIELD} />
        </label>
        {filtered && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground px-2 py-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        )}
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {isFetching ? <Loader2 className="h-3.5 w-3.5 animate-spin inline" /> : `${total.toLocaleString()} entr${total === 1 ? "y" : "ies"}`}
        </span>
      </div>

      {isError && <p className="text-sm text-red-600">Failed to load the audit log.</p>}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="w-8" />
                <th className="text-left font-semibold px-3 py-2.5 whitespace-nowrap">When</th>
                <th className="text-left font-semibold px-3 py-2.5">Who</th>
                <th className="text-left font-semibold px-3 py-2.5">Action</th>
                <th className="text-left font-semibold px-3 py-2.5">Record</th>
                <th className="text-left font-semibold px-3 py-2.5 hidden md:table-cell">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.data.map((e) => (
                <AuditRow
                  key={e.id}
                  entry={e}
                  expanded={open === e.id}
                  onToggle={() => setOpen(open === e.id ? null : e.id)}
                />
              ))}
              {data && data.data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-12 text-center text-sm text-muted-foreground">
                    {filtered ? "Nothing matches these filters." : "No audit entries yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-6" />
    </div>
  );
}

function AuditRow({
  entry: e,
  expanded,
  onToggle,
}: {
  entry: AuditEntry;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasDetail = e.diff != null || Boolean(e.userAgent);

  return (
    <Fragment>
      <tr
        className={`align-top ${hasDetail ? "cursor-pointer hover:bg-muted/40" : ""}`}
        onClick={hasDetail ? onToggle : undefined}
      >
        <td className="pl-3 py-2.5 text-muted-foreground">
          {hasDetail && (
            <button type="button" aria-label={expanded ? "Hide details" : "Show details"} aria-expanded={expanded} className="align-middle">
              {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          )}
        </td>
        <td className="px-3 py-2.5 whitespace-nowrap text-xs text-muted-foreground tabular-nums">
          {formatTime(e.createdAt)}
        </td>
        <td className="px-3 py-2.5 min-w-[10rem]">
          {e.actor ? (
            <>
              <p className="font-medium text-foreground leading-tight">{e.actor.fullName}</p>
              <p className="text-xs text-muted-foreground break-all">
                {e.actor.email} · {humanise(e.actor.role)}
              </p>
            </>
          ) : (
            <span className="text-xs text-muted-foreground italic">System / anonymous</span>
          )}
        </td>
        <td className="px-3 py-2.5">
          <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${actionTone(e.action)}`}>
            {humanise(e.action)}
          </span>
        </td>
        <td className="px-3 py-2.5">
          <p className="text-foreground">{e.entityType}</p>
          {e.entityId && (
            <p className="text-[11px] font-mono text-muted-foreground break-all">{e.entityId}</p>
          )}
        </td>
        <td className="px-3 py-2.5 hidden md:table-cell text-xs font-mono text-muted-foreground whitespace-nowrap">
          {e.ip ?? "—"}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-muted/30">
          <td />
          <td colSpan={5} className="px-3 py-3 space-y-2">
            {e.diff != null && (
              <pre className="text-[11px] leading-relaxed font-mono bg-background border border-border rounded-lg p-3 overflow-x-auto max-h-72">
                {JSON.stringify(e.diff, null, 2)}
              </pre>
            )}
            {e.userAgent && (
              <p className="text-[11px] text-muted-foreground break-all">
                <span className="font-semibold">Device:</span> {e.userAgent}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground md:hidden">
              <span className="font-semibold">IP:</span> {e.ip ?? "—"}
            </p>
          </td>
        </tr>
      )}
    </Fragment>
  );
}
