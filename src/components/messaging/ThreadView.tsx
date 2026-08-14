"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  useGetAttachmentUrlMutation,
  useGetThreadQuery,
  useSendMessageMutation,
  useSetThreadClosedMutation,
} from "@/redux/features/comms/commsApi";
import { formatDateTime } from "@/lib/care";
import {
  ArrowLeft,
  Eye,
  Loader2,
  Lock,
  Paperclip,
  Send,
  ShieldAlert,
  X,
} from "lucide-react";

/**
 * One conversation, shared by both sides.
 *
 * Three things this screen has to be honest about, all of them requirements
 * rather than polish:
 *
 *   FR-11-004  the member is told, on this screen, that a Super Admin can read
 *              the thread for safeguarding
 *   FR-11-005  a staff internal note is visibly marked as not shared
 *   oversight   a Super Admin reading someone else's thread is told it is
 *              read-only, rather than discovering it at send time
 */
export function ThreadView({
  threadId,
  backHref,
}: {
  threadId: string;
  backHref: string;
}) {
  const { data: thread, isLoading } = useGetThreadQuery(threadId);
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const [setClosed] = useSetThreadClosedMutation();
  const [getAttachmentUrl] = useGetAttachmentUrlMutation();

  const [body, setBody] = useState("");
  const [internal, setInternal] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages.length]);

  if (isLoading || !thread) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading conversation…
      </div>
    );
  }

  const counterpart = thread.viewerIsMember ? thread.staff : thread.member;
  const canSend = !thread.oversight && !thread.closedAt;

  const submit = async () => {
    if (!body.trim() && files.length === 0) return;
    await sendMessage({
      threadId,
      body: body.trim() || "(attachment)",
      internal,
      files,
    })
      .unwrap()
      .catch(() => null);
    setBody("");
    setFiles([]);
    setInternal(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openAttachment = async (id: string) => {
    const result = await getAttachmentUrl(id).unwrap().catch(() => null);
    if (result?.url) window.open(result.url, "_blank", "noreferrer");
  };

  return (
    <div className="space-y-4">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Messages
      </Link>

      <header className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted overflow-hidden shrink-0 ring-2 ring-border">
          {counterpart.profile?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={counterpart.profile.avatarUrl}
              alt={counterpart.fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="h-full w-full flex items-center justify-center text-sm font-bold text-muted-foreground">
              {counterpart.fullName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold truncate">{counterpart.fullName}</h1>
          <p className="text-xs text-muted-foreground capitalize">
            {counterpart.role.toLowerCase()}
          </p>
        </div>
        {!thread.viewerIsMember && !thread.oversight && (
          <button
            type="button"
            onClick={() => setClosed({ id: threadId, closed: !thread.closedAt })}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:border-emerald-500/50 transition-colors"
          >
            {thread.closedAt ? "Reopen" : "Close"}
          </button>
        )}
      </header>

      {thread.oversight && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 p-3">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs">
            You are reading this conversation under Super Admin oversight. This
            view is read-only and the access has been recorded in the audit log.
          </p>
        </div>
      )}

      {thread.viewerIsMember && (
        <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-3">
          <Eye className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Messages here are private between you and your {counterpart.role.toLowerCase()},
            and are encrypted when stored. A Super Admin can read them if there
            is a safeguarding concern — see the{" "}
            <Link href="/privacy" className="underline" target="_blank">
              Privacy Notice
            </Link>
            .
          </p>
        </div>
      )}

      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        {thread.messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No messages yet. Say hello.
          </p>
        )}

        {thread.messages.map((message) => {
          const mine = thread.viewerIsMember
            ? message.senderId === thread.member.id
            : message.senderId === thread.staff.id;

          return (
            <div
              key={message.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  message.internal
                    ? "border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20"
                    : mine
                      ? "bg-emerald-600 text-white"
                      : "border border-border bg-card"
                }`}
              >
                {message.internal && (
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400 mb-1">
                    <Lock className="h-2.5 w-2.5" /> Internal note — not shared with
                    the student
                  </p>
                )}
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.body}
                </p>

                {message.attachments?.map((attachment) => (
                  <button
                    key={attachment.id}
                    type="button"
                    onClick={() => void openAttachment(attachment.id)}
                    className={`mt-2 flex items-center gap-1.5 text-xs underline ${
                      mine && !message.internal ? "text-white/90" : "text-emerald-600"
                    }`}
                  >
                    <Paperclip className="h-3 w-3" />
                    {attachment.fileName}
                  </button>
                ))}

                <p
                  className={`mt-1 text-[10px] ${
                    mine && !message.internal
                      ? "text-white/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {message.sender?.fullName ?? ""} · {formatDateTime(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {canSend ? (
        <div className="rounded-2xl border border-border bg-card p-3 space-y-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder={internal ? "Write an internal note…" : "Write a message…"}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none ${
              internal
                ? "border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 focus:border-amber-500"
                : "border-border bg-background focus:border-emerald-500"
            }`}
          />

          {files.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[11px]"
                >
                  <Paperclip className="h-3 w-3" />
                  {file.name}
                  <button
                    type="button"
                    onClick={() => setFiles(files.filter((_, i) => i !== index))}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,image/jpeg,image/png,image/webp"
              onChange={(e) =>
                setFiles(Array.from(e.target.files ?? []).slice(0, 3))
              }
              className="hidden"
              id="message-files"
            />
            <label
              htmlFor="message-files"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold cursor-pointer hover:border-emerald-500/50"
            >
              <Paperclip className="h-3.5 w-3.5" /> Attach
            </label>

            {!thread.viewerIsMember && (
              <label className="inline-flex items-center gap-1.5 text-xs">
                <input
                  type="checkbox"
                  checked={internal}
                  onChange={(e) => setInternal(e.target.checked)}
                  className="rounded"
                />
                Internal note
              </label>
            )}

            <button
              type="button"
              onClick={() => void submit()}
              disabled={sending}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send
            </button>
          </div>
        </div>
      ) : (
        !thread.oversight && (
          <p className="text-sm text-muted-foreground">
            This conversation is closed.
          </p>
        )
      )}
    </div>
  );
}
