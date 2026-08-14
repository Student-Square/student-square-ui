"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Loader2,
  Lock,
  Plus,
  Save,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useAddAssessmentQuestionMutation,
  useAddAssessmentSectionMutation,
  useDeleteAssessmentQuestionMutation,
  useDeleteAssessmentSectionMutation,
  useGetAssessmentDefinitionQuery,
  useReorderAssessmentQuestionsMutation,
  useReorderAssessmentSectionsMutation,
  useUpdateAssessmentDefinitionMutation,
  useUpdateAssessmentQuestionMutation,
} from "@/redux/features/assessments/assessmentsApi";
import type { AdminQuestion, AdminSection, QuestionType } from "@/types/assessments";
import { Field, inputClass } from "../page";

/**
 * The dynamic form builder — FR-05-015.
 *
 * Everything on this screen is disabled when the definition is not a DRAFT.
 * The server refuses those writes anyway (FR-05-016); the UI just stops an
 * editor discovering it the hard way, three edits in.
 */

const QUESTION_TYPES: QuestionType[] = [
  "SINGLE_CHOICE",
  "MULTI_CHOICE",
  "FILL_BLANK",
  "TRUE_FALSE",
  "CORRECT_INCORRECT",
  "SCALE",
  "TEXT",
];

const CHOICE_TYPES = new Set<QuestionType>([
  "SINGLE_CHOICE",
  "MULTI_CHOICE",
  "TRUE_FALSE",
  "CORRECT_INCORRECT",
  "SCALE",
]);

/** Types that can carry a correct answer. SCALE and TEXT never do. */
const SCORABLE = new Set<QuestionType>([
  "SINGLE_CHOICE",
  "MULTI_CHOICE",
  "FILL_BLANK",
  "TRUE_FALSE",
  "CORRECT_INCORRECT",
]);

