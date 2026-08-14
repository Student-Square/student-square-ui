"use client";

import type { AnswerValue, AssessmentQuestion } from "@/types/assessments";

/**
 * Renders one question by type — FR-05-009.
 *
 * Every control is a real form input with a real label, so keyboard and screen
 * reader users get the same affordances as everyone else. Radio groups share a
 * `name` per question, which is what makes arrow-key navigation work.
 */
export function QuestionField({
  question,
  index,
  value,
  onChange,
}: {
  question: AssessmentQuestion;
  index: number;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
}) {
  const options = question.options ?? [];
  const name = `q-${question.id}`;

  return (
    <fieldset className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <legend className="sr-only">{question.prompt}</legend>

      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground leading-relaxed">
            {question.prompt}
            {!question.required && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                (optional)
              </span>
            )}
          </p>
          {question.helpText && (
            <p className="mt-1 text-xs text-muted-foreground">{question.helpText}</p>
          )}

          <div className="mt-3">
            {(question.type === "SINGLE_CHOICE" ||
              question.type === "TRUE_FALSE" ||
              question.type === "CORRECT_INCORRECT") && (
              <div className="space-y-2">
                {options.map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                      value === option.value
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name={name}
                      className="accent-emerald-600"
                      checked={value === option.value}
                      onChange={() => onChange(option.value)}
                    />
                    <span className="text-sm text-foreground">{option.label}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === "MULTI_CHOICE" && (
              <div className="space-y-2">
                <p className="mb-1 text-xs text-muted-foreground">
                  Select all that apply.
                </p>
                {options.map((option) => {
                  const selected = Array.isArray(value) && value.includes(option.value);
                  return (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                        selected
                          ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="accent-emerald-600"
                        checked={selected}
                        onChange={() => {
                          const current = Array.isArray(value) ? value : [];
                          onChange(
                            selected
                              ? current.filter((v) => v !== option.value)
                              : [...current, option.value]
                          );
                        }}
                      />
                      <span className="text-sm text-foreground">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {question.type === "SCALE" && (
              <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      String(value) === option.value
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name={name}
                      className="accent-emerald-600"
                      checked={String(value) === option.value}
                      onChange={() => onChange(option.value)}
                    />
                    <span className="text-foreground">{option.label}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === "FILL_BLANK" && (
              <input
                type="text"
                value={typeof value === "string" ? value : ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Type your answer"
              />
            )}

            {question.type === "TEXT" && (
              <textarea
                rows={3}
                value={typeof value === "string" ? value : ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="You can leave this blank."
              />
            )}
          </div>
        </div>
      </div>
    </fieldset>
  );
}
