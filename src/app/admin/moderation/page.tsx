"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  useModerationQueueQuery,
  useAdminApproveCommentMutation,
  useAdminRejectCommentMutation,
  useAdminMarkSpamCommentMutation,
} from "@/redux/features/moderation/moderationApi";
import { useAdminApproveStoryMutation } from "@/redux/features/stories/adminStoriesApi";
import {
  CheckCircle,
  Loader2,
  MessageSquareText,
  Pencil,
  ShieldAlert,
  XCircle,
} from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function ModerationQueuePage() {
  const { data, isLoading, isError } = useModerationQueueQuery({ type: "all", limit: 20 });
  const [approveStory, { isLoading: approvingStory }] = useAdminApproveStoryMutation();
  const [approveComment] = useAdminApproveCommentMutation();
  const [rejectComment] = useAdminRejectCommentMutation();
  const [markSpam] = useAdminMarkSpamCommentMutation();
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleApproveStory = async (id: string) => {
    setBusyId(id);
    try {
      await approveStory({ id, publishNow: true }).unwrap();
      toast.success("Story approved and published");
    } catch { /* baseApi toasts */ }
    setBusyId(null);
  };

  const handleApproveComment = async (id: string) => {
    setBusyId(id);
    try {
      await approveComment(id).unwrap();
      toast.success("Comment approved");
    } catch { /* baseApi toasts */ }
    setBusyId(null);
  };

  const handleRejectComment = async (id: string) => {
    if (!confirm("Reject this comment?")) return;
    setBusyId(id);
    try {
      await rejectComment({ id }).unwrap();
      toast.success("Comment rejected");
    } catch { /* baseApi toasts */ }
    setBusyId(null);
  };

  const handleMarkSpam = async (id: string) => {
    setBusyId(id);
    try {
      await markSpam(id).unwrap();
      toast.success("Comment marked as spam");
    } catch { /* baseApi toasts */ }
    setBusyId(null);
  };

  const stories = data?.stories ?? [];
  const comments = data?.comments ?? [];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Moderation Queue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-life stories and comments waiting for review.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-10">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading queue…
        </div>
      )}
      {isError && <p className="text-sm text-red-600 py-6">Failed to load the moderation queue.</p>}

      {data && (
        <div className="space-y-8">
          {/* Pending stories */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Pending stories ({stories.length})
            </h2>
            {stories.length === 0 ? (
              <p className="text-sm text-muted-foreground rounded-xl border border-dashed border-border p-6">
                No stories waiting for review.
              </p>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
                {stories.map((story) => (
                  <div key={story.id} className="p-4 flex items-start justify-between gap-4 hover:bg-muted/20 transition-colors">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{story.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {story.department ?? "—"} · submitted by {story.submitter?.fullName ?? "unknown"} · {formatDate(story.createdAt)}
                      </p>
                      {story.summary && (
                        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{story.summary}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleApproveStory(story.id)}
                        disabled={approvingStory && busyId === story.id}
                        title="Approve & publish"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-muted-foreground hover:text-emerald-600 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <Link
                        href={`/admin/blog/real-life-stories/${story.id}/edit`}
                        title="Review"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted text-muted-foreground hover:text-emerald-600 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Pending comments */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Pending comments ({comments.length})
            </h2>
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground rounded-xl border border-dashed border-border p-6">
                No comments waiting for review.
              </p>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 flex items-start justify-between gap-4 hover:bg-muted/20 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <MessageSquareText className="h-3.5 w-3.5" />
                        <span className="font-semibold text-foreground">{comment.author.fullName}</span>
                        <span>·</span>
                        <span>{formatDate(comment.createdAt)}</span>
                        <span>·</span>
                        <span className="truncate">
                          on {comment.blogPost ? comment.blogPost.title : comment.story?.name ?? "unknown"}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{comment.body}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleApproveComment(comment.id)}
                        disabled={busyId === comment.id}
                        title="Approve"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-muted-foreground hover:text-emerald-600 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectComment(comment.id)}
                        disabled={busyId === comment.id}
                        title="Reject"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMarkSpam(comment.id)}
                        disabled={busyId === comment.id}
                        title="Mark as spam"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/30 text-muted-foreground hover:text-amber-600 transition-colors disabled:opacity-50"
                      >
                        <ShieldAlert className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