export default function AssessmentBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: definition, isLoading } = useGetAssessmentDefinitionQuery(id);

  const [updateDefinition] = useUpdateAssessmentDefinitionMutation();
  const [addSection] = useAddAssessmentSectionMutation();
  const [deleteSection] = useDeleteAssessmentSectionMutation();
  const [reorderSections] = useReorderAssessmentSectionsMutation();

  const [newSectionKey, setNewSectionKey] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionSensitive, setNewSectionSensitive] = useState(false);

  const editable = definition?.status === "DRAFT";

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    try {
      await fn();
      toast.success(ok);
      return true;
    } catch (e) {
      toast.error(
        (e as { data?: { message?: string } })?.data?.message ?? "Action failed"
      );
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading…
      </div>
    );
  }

  if (!definition) {
    return <p className="text-sm text-muted-foreground">Definition not found.</p>;
  }

  const move = (index: number, delta: number) => {
    const ids = definition.sections.map((s) => s.id);
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    void run(
      () => reorderSections({ definitionId: definition.id, ids }).unwrap(),
      "Sections reordered"
    );
  };

  return (
    <div className="space-y-6">
      <Link
        href="/admin/assessments"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-emerald-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All assessments
      </Link>

      <header>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {definition.title}
          </h1>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            {definition.category.replace(/_/g, " ")} v{definition.version} ·{" "}
            {definition.status}
          </span>
        </div>
      </header>

      {!editable && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50/60 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-sm leading-relaxed text-foreground">
            This version is {definition.status.toLowerCase()} and read-only.
            Fork it from the list page to make changes.
          </p>
        </div>
      )}

      {editable && (
        <DefinitionSettings
          definition={definition}
          onSave={(data) =>
            run(
              () => updateDefinition({ id: definition.id, data }).unwrap(),
              "Saved"
            )
          }
        />
      )}

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Sections and questions
        </h2>

        {definition.sections.map((section, index) => (
          <SectionCard
            key={section.id}
            definitionId={definition.id}
            section={section}
            editable={editable}
            isFirst={index === 0}
            isLast={index === definition.sections.length - 1}
            onMoveUp={() => move(index, -1)}
            onMoveDown={() => move(index, 1)}
            onDelete={() =>
              run(
                () =>
                  deleteSection({
                    definitionId: definition.id,
                    sectionId: section.id,
                  }).unwrap(),
                "Section deleted"
              )
            }
            run={run}
          />
        ))}

        {editable && (
          <div className="rounded-xl border border-dashed border-border bg-card p-4">
            <p className="text-sm font-semibold text-foreground">Add a section</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Field label="Key (stable id)">
                <input
                  className={inputClass}
                  value={newSectionKey}
                  onChange={(e) =>
                    setNewSectionKey(
                      e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_")
                    )
                  }
                  placeholder="analytical"
                />
              </Field>
              <Field label="Title">
                <input
                  className={inputClass}
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="Analytical thinking"
                />
              </Field>
              <div className="flex items-end">
                <label className="mb-2.5 flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-emerald-600"
                    checked={newSectionSensitive}
                    onChange={(e) => setNewSectionSensitive(e.target.checked)}
                  />
                  <span className="text-sm text-foreground">Sensitive (C3)</span>
                </label>
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              A sensitive section is encrypted at rest and excluded from SWOT
              derivation. Use it for health and psychological questions.
            </p>
            <button
              type="button"
              disabled={!newSectionKey || !newSectionTitle}
              onClick={async () => {
                const okDone = await run(
                  () =>
                    addSection({
                      definitionId: definition.id,
                      data: {
                        key: newSectionKey,
                        title: newSectionTitle,
                        sensitive: newSectionSensitive,
                      },
                    }).unwrap(),
                  "Section added"
                );
                if (okDone) {
                  setNewSectionKey("");
                  setNewSectionTitle("");
                  setNewSectionSensitive(false);
                }
              }}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              Add section
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function DefinitionSettings({
  definition,
  onSave,
}: {
  definition: { title: string; description: string | null; rules: string | null; durationMinutes: number | null; passPercent: number | null };
  onSave: (data: Record<string, unknown>) => void;
}) {
  const [title, setTitle] = useState(definition.title);
  const [description, setDescription] = useState(definition.description ?? "");
  const [rules, setRules] = useState(definition.rules ?? "");
  const [durationMinutes, setDurationMinutes] = useState(
    definition.durationMinutes ?? 0
  );
  const [passPercent, setPassPercent] = useState(definition.passPercent ?? 40);

  const timed = Boolean(definition.durationMinutes);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-base font-bold text-foreground">Settings</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        {timed && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Duration (min)">
              <input
                type="number"
                min={1}
                className={inputClass}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
              />
            </Field>
            <Field label="Pass %">
              <input
                type="number"
                min={0}
                max={100}
                className={inputClass}
                value={passPercent}
                onChange={(e) => setPassPercent(Number(e.target.value))}
              />
            </Field>
          </div>
        )}
        <div className="sm:col-span-2">
          <Field label="Description">
            <textarea
              rows={2}
              className={inputClass}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
        </div>
        {timed && (
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
        )}
      </div>
      <button
        type="button"
        onClick={() =>
          onSave({
            title,
            description: description || null,
            ...(timed
              ? { rules: rules || null, durationMinutes, passPercent }
              : {}),
          })
        }
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        <Save className="h-4 w-4" />
        Save settings
      </button>
    </div>
  );
}

