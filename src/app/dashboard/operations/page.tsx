"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Download,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  downloadOperationExport,
  useCreateOperationMutation,
  useDeleteOperationMutation,
  useLazySearchOperationMembersQuery,
  useListMyOperationsQuery,
  useUpdateOperationMutation,
} from "@/redux/features/operations/operationsApi";
import type {
  OperationEntry,
  OperationEntryInput,
  OperationMemberOption,
} from "@/types/operations";

const fieldClass =
  "w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

function toLocalInput(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function emptyForm(): OperationEntryInput & {
  includeOthers: boolean;
  mentorQuery: string;
} {
  const now = new Date();
  const later = new Date(now.getTime() + 60 * 60 * 1000);
  return {
    taskName: "",
    startsAt: toLocalInput(now.toISOString()),
    endsAt: toLocalInput(later.toISOString()),
    mentorIds: [],
    mentorsOther: "",
    attendees: "",
    description: "",
    includeOthers: false,
    mentorQuery: "",
  };
}

export default function DashboardOperationsPage() {
  const user = useSelector(selectCurrentUser);
  const { data, isLoading } = useListMyOperationsQuery({ limit: 100 });
  const [createEntry, { isLoading: creating }] = useCreateOperationMutation();
  const [updateEntry, { isLoading: updating }] = useUpdateOperationMutation();
  const [deleteEntry] = useDeleteOperationMutation();
  const [searchMembers, { data: searchResults = [] }] =
    useLazySearchOperationMembersQuery();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<OperationEntry | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedMentors, setSelectedMentors] = useState<
    OperationMemberOption[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const rows = data?.data ?? [];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setSelectedMentors([]);
    setError(null);
    setOpen(true);
  };

  const openEdit = (row: OperationEntry) => {
    setEditing(row);
    setForm({
      taskName: row.taskName,
      startsAt: toLocalInput(row.startsAt),
      endsAt: toLocalInput(row.endsAt),
      mentorIds: row.mentorIds,
      mentorsOther: row.mentorsOther ?? "",
      attendees: row.attendees,
      description: row.description,
      includeOthers: Boolean(row.mentorsOther),
      mentorQuery: "",
    });
    setSelectedMentors(
      row.mentorIds.map((id) => ({
        id,
        fullName: row.mentorsLabel?.includes(id) ? id : id,
        memberId: null,
        email: "",
      }))
    );
    // Refresh mentor labels via search if needed — store minimal chips from label parse
    setSelectedMentors(
      (row.mentorsLabel || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, row.mentorIds.length)
        .map((label, i) => ({
          id: row.mentorIds[i],
          fullName: label.replace(/\s*\(.*?\)\s*$/, ""),
          memberId: null,
          email: "",
        }))
    );
    setError(null);
    setOpen(true);
  };

  const patch = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));

  const onSearchMentors = (q: string) => {
    patch({ mentorQuery: q });
    if (q.trim().length >= 2) searchMembers(q.trim());
  };

  const addMentor = (m: OperationMemberOption) => {
    if (selectedMentors.some((x) => x.id === m.id)) return;
    setSelectedMentors((prev) => [...prev, m]);
    patch({ mentorIds: [...form.mentorIds, m.id], mentorQuery: "" });
  };

  const removeMentor = (id: string) => {
    setSelectedMentors((prev) => prev.filter((m) => m.id !== id));
    patch({ mentorIds: form.mentorIds.filter((x) => x !== id) });
  };

  const submit = async () => {
    setError(null);
    if (!form.taskName.trim()) return setError("Task name is required.");
    if (!form.attendees.trim()) return setError("Attendees are required.");
    if (!form.description.trim()) return setError("Description is required.");
    if (form.includeOthers && !form.mentorsOther?.trim() && !form.mentorIds.length) {
      return setError("Add mentors or others.");
    }

    const body: OperationEntryInput = {
      taskName: form.taskName.trim(),
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: new Date(form.endsAt).toISOString(),
      mentorIds: form.mentorIds,
      mentorsOther: form.includeOthers ? form.mentorsOther?.trim() || null : null,
      attendees: form.attendees.trim(),
      description: form.description.trim(),
    };

    try {
      if (editing) {
        await updateEntry({ id: editing.id, data: body }).unwrap();
        toast.success("Entry updated");
      } else {
        await createEntry(body).unwrap();
        toast.success("Entry created");
      }
      setOpen(false);
    } catch (e) {
      setError(
        (e as { data?: { message?: string } })?.data?.message ?? "Save failed"
      );
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await deleteEntry(id).unwrap();
      toast.success("Deleted");
    } catch {
      /* toasted */
    }
  };

  const filteredSearch = useMemo(
    () => searchResults.filter((m) => !form.mentorIds.includes(m.id)),
    [searchResults, form.mentorIds]
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daily Operation Book</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user?.fullName}
            {user?.memberId ? ` · ${user.memberId}` : ""} — name and Member ID
            fill automatically.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              downloadOperationExport(
                "/operations/mine/export.csv",
                "daily-operation-book.csv"
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
                "/operations/mine/export.pdf",
                "daily-operation-book.pdf"
              ).catch(() => toast.error("PDF download failed"))
            }
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted"
          >
            <Download className="h-4 w-4" /> PDF
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" /> New entry
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5 font-bold">Task</th>
                <th className="px-3 py-2.5 font-bold">Description</th>
                <th className="px-3 py-2.5 font-bold">From → To</th>
                <th className="px-3 py-2.5 font-bold">Mentors</th>
                <th className="px-3 py-2.5 font-bold">Attendees</th>
                <th className="px-3 py-2.5 font-bold w-24" />
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                    Loading…
                  </td>
                </tr>
              )}
              {!isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                    No entries yet. Add your first task.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border align-top">
                  <td className="px-3 py-3 font-medium">{row.taskName}</td>
                  <td className="px-3 py-3 text-xs max-w-[16rem] truncate" title={row.description}>
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
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="p-1.5 rounded-md hover:bg-muted"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row.id)}
                        className="p-1.5 rounded-md hover:bg-muted text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                {editing ? "Edit entry" : "New entry"}
              </h2>
              <button type="button" onClick={() => setOpen(false)} className="p-1.5 rounded-md hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Task name
                <input
                  className={`${fieldClass} mt-1`}
                  value={form.taskName}
                  onChange={(e) => patch({ taskName: e.target.value })}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  From
                  <input
                    type="datetime-local"
                    className={`${fieldClass} mt-1`}
                    value={form.startsAt}
                    onChange={(e) => patch({ startsAt: e.target.value })}
                  />
                </label>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  To
                  <input
                    type="datetime-local"
                    className={`${fieldClass} mt-1`}
                    value={form.endsAt}
                    onChange={(e) => patch({ endsAt: e.target.value })}
                  />
                </label>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Mentors (search by name / Member ID)
                </p>
                <p className="text-[11px] text-muted-foreground mb-2">
                  Multiple mentors: select several. Use comma in Others for free-text names.
                </p>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    className={`${fieldClass} pl-8`}
                    value={form.mentorQuery}
                    onChange={(e) => onSearchMentors(e.target.value)}
                    placeholder="Search registered members…"
                  />
                </div>
                {form.mentorQuery.trim().length >= 2 && filteredSearch.length > 0 && (
                  <ul className="mt-1 rounded-lg border border-border bg-background max-h-36 overflow-y-auto">
                    {filteredSearch.map((m) => (
                      <li key={m.id}>
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                          onClick={() => addMentor(m)}
                        >
                          {m.fullName}
                          {m.memberId ? (
                            <span className="text-muted-foreground"> · {m.memberId}</span>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedMentors.map((m) => (
                    <span
                      key={m.id}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                    >
                      {m.fullName}
                      <button type="button" onClick={() => removeMentor(m.id)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <label className="flex items-center gap-2 mt-3 text-sm">
                  <input
                    type="checkbox"
                    checked={form.includeOthers}
                    onChange={(e) => patch({ includeOthers: e.target.checked })}
                    className="accent-emerald-600"
                  />
                  Others (free text)
                </label>
                {form.includeOthers && (
                  <input
                    className={`${fieldClass} mt-1`}
                    value={form.mentorsOther ?? ""}
                    onChange={(e) => patch({ mentorsOther: e.target.value })}
                    placeholder="Comma-separated names"
                  />
                )}
              </div>

              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Attendees
                <input
                  className={`${fieldClass} mt-1`}
                  value={form.attendees}
                  onChange={(e) => patch({ attendees: e.target.value })}
                  placeholder="Names if &lt;5 people; count if 5+"
                />
                <span className="mt-1 block text-[11px] font-normal normal-case tracking-normal text-muted-foreground">
                  For 5+ persons use a number; for fewer than 5 use names.
                </span>
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Task description
                <textarea
                  className={`${fieldClass} mt-1`}
                  rows={3}
                  value={form.description}
                  onChange={(e) => patch({ description: e.target.value })}
                />
              </label>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={creating || updating}
                  onClick={submit}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-60"
                >
                  {(creating || updating) && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
