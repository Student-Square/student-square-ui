"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  CalendarRange,
  ChevronDown,
  Download,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
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
  "w-full px-3 py-2.5 text-sm rounded-xl bg-background border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

function toLocalInput(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatRange(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "—";
  const sameDay = start.toDateString() === end.toDateString();
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
  if (sameDay) return { day, time: `${t1} – ${t2}` };
  return {
    day: `${day} → ${end.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    })}`,
    time: `${t1} – ${t2}`,
  };
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
    attendeeMode: "NAMES",
    attendeeNames: [],
    attendeeCount: undefined,
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
  const [showDetails, setShowDetails] = useState(false);
  const [editing, setEditing] = useState<OperationEntry | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedMentors, setSelectedMentors] = useState<
    OperationMemberOption[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [listQuery, setListQuery] = useState("");

  const rows = data?.data ?? [];
  const filteredRows = useMemo(() => {
    const q = listQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.taskName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.mentorsLabel ?? "").toLowerCase().includes(q) ||
        r.attendees.toLowerCase().includes(q)
    );
  }, [rows, listQuery]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setSelectedMentors([]);
    setShowDetails(false);
    setError(null);
    setOpen(true);
  };

  const openEdit = (row: OperationEntry) => {
    const hasDetails =
      Boolean(row.description?.trim()) ||
      Boolean(row.mentorsLabel?.trim()) ||
      (row.attendees && row.attendees !== "—") ||
      Boolean(row.mentorsOther);
    setEditing(row);
    setForm({
      taskName: row.taskName,
      startsAt: toLocalInput(row.startsAt),
      endsAt: toLocalInput(row.endsAt),
      mentorIds: row.mentorIds,
      mentorsOther: row.mentorsOther ?? "",
      attendeeMode: row.attendeeMode,
      attendeeNames:
        row.attendeeMode === "NAMES" && row.attendeeNames.length
          ? row.attendeeNames
          : [],
      attendeeCount: row.attendeeCount ?? undefined,
      description: row.description ?? "",
      includeOthers: Boolean(row.mentorsOther),
      mentorQuery: "",
    });
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
    setShowDetails(hasDetails);
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
    patch({ mentorIds: [...(form.mentorIds ?? []), m.id], mentorQuery: "" });
  };

  const removeMentor = (id: string) => {
    setSelectedMentors((prev) => prev.filter((m) => m.id !== id));
    patch({ mentorIds: (form.mentorIds ?? []).filter((x) => x !== id) });
  };

  const submit = async () => {
    setError(null);
    if (!form.taskName.trim()) return setError("Task name is required.");
    if (new Date(form.endsAt) <= new Date(form.startsAt)) {
      return setError("End time must be after start time.");
    }
    if (form.attendeeMode === "NAMES") {
      const named = (form.attendeeNames ?? []).filter((n) => n.trim()).length;
      if (named >= 5)
        return setError("From 5 attendees, switch to a headcount.");
    } else if (form.attendeeCount != null && form.attendeeCount < 5) {
      return setError("A headcount is for 5 or more — otherwise list names.");
    }

    const body: OperationEntryInput = {
      taskName: form.taskName.trim(),
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: new Date(form.endsAt).toISOString(),
      mentorIds: form.mentorIds,
      mentorsOther: form.includeOthers ? form.mentorsOther?.trim() || null : null,
      attendeeMode: form.attendeeMode,
      attendeeNames:
        form.attendeeMode === "NAMES"
          ? (form.attendeeNames ?? []).map((n) => n.trim()).filter(Boolean)
          : undefined,
      attendeeCount:
        form.attendeeMode === "COUNT" ? form.attendeeCount : undefined,
      description: form.description?.trim() || "",
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
    () => searchResults.filter((m) => !form.mentorIds?.includes(m.id)),
    [searchResults, form.mentorIds]
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Daily Operation Book
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user?.fullName}
            {user?.memberId ? ` · ${user.memberId}` : ""}
          </p>
          <p className="mt-1 text-xs text-muted-foreground max-w-xl">
            Write the task — time is set automatically. Add details only if you
            need them.
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
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted"
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
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted"
          >
            <Download className="h-4 w-4" /> PDF
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" /> New entry
          </button>
        </div>
      </div>

      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border bg-background"
          placeholder="Search tasks…"
          value={listQuery}
          onChange={(e) => setListQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading…
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
          <CalendarRange className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-semibold">
            {listQuery ? "No matching entries" : "No entries yet"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            {listQuery
              ? "Try a different search."
              : "Add a task name — that’s enough to start."}
          </p>
          {!listQuery && (
            <button
              type="button"
              onClick={openCreate}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" /> Add first entry
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredRows.map((row) => {
            const range = formatRange(row.startsAt, row.endsAt);
            const hasMeta =
              Boolean(row.description?.trim()) ||
              Boolean(row.mentorsLabel?.trim()) ||
              (row.attendees && row.attendees !== "—");
            return (
              <li
                key={row.id}
                className="rounded-2xl border border-border bg-card p-4 sm:p-5 hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold tracking-tight">
                        {row.taskName}
                      </h2>
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <CalendarRange className="h-3 w-3" />
                        {typeof range === "string" ? range : range.day}
                      </span>
                    </div>
                    {typeof range !== "string" && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {range.time}
                      </p>
                    )}
                    {row.description?.trim() ? (
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {row.description}
                      </p>
                    ) : null}
                    {hasMeta && (
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
                        {row.attendees && row.attendees !== "—" ? (
                          <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs">
                            <Users className="h-3 w-3 shrink-0 text-sky-600" />
                            <span className="truncate">
                              <span className="font-semibold">Attendees:</span>{" "}
                              {row.attendees}
                            </span>
                          </span>
                        ) : null}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(row.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-500/5"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-xl max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur px-5 py-4">
              <div>
                <h2 className="text-lg font-bold">
                  {editing ? "Edit entry" : "New entry"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Only the task is required
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <label className="block text-xs font-semibold text-muted-foreground">
                Task
                <input
                  autoFocus
                  className={`${fieldClass} mt-1.5`}
                  value={form.taskName}
                  onChange={(e) => patch({ taskName: e.target.value })}
                  placeholder="What did you do?"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !showDetails) {
                      e.preventDefault();
                      void submit();
                    }
                  }}
                />
              </label>

              <button
                type="button"
                onClick={() => setShowDetails((v) => !v)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${showDetails ? "rotate-180" : ""}`}
                />
                {showDetails ? "Hide details" : "Add details (optional)"}
              </button>

              {showDetails && (
                <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block text-xs font-semibold text-muted-foreground">
                      From
                      <input
                        type="datetime-local"
                        className={`${fieldClass} mt-1.5`}
                        value={form.startsAt}
                        onChange={(e) => patch({ startsAt: e.target.value })}
                      />
                    </label>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      To
                      <input
                        type="datetime-local"
                        className={`${fieldClass} mt-1.5`}
                        value={form.endsAt}
                        onChange={(e) => patch({ endsAt: e.target.value })}
                      />
                    </label>
                  </div>

                  <label className="block text-xs font-semibold text-muted-foreground">
                    Description
                    <textarea
                      className={`${fieldClass} mt-1.5`}
                      rows={2}
                      value={form.description}
                      onChange={(e) => patch({ description: e.target.value })}
                      placeholder="Optional notes…"
                    />
                  </label>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Mentors (optional)
                    </p>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        className={`${fieldClass} pl-9`}
                        value={form.mentorQuery}
                        onChange={(e) => onSearchMentors(e.target.value)}
                        placeholder="Search by name or Member ID…"
                      />
                    </div>
                    {form.mentorQuery.trim().length >= 2 &&
                      filteredSearch.length > 0 && (
                        <ul className="rounded-xl border border-border bg-background max-h-36 overflow-y-auto divide-y divide-border">
                          {filteredSearch.map((m) => (
                            <li key={m.id}>
                              <button
                                type="button"
                                className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                                onClick={() => addMentor(m)}
                              >
                                <span className="font-medium">{m.fullName}</span>
                                {m.memberId ? (
                                  <span className="text-muted-foreground">
                                    {" "}
                                    · {m.memberId}
                                  </span>
                                ) : null}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMentors.map((m) => (
                        <span
                          key={m.id}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
                        >
                          {m.fullName}
                          <button
                            type="button"
                            onClick={() => removeMentor(m.id)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.includeOthers}
                        onChange={(e) =>
                          patch({ includeOthers: e.target.checked })
                        }
                        className="accent-emerald-600 h-4 w-4"
                      />
                      Others (not registered)
                    </label>
                    {form.includeOthers && (
                      <input
                        className={fieldClass}
                        value={form.mentorsOther ?? ""}
                        onChange={(e) =>
                          patch({ mentorsOther: e.target.value })
                        }
                        placeholder="Comma-separated names"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Attendees (optional)
                    </p>
                    <div className="flex gap-1.5">
                      {(["NAMES", "COUNT"] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => patch({ attendeeMode: mode })}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                            form.attendeeMode === mode
                              ? "bg-emerald-600 text-white"
                              : "border border-border text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {mode === "NAMES" ? "Names (1–4)" : "Headcount (5+)"}
                        </button>
                      ))}
                    </div>
                    {form.attendeeMode === "NAMES" ? (
                      <div className="space-y-2">
                        {(form.attendeeNames ?? []).map((name, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              className={fieldClass}
                              value={name}
                              onChange={(e) => {
                                const next = [...(form.attendeeNames ?? [])];
                                next[index] = e.target.value;
                                patch({ attendeeNames: next });
                              }}
                              placeholder={`Attendee ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                patch({
                                  attendeeNames: (
                                    form.attendeeNames ?? []
                                  ).filter((_, i) => i !== index),
                                })
                              }
                              className="px-2.5 rounded-xl border border-border text-muted-foreground hover:text-rose-600"
                              aria-label="Remove attendee"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        {(form.attendeeNames ?? []).length < 4 && (
                          <button
                            type="button"
                            onClick={() =>
                              patch({
                                attendeeNames: [
                                  ...(form.attendeeNames ?? []),
                                  "",
                                ],
                              })
                            }
                            className="text-xs font-semibold text-emerald-600 hover:underline"
                          >
                            + Add attendee
                          </button>
                        )}
                      </div>
                    ) : (
                      <input
                        type="number"
                        min={5}
                        className={fieldClass}
                        value={form.attendeeCount ?? ""}
                        onChange={(e) =>
                          patch({
                            attendeeCount: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                        placeholder="How many attended (5 or more)"
                      />
                    )}
                  </div>
                </div>
              )}

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-1 border-t border-border">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={creating || updating}
                  onClick={() => void submit()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold disabled:opacity-60"
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