function SectionCard({
  definitionId,
  section,
  editable,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDelete,
  run,
}: {
  definitionId: string;
  section: AdminSection;
  editable: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  run: (fn: () => Promise<unknown>, ok: string) => Promise<boolean>;
}) {
  const [addQuestion] = useAddAssessmentQuestionMutation();
  const [deleteQuestion] = useDeleteAssessmentQuestionMutation();
  const [reorderQuestions] = useReorderAssessmentQuestionsMutation();
  const [editing, setEditing] = useState<string | null>(null);

  const moveQuestion = (index: number, delta: number) => {
    const ids = section.questions.map((q) => q.id);
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    void run(
      () => reorderQuestions({ definitionId, sectionId: section.id, ids }).unwrap(),
      "Questions reordered"
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-bold text-foreground">
            {section.title}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {section.key}
            </code>
            {section.sensitive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                <ShieldAlert className="h-3 w-3" />
                Sensitive
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {section.questions.length} question
            {section.questions.length === 1 ? "" : "s"}
          </p>
        </div>

        {editable && (
          <div className="flex items-center gap-1">
            <IconButton disabled={isFirst} onClick={onMoveUp} label="Move section up">
              <ArrowUp className="h-3.5 w-3.5" />
            </IconButton>
            <IconButton disabled={isLast} onClick={onMoveDown} label="Move section down">
              <ArrowDown className="h-3.5 w-3.5" />
            </IconButton>
            <IconButton onClick={onDelete} label="Delete section" danger>
              <Trash2 className="h-3.5 w-3.5" />
            </IconButton>
          </div>
        )}
      </div>

      <div className="divide-y divide-border">
        {section.questions.map((question, index) => (
          <div key={question.id} className="px-4 py-3">
            {editing === question.id ? (
              <QuestionEditor
                definitionId={definitionId}
                question={question}
                onDone={() => setEditing(null)}
              />
            ) : (
              <div className="flex flex-wrap items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{question.prompt}</p>
                  <p className="mt-1 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                    <span className="rounded bg-muted px-1.5 py-0.5">
                      {question.type}
                    </span>
                    {question.difficulty && (
                      <span className="rounded bg-muted px-1.5 py-0.5">
                        {question.difficulty}
                      </span>
                    )}
                    {question.swotLabel && (
                      <span className="rounded bg-muted px-1.5 py-0.5">
                        SWOT: {question.swotLabel}
                      </span>
                    )}
                    {!question.required && (
                      <span className="rounded bg-muted px-1.5 py-0.5">optional</span>
                    )}
                  </p>
                </div>
                {editable && (
                  <div className="flex items-center gap-1">
                    <IconButton
                      disabled={index === 0}
                      onClick={() => moveQuestion(index, -1)}
                      label="Move question up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </IconButton>
                    <IconButton
                      disabled={index === section.questions.length - 1}
                      onClick={() => moveQuestion(index, 1)}
                      label="Move question down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </IconButton>
                    <button
                      type="button"
                      onClick={() => setEditing(question.id)}
                      className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      Edit
                    </button>
                    <IconButton
                      onClick={() =>
                        run(
                          () =>
                            deleteQuestion({
                              definitionId,
                              questionId: question.id,
                            }).unwrap(),
                          "Question deleted"
                        )
                      }
                      label="Delete question"
                      danger
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </IconButton>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {editable && (
        <div className="border-t border-border px-4 py-3">
          <button
            type="button"
            onClick={() =>
              run(
                () =>
                  addQuestion({
                    definitionId,
                    sectionId: section.id,
                    data: { type: "SINGLE_CHOICE", prompt: "New question" },
                  }).unwrap(),
                "Question added"
              )
            }
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            Add question
          </button>
        </div>
      )}
    </div>
  );
}

function QuestionEditor({
  definitionId,
  question,
  onDone,
}: {
  definitionId: string;
  question: AdminQuestion;
  onDone: () => void;
}) {
  const [update, { isLoading }] = useUpdateAssessmentQuestionMutation();

  const [type, setType] = useState<QuestionType>(question.type);
  const [prompt, setPrompt] = useState(question.prompt);
  const [helpText, setHelpText] = useState(question.helpText ?? "");
  const [difficulty, setDifficulty] = useState(question.difficulty ?? "");
  const [required, setRequired] = useState(question.required);
  const [swotLabel, setSwotLabel] = useState(question.swotLabel ?? "");
  const [points, setPoints] = useState(question.points);
  const [options, setOptions] = useState(
    (question.options ?? []).map((o) => ({ value: o.value, label: o.label }))
  );
  const [correctAnswer, setCorrectAnswer] = useState(
    Array.isArray(question.correctAnswer)
      ? question.correctAnswer.join(", ")
      : question.correctAnswer == null
        ? ""
        : String(question.correctAnswer)
  );

  const save = async () => {
    const trimmed = correctAnswer.trim();
    const answer = !SCORABLE.has(type) || trimmed === ""
      ? null
      : type === "MULTI_CHOICE"
        ? trimmed.split(",").map((s) => s.trim()).filter(Boolean)
        : trimmed;

    try {
      await update({
        definitionId,
        questionId: question.id,
        data: {
          type,
          prompt,
          helpText: helpText || undefined,
          difficulty: difficulty || undefined,
          required,
          points,
          swotLabel: swotLabel || undefined,
          options: CHOICE_TYPES.has(type) ? options : undefined,
          correctAnswer: answer ?? undefined,
        },
      }).unwrap();
      toast.success("Question saved");
      onDone();
    } catch (e) {
      toast.error(
        (e as { data?: { message?: string } })?.data?.message ?? "Save failed"
      );
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-emerald-300 bg-emerald-50/30 p-4 dark:border-emerald-800 dark:bg-emerald-950/20">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Type">
          <select
            className={inputClass}
            value={type}
            onChange={(e) => setType(e.target.value as QuestionType)}
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Difficulty">
          <select
            className={inputClass}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">None</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="EXPERT">Expert</option>
          </select>
        </Field>
      </div>

      <Field label="Prompt">
        <textarea
          rows={2}
          className={inputClass}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </Field>

      <Field label="Help text">
        <input
          className={inputClass}
          value={helpText}
          onChange={(e) => setHelpText(e.target.value)}
        />
      </Field>

      {CHOICE_TYPES.has(type) && (
        <div>
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Options
          </p>
          <div className="space-y-2">
            {options.map((option, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={`${inputClass} max-w-[9rem]`}
                  value={option.value}
                  placeholder="value"
                  onChange={(e) =>
                    setOptions((prev) =>
                      prev.map((o, j) =>
                        j === i ? { ...o, value: e.target.value } : o
                      )
                    )
                  }
                />
                <input
                  className={inputClass}
                  value={option.label}
                  placeholder="label shown to the member"
                  onChange={(e) =>
                    setOptions((prev) =>
                      prev.map((o, j) =>
                        j === i ? { ...o, label: e.target.value } : o
                      )
                    )
                  }
                />
                <IconButton
                  onClick={() =>
                    setOptions((prev) => prev.filter((_, j) => j !== i))
                  }
                  label="Remove option"
                  danger
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </IconButton>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOptions((prev) => [...prev, { value: "", label: "" }])}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted"
          >
            <Plus className="h-3 w-3" />
            Add option
          </button>
        </div>
      )}

      {SCORABLE.has(type) ? (
        <Field label="Correct answer (never sent to members)">
          <input
            className={inputClass}
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder={
              type === "MULTI_CHOICE"
                ? "comma-separated option values"
                : "option value, or accepted text"
            }
          />
        </Field>
      ) : (
        <p className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
          {type} is a self-report type. It carries no correct answer and is never
          scored.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="SWOT label (leave blank to exclude)">
          <input
            className={inputClass}
            value={swotLabel}
            onChange={(e) => setSwotLabel(e.target.value)}
            placeholder="presentation skill"
          />
        </Field>
        <Field label="Points">
          <input
            type="number"
            min={0}
            className={inputClass}
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
          />
        </Field>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          className="h-4 w-4 accent-emerald-600"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
        />
        <span className="text-sm text-foreground">Required</span>
      </label>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={save}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save question
        </button>
        <button
          type="button"
          onClick={onDone}
          className="text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  label,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border transition-colors disabled:opacity-40 ${
        danger
          ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          : "text-muted-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}
