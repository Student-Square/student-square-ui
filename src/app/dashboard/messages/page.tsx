"use client";

import { useEffect, useState } from "react";
import { ThreadList } from "@/components/messaging/ThreadList";
import {
  useDeletePersonalNoteVersionMutation,
  useGetPersonalNoteQuery,
  useSavePersonalNoteMutation,
} from "@/redux/features/comms/commsApi";
import type { PersonalNoteVersion } from "@/types/comms";
import {
  ChevronDown,
  History,
  Loader2,
  NotebookPen,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";

export default function MemberMessagesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Talk to your counsellor and mentor.
        </p>
      </div>

      <ThreadList basePath="/dashboard/messages" />

      <PersonalNotes />
    </div>
  );
}

/**
 * FR-11-007 — the member's own notebook.
 *
 * It sits under Messages because that is where a member is when they want to
 * jot something down, but it is nobody else's: staff have no read path to it,
 * and the copy says so, because a private space nobody believes is private
 * does not get used.
 */
function PersonalNotes() {
  const { data, isLoading } = useGetPersonalNoteQuery();
  const [saveNote, { isLoading: saving }] = useSavePersonalNoteMutation();
  const [body, setBody] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (data && !dirty) setBody(data.body);
  }, [data, dirty]);

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <NotebookPen className="h-4 w-4 text-violet-600" />
        <h2 className="text-sm font-bold">My private notes</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Only you can read this. It is encrypted, and no counsellor, mentor or
        administrator has access to it.
      </p>

      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <>
          <textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              setDirty(true);
            }}
            rows={8}
            placeholder="Anything you want to remember — questions for your next session, how the week went…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-violet-500 resize-y"
          />
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              disabled={saving || !dirty}
              onClick={() =>
                saveNote(body)
                  .unwrap()
                  .then(() => setDirty(false))
                  .catch(() => null)
              }
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save notes
            </button>
            {data?.updatedAt && !dirty && (
              <span className="text-[11px] text-muted-foreground">
                Saved {new Date(data.updatedAt).toLocaleString()}
              </span>
            )}
          </div>

          <NoteHistory
            history={data?.history ?? []}
            hasUnsaved={dirty}
            onRestore={(text) => {
              setBody(text);
              setDirty(true);
            }}
          />
        </>
      )}
    </section>
  );
}

/**
 * Earlier versions of the note. Restoring only fills the editor — nothing is
 * lost until the member presses Save, and that save snapshots the current text
 * into this list in turn.
 */
function NoteHistory({
  history,
  hasUnsaved,
  onRestore,
}: {
  history: PersonalNoteVersion[];
  hasUnsaved: boolean;
  onRestore: (body: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-5 border-t border-border pt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 text-left"
      >
        <History className="h-4 w-4 text-violet-600" />
        <span className="text-sm font-bold">Previously saved</span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
          {history.length}
        </span>
        <ChevronDown
          className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        (history.length === 0 ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Each time you save, the version you replaced is kept here — up to
            your last 30.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {history.map((v) => (
              <NoteVersion
                key={v.id}
                version={v}
                hasUnsaved={hasUnsaved}
                onRestore={onRestore}
              />
            ))}
          </ul>
        ))}
    </div>
  );
}

function NoteVersion({
  version,
  hasUnsaved,
  onRestore,
}: {
  version: PersonalNoteVersion;
  hasUnsaved: boolean;
  onRestore: (body: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  // Destructive clicks take a second, explicit confirmation.
  const [confirming, setConfirming] = useState<"restore" | "delete" | null>(null);
  const [deleteVersion, { isLoading: deleting }] =
    useDeletePersonalNoteVersionMutation();

  const preview = version.body.trim().split("\n")[0];

  const restore = () => {
    if (hasUnsaved && confirming !== "restore") return setConfirming("restore");
    setConfirming(null);
    onRestore(version.body);
  };

  const remove = () => {
    if (confirming !== "delete") return setConfirming("delete");
    deleteVersion(version.id)
      .unwrap()
      .catch(() => setConfirming(null));
  };

  return (
    <li className="rounded-lg border border-border bg-background">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-3 px-3 py-2 text-left"
      >
        <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">
          {new Date(version.savedAt).toLocaleString()}
        </span>
        {!expanded && (
          <span className="min-w-0 truncate text-xs text-foreground/80">{preview}</span>
        )}
        <ChevronDown
          className={`ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-border px-3 py-3">
          <p className="max-h-64 overflow-y-auto whitespace-pre-wrap break-words text-sm text-foreground">
            {version.body}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={restore}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:border-violet-500 hover:text-violet-600"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {confirming === "restore" ? "Replace unsaved text?" : "Restore to editor"}
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-red-500 hover:text-red-600 disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              {confirming === "delete" ? "Delete for good?" : "Delete"}
            </button>
            {confirming && (
              <button
                type="button"
                onClick={() => setConfirming(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </li>
  );
}
