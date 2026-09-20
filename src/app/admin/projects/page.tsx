"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  FolderKanban,
  ImageOff,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import { useGetAdminCampaignsQuery } from "@/redux/features/campaigns/adminCampaignsApi";
import type { CampaignStatus } from "@/types/campaigns";
import ProjectModal from "./ProjectModal";

/**
 * Projects — the donation campaigns the public site raises against.
 *
 * Its own section rather than a tab under Donations: everything on the public
 * /projects pages comes from these rows, so they are content to be authored,
 * not a view of the donation ledger.
 *
 * The list is deliberately thin — a thumbnail, a name and a status. It used to
 * carry the summary, the running total, a progress bar and six buttons in every
 * row, which made scanning twenty projects a scroll rather than a glance. All
 * of it now lives on the project page, one click away and with room for it.
 */

const STATUS_STYLE: Record<CampaignStatus, string> = {
  ACTIVE:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  PAUSED: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  COMPLETED: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  ARCHIVED: "bg-muted text-muted-foreground",
};

const FILTERS: { label: string; value: "" | CampaignStatus }[] = [
  { label: "All", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Paused", value: "PAUSED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Archived", value: "ARCHIVED" },
];

export default function AdminProjectsPage() {
  const { data, isLoading } = useGetAdminCampaignsQuery({ status: "" });

  /** Only ever open for a new project; editing happens on the project page. */
  const [creating, setCreating] = useState(false);
  const [status, setStatus] = useState<"" | CampaignStatus>("");
  const [q, setQ] = useState("");

  const all = useMemo(() => data?.data ?? [], [data]);
  const projects = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all
      .filter((c) => (status ? c.status === status : true))
      .filter((c) => (needle ? c.title.toLowerCase().includes(needle) : true))
      // Display order is what the public page uses, so the admin matches it.
      .slice()
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  }, [all, status, q]);

  return (
    <div className="space-y-5 max-w-6xl 2xl:max-w-none">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
            <FolderKanban className="h-6 w-6 text-emerald-600" /> Projects
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The appeals the public site raises against. Everything here — title,
            description, cover image, goal — is what visitors see.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects…"
            aria-label="Search projects"
            className="w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 sm:w-64"
          />
        </div>
        <div className="flex gap-1 rounded-xl border border-border bg-muted/50 p-1">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setStatus(f.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                status === f.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs tabular-nums text-muted-foreground">
          {projects.length} of {all.length}
        </span>
      </div>

      {creating && <ProjectModal onClose={() => setCreating(false)} />}

      {isLoading ? (
        <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading projects…
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
          {all.length === 0
            ? "No projects yet — create the first one."
            : "Nothing matches these filters."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="w-20 px-4 py-2.5">Image</th>
                  <th className="px-4 py-2.5">Project</th>
                  <th className="w-32 px-4 py-2.5">Status</th>
                  <th className="w-10 px-4 py-2.5">
                    <span className="sr-only">Open</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((c) => (
                  // The row is a positioning context so the title link can
                  // stretch over it: the whole row is the click target, and it
                  // is still a real link for keyboard and middle-click.
                  <tr
                    key={c.id}
                    className="relative border-t border-border transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-2.5">
                      <span className="relative flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
                        {c.coverImage?.url ? (
                          <Image
                            src={c.coverImage.url}
                            alt={c.coverImage.alt ?? ""}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <ImageOff className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <Link
                        href={`/admin/donation/project/${c.id}`}
                        className="font-semibold text-foreground after:absolute after:inset-0 hover:text-emerald-600"
                      >
                        {c.title}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLE[c.status]}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
