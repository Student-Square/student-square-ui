"use client";

import { useState } from "react";
import {
  useCreateSwotMutation,
  useUpdateSwotMutation,
} from "@/redux/features/care/careApi";
import { SWOT_META, SWOT_ORDER } from "@/lib/care";
import type { SwotEntry, SwotKind } from "@/types/care";
import { Loader2, Plus, X } from "lucide-react";

/**
 * FR-05-018 / FR-06-006 — the SWOT quadrants.
 *
 * Rule-derived entries are marked as such and are *candidates*: the counsellor
 * accepts them by leaving them, or archives them. They are never presented as
 * a verdict, here or on the member's screen.
 */
export function SwotPanel({
  memberId,
  entries,
  canEdit,
}: {
  memberId: string;
  entries: SwotEntry[];
  canEdit: boolean;
}) {
  const [adding, setAdding] = useState<SwotKind | null>(null);
  const [text, setText] = useState("");
  const [createSwot, { isLoading: creating }] = useCreateSwotMutation();
  const [updateSwot] = useUpdateSwotMutation();

  const submit = async (kind: SwotKind) => {
    if (text.trim().length < 2) return;
    await createSwot({ memberId, kind, text: text.trim() }).unwrap().catch(() => null);
    setText("");
    setAdding(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {SWOT_ORDER.map((kind) => {
        const meta = SWOT_META[kind];
        const items = entries.filter((e) => e.kind === kind && !e.archivedAt);

        return (
          <div key={kind} className={`rounded-2xl border p-4 ${meta.accent}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                <h3 className="text-sm font-bold">{meta.label}</h3>
                <span className="text-xs text-muted-foreground">({items.length})</span>
              </div>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setAdding(adding === kind ? null : kind);
                    setText("");
                  }}
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                  aria-label={`Add to ${meta.label}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>

            {items.length === 0 && (
              <p className="text-xs text-muted-foreground">Nothing recorded yet.</p>
            )}

            <ul className="space-y-1.5">
              {items.map((entry) => (
                <li
                  key={entry.id}
                  className="group flex items-start gap-2 rounded-lg bg-card/70 px-3 py-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{entry.text}</p>
                    {entry.source === "ASSESSMENT_DERIVED" && (
                      <span className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                        Suggested from assessment
                      </span>
                    )}
                  </div>
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() =>
                        updateSwot({ id: entry.id, memberId, archived: true })
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-rose-600"
                      aria-label="Archive entry"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {adding === kind && (
              <div className="mt-2 flex gap-2">
                <input
                  autoFocus
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void submit(kind);
                    if (e.key === "Escape") setAdding(null);
                  }}
                  placeholder="Add an entry…"
                  className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => void submit(kind)}
                  disabled={creating}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                >
                  {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Add"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
