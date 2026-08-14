"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Archive,
  CheckCircle2,
  ClipboardList,
  GitFork,
  Loader2,
  Lock,
  Plus,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import {
  useArchiveAssessmentDefinitionMutation,
  useCreateAssessmentDefinitionMutation,
  useForkAssessmentDefinitionMutation,
  useListAssessmentDefinitionsQuery,
  usePublishAssessmentDefinitionMutation,
} from "@/redux/features/assessments/assessmentsApi";
import type { AdminDefinitionSummary } from "@/types/assessments";

/**
 * Assessment definitions — FR-05-015, FR-05-016.
 *
 * A published version is read-only everywhere in this UI. The only route to
 * changing one is Fork, which is deliberately a visible, named action rather
 * than something that happens silently behind an edit form: forking creates a
 * version members will eventually be moved onto, and whoever does it should
 * know that is what they did.
 */

const CATEGORIES = [
  "SOCIO_DEMOGRAPHIC",
  "CAREER",
  "PSYCHOLOGICAL",
  "COGNITIVE",
  "HEALTH",
  "APTITUDE",
] as const;

const STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  PUBLISHED:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  ARCHIVED: "bg-muted text-muted-foreground",
};

export default function AdminAssessmentsPage() {
  const { data, isLoading } = useListAssessmentDefinitionsQuery();
  const [createDefinition, { isLoading: creating }] =
    useCreateAssessmentDefinitionMutation();
  const [fork] = useForkAssessmentDefinitionMutation();
  const [publish] = usePublishAssessmentDefinitionMutation();
  const [archive] = useArchiveAssessmentDefinitionMutation();
  const [showNew, setShowNew] = useState(false);

  const definitions = data ?? [];
  const grouped = CATEGORIES.map((category) => ({
    category,
    versions: definitions.filter((d) => d.category === category),
  })).filter((g) => g.versions.length > 0);

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    try {
      await fn();
      toast.success(ok);
    } catch (e) {
      toast.error(
        (e as { data?: { message?: string } })?.data?.message ?? "Action failed"
      );
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Assessments
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Questions, sections, difficulty and test rules — editable without a
            deployment.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNew((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          New draft
        </button>
      </header>

      {showNew && (
        <NewDefinitionForm
          busy={creating}
          onCancel={() => setShowNew(false)}
          onCreate={async (payload) => {
            await run(
              () => createDefinition(payload).unwrap(),
              "Draft created"
            );
            setShowNew(false);
          }}
        />
      )}

      <div className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50/60 p-4 dark:border-sky-900 dark:bg-sky-950/30">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <p className="text-sm leading-relaxed text-foreground">
          Published versions are frozen. Members already part-way through keep
          the version they started on, so fork a new draft to make changes and
          publish it when it is ready.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      )}

      {!isLoading && definitions.length === 0 && (
        <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No definitions yet. Create a draft, or run{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            npm run db:seed:assessments
          </code>{" "}
          to load the standard set.
        </p>
      )}

      <div className="space-y-5">
        {grouped.map(({ category, versions }) => (
          <section key={category}>
            <h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              <ClipboardList className="h-3.5 w-3.5" />
              {category.replace(/_/g, " ")}
            </h2>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              {versions.map((definition) => (
                <DefinitionRow
                  key={definition.id}
                  definition={definition}
                  onFork={() =>
                    run(() => fork(definition.id).unwrap(), "New draft created")
                  }
                  onPublish={() =>
                    run(() => publish(definition.id).unwrap(), "Published")
                  }
                  onArchive={() =>
                    run(() => archive(definition.id).unwrap(), "Archived")
                  }
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function DefinitionRow({
  definition,
  onFork,
  onPublish,
  onArchive,
}: {
  definition: AdminDefinitionSummary;
  onFork: () => void;
  onPublish: () => void;
  onArchive: () => void;
}) {
  const isDraft = definition.status === "DRAFT";

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
          STATUS_STYLE[definition.status] ?? ""
        }`}
      >
        {definition.status}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          v{definition.version} — {definition.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {definition._count.sections} section
          {definition._count.sections === 1 ? "" : "s"} ·{" "}
          {definition._count.attempts} attempt
          {definition._count.attempts === 1 ? "" : "s"}
          {definition.durationMinutes
            ? ` · ${definition.durationMinutes} min timed`
            : " · untimed"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/admin/assessments/${definition.id}`}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
        >
          {isDraft ? "Edit" : "View"}
        </Link>

        {isDraft ? (
          <button
            type="button"
            onClick={onPublish}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            <Send className="h-3 w-3" />
            Publish
          </button>
        ) : (
          <button
            type="button"
            onClick={onFork}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
          >
            <GitFork className="h-3 w-3" />
            Fork
          </button>
        )}

        {definition.status !== "ARCHIVED" && (
          <button
            type="button"
            onClick={onArchive}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
          >
            <Archive className="h-3 w-3" />
            Archive
          </button>
        )}

        {definition.status === "PUBLISHED" && (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        )}
      </div>
    </div>
  );
}

function NewDefinitionForm({
  busy,
  onCreate,
  onCancel,
}: {
  busy: boolean;
  onCreate: (payload: {
    category: string;
    title: string;
    description?: string;
    rules?: string;
    durationMinutes?: number;
    passPercent?: number;
  }) => void;
  onCancel: () => void;
}) {
  const [category, setCategory] = useState<string>("CAREER");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [timed, setTimed] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(25);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-base font-bold text-foreground">New draft version</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Category">
          <select
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Title">
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Description shown to members">
            <textarea
              rows={2}
              className={inputClass}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              className="h-4 w-4 accent-emerald-600"
              checked={timed}
              onChange={(e) => setTimed(e.target.checked)}
            />
            <span className="text-sm text-foreground">
              Timed test — scored server-side, pass above 40%
            </span>
          </label>
        </div>

        {timed && (
          <>
            <Field label="Duration (minutes)">
              <input
                type="number"
                min={1}
                className={inputClass}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Rules shown before the clock starts">
                <textarea
                  rows={3}
                  className={inputClass}
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                />
              </Field>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          disabled={busy || !title.trim()}
          onClick={() =>
            onCreate({
              category,
              title: title.trim(),
              description: description.trim() || undefined,
              rules: timed ? rules.trim() || undefined : undefined,
              durationMinutes: timed ? durationMinutes : undefined,
            })
          }
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Create draft
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
