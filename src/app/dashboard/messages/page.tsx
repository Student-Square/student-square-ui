"use client";

import { useEffect, useState } from "react";
import { ThreadList } from "@/components/messaging/ThreadList";
import {
  useGetPersonalNoteQuery,
  useSavePersonalNoteMutation,
} from "@/redux/features/comms/commsApi";
import { Loader2, NotebookPen, Save } from "lucide-react";

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
        </>
      )}
    </section>
  );
}
