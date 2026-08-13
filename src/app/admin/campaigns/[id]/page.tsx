"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useApproveCampaignMutation,
  useCancelCampaignMutation,
  useGetCampaignQuery,
  useGetCommsVariablesQuery,
  usePreviewAudienceMutation,
  useStartCampaignMutation,
  useSubmitCampaignMutation,
  useTestSendCampaignMutation,
  useUpdateCampaignMutation,
} from "@/redux/features/comms/commsApi";
import { formatDateTime } from "@/lib/care";
import type { UserRole } from "@/types/auth";
import { CHANNEL_STYLE, STATE_STYLE } from "../page";
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  Check,
  Loader2,
  MessageSquare,
  Send,
  Users,
} from "lucide-react";

const SMS_MAX_LENGTH = 918;

const AUDIENCE_ROLES: UserRole[] = [
  "MEMBER",
  "COUNSELLOR",
  "MENTOR",
  "EDITOR",
  "MODERATOR",
  "AUTHOR",
];

/**
 * The campaign composer — FR-18-002…007.
 *
 * The order of controls follows the order of the safeguards: write it, resolve
 * the audience so the count is real, send yourself a test, then submit. Only
 * after submit does the approval question arise, and the screen states the
 * four-eyes rule before the author can be surprised by it.
 */
export default function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const me = useSelector(selectCurrentUser);
  const { data: campaign, isLoading } = useGetCampaignQuery(id);
  const { data: variables } = useGetCommsVariablesQuery();

  const [updateCampaign, { isLoading: saving }] = useUpdateCampaignMutation();
  const [previewAudience, { data: preview, isLoading: resolving }] =
    usePreviewAudienceMutation();
  const [testSend, { isLoading: testing }] = useTestSendCampaignMutation();
  const [submitCampaign, { isLoading: submitting }] = useSubmitCampaignMutation();
  const [approveCampaign, { isLoading: approving }] = useApproveCampaignMutation();
  const [startCampaign, { isLoading: starting }] = useStartCampaignMutation();
  const [cancelCampaign] = useCancelCampaignMutation();

  const [form, setForm] = useState({ name: "", subject: "", bodyHtml: "" });
  const [roles, setRoles] = useState<UserRole[]>(["MEMBER"]);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!campaign) return;
    setForm({
      name: campaign.name,
      subject: campaign.subject,
      bodyHtml: campaign.bodyHtml,
    });
    if (campaign.audience?.roles?.length) setRoles(campaign.audience.roles);
  }, [campaign]);

  if (isLoading || !campaign) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading campaign…
      </div>
    );
  }

  const isDraft = campaign.state === "DRAFT";
  const isAuthor = campaign.createdBy?.id === me?.id;
  const canApprove =
    campaign.state === "PENDING_APPROVAL" &&
    me?.role === "SYSTEM_ADMIN" &&
    !isAuthor;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/campaigns"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Bulk messages
      </Link>

      <header className="flex items-start gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold tracking-tight">{campaign.name}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {campaign.createdBy?.fullName ?? "unknown"} ·{" "}
            {formatDateTime(campaign.createdAt)}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
            CHANNEL_STYLE[campaign.channel]
          }`}
        >
          {campaign.channel === "SMS" && <MessageSquare className="h-3 w-3" />}
          {campaign.channel}
        </span>
        <span
          className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
            STATE_STYLE[campaign.state]
          }`}
        >
          {campaign.state.replace("_", " ")}
        </span>
      </header>

      {/* 1 — content */}
      <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Message
        </h2>

        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          disabled={!isDraft}
          placeholder="Internal name"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500 disabled:opacity-60"
        />
        {campaign.channel === "EMAIL" && (
          <input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            disabled={!isDraft}
            placeholder="Subject line"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500 disabled:opacity-60"
          />
        )}
        <textarea
          value={form.bodyHtml}
          onChange={(e) => setForm({ ...form, bodyHtml: e.target.value })}
          disabled={!isDraft}
          rows={campaign.channel === "SMS" ? 5 : 10}
          maxLength={campaign.channel === "SMS" ? SMS_MAX_LENGTH : undefined}
          placeholder={campaign.channel === "SMS" ? "Plain text message — no HTML" : undefined}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-emerald-500 disabled:opacity-60"
        />
        {campaign.channel === "SMS" && (
          <p
            className={`text-[11px] ${
              form.bodyHtml.length > SMS_MAX_LENGTH ? "text-rose-600" : "text-muted-foreground"
            }`}
          >
            {form.bodyHtml.length} / {SMS_MAX_LENGTH} characters
          </p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {(variables ?? []).map((variable) => (
            <span
              key={variable.name}
              title={variable.description}
              className="rounded-full bg-muted px-2 py-1 text-[11px] font-mono"
            >
              {`{{${variable.name}}}`}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">
          {campaign.channel === "SMS"
            ? "Only these variables can be used. Write plain text — SMS gateways bill per character segment."
            : "Only these variables can be used, and an unsubscribe link is appended to every email automatically."}
        </p>

        {isDraft && (
          <button
            type="button"
            disabled={
              saving ||
              (campaign.channel === "SMS" && form.bodyHtml.length > SMS_MAX_LENGTH)
            }
            onClick={() =>
              updateCampaign({
                id,
                ...form,
                audience: { roles },
              })
            }
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save draft"}
          </button>
        )}
      </section>

      {/* 2 — audience */}
      <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Users className="h-3.5 w-3.5" /> Audience
        </h2>

        <div className="flex flex-wrap gap-1.5">
          {AUDIENCE_ROLES.map((role) => {
            const on = roles.includes(role);
            return (
              <button
                key={role}
                type="button"
                disabled={!isDraft}
                onClick={() =>
                  setRoles(
                    on ? roles.filter((r) => r !== role) : [...roles, role]
                  )
                }
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
                  on
                    ? "bg-emerald-600 text-white"
                    : "border border-border text-muted-foreground"
                }`}
              >
                {role.replace("_", " ").toLowerCase()}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={resolving || roles.length === 0}
          onClick={() => previewAudience({ roles, channel: campaign.channel })}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:border-emerald-500/50 disabled:opacity-60"
        >
          {resolving ? "Counting…" : "Count recipients"}
        </button>

        {preview && (
          <div
            className={`rounded-xl border p-3 ${
              preview.needsApproval
                ? "border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20"
                : "border-border bg-muted/40"
            }`}
          >
            <p className="text-sm font-semibold">
              {preview.count} recipient{preview.count === 1 ? "" : "s"}
              {campaign.channel === "SMS" ? " with a phone number on file" : ""}
            </p>
            {preview.needsApproval && (
              <p className="mt-1 flex items-start gap-1.5 text-xs">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                Over {preview.threshold}. A System Admin other than you must
                approve this before it can be sent.
              </p>
            )}
            {preview.sample.length > 0 && (
              <p className="mt-1 text-[11px] text-muted-foreground truncate">
                e.g. {preview.sample.join(", ")}
              </p>
            )}
            <p className="mt-1 text-[11px] text-muted-foreground">
              {campaign.channel === "SMS"
                ? "Members without a phone number on file are already excluded from this count."
                : "Unsubscribed addresses are already excluded from this count."}
            </p>
          </div>
        )}
      </section>

      {/* 3 — test, submit, send */}
      <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Send
        </h2>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={testing}
            onClick={() => testSend(id)}
            className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:border-emerald-500/50 disabled:opacity-60"
          >
            {testing ? "Sending…" : "Send me a test"}
          </button>

          {isDraft && (
            <button
              type="button"
              disabled={submitting}
              onClick={() => submitCampaign(id)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Submit"
              )}
            </button>
          )}

          {campaign.state === "APPROVED" && (
            <>
              <label className="inline-flex items-center gap-1.5 text-xs">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="rounded"
                />
                I have checked this will reach {campaign.recipientCount} people
              </label>
              <button
                type="button"
                disabled={starting || !confirmed}
                onClick={() => startCampaign(id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
                Start sending
              </button>
            </>
          )}

          {["PENDING_APPROVAL", "APPROVED", "SENDING"].includes(
            campaign.state
          ) && (
            <button
              type="button"
              onClick={() => cancelCampaign(id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-rose-600 hover:border-rose-300"
            >
              <Ban className="h-4 w-4" /> Cancel
            </button>
          )}
        </div>

        {campaign.state === "PENDING_APPROVAL" && (
          <div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 p-3">
            <p className="text-sm font-semibold">
              Waiting for approval — {campaign.recipientCount} recipients
            </p>
            {canApprove ? (
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={approving}
                  onClick={() => approveCampaign({ id, approved: true })}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                >
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
                <button
                  type="button"
                  disabled={approving}
                  onClick={() =>
                    approveCampaign({
                      id,
                      approved: false,
                      reason: "Rejected from the approval queue",
                    })
                  }
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:border-rose-300 hover:text-rose-600"
                >
                  Reject
                </button>
              </div>
            ) : (
              <p className="mt-1 text-xs">
                {isAuthor
                  ? "You created this campaign, so another System Admin has to approve it."
                  : "A System Admin must approve this."}
              </p>
            )}
          </div>
        )}

        {campaign.state === "REJECTED" && campaign.rejectReason && (
          <p className="text-sm text-rose-600">
            Rejected: {campaign.rejectReason}
          </p>
        )}

        {campaign.progress && Object.keys(campaign.progress).length > 0 && (
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {Object.entries(campaign.progress).map(([state, count]) => (
              <span key={state}>
                {state.toLowerCase()}: <strong>{count}</strong>
              </span>
            ))}
          </div>
        )}

        {campaign.approvedBy && (
          <p className="text-[11px] text-muted-foreground">
            {campaign.state === "REJECTED" ? "Rejected" : "Approved"} by{" "}
            {campaign.approvedBy.fullName}
            {campaign.approvedAt ? ` · ${formatDateTime(campaign.approvedAt)}` : ""}
          </p>
        )}
      </section>
    </div>
  );
}
