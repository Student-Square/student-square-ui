"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useCreateCampaignMutation,
  useGetCampaignsQuery,
} from "@/redux/features/comms/commsApi";
import { formatDateTime } from "@/lib/care";
import type { CampaignChannel, CampaignState } from "@/types/comms";
import { ChevronRight, Loader2, Megaphone, MessageSquare, Plus } from "lucide-react";

export const CHANNEL_STYLE: Record<CampaignChannel, string> = {
  EMAIL: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  SMS: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

export const STATE_STYLE: Record<CampaignState, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PENDING_APPROVAL:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  APPROVED: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  SENDING: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  SENT: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  CANCELLED: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200",
  REJECTED: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export default function AdminCampaignsPage() {
  const { data: campaigns, isLoading } = useGetCampaignsQuery();
  const [createCampaign, { isLoading: creating }] = useCreateCampaignMutation();
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<CampaignChannel>("EMAIL");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bulk messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Announcements and newsletters. Anything over 500 recipients needs a
          second System Admin to approve it.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="inline-flex rounded-lg border border-border overflow-hidden shrink-0">
          {(["EMAIL", "SMS"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChannel(c)}
              className={`px-3 py-2 text-sm font-semibold transition-colors ${
                channel === c
                  ? "bg-emerald-600 text-white"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {c === "EMAIL" ? "Email" : "SMS"}
            </button>
          ))}
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New campaign name"
          className="flex-1 min-w-[200px] rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-emerald-500"
        />
        <button
          type="button"
          disabled={creating || name.trim().length < 2}
          onClick={() =>
            createCampaign({
              name: name.trim(),
              subject: channel === "SMS" ? "SMS campaign" : "Subject line",
              bodyHtml:
                channel === "SMS"
                  ? "Hi {{firstName}}, "
                  : "<p>Hi {{firstName}},</p>",
              channel,
            })
              .unwrap()
              .then(() => setName(""))
              .catch(() => null)
          }
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {creating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Create draft
        </button>
      </div>

      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : !campaigns?.length ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <Megaphone className="h-8 w-8 mx-auto text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">
            No campaigns yet.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {campaigns.map((campaign) => (
            <li key={campaign.id}>
              <Link
                href={`/admin/campaigns/${campaign.id}`}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold truncate">
                      {campaign.name}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                        CHANNEL_STYLE[campaign.channel]
                      }`}
                    >
                      {campaign.channel === "SMS" && <MessageSquare className="h-2.5 w-2.5" />}
                      {campaign.channel}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                        STATE_STYLE[campaign.state]
                      }`}
                    >
                      {campaign.state.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {campaign.recipientCount || 0} recipients ·{" "}
                    {campaign.createdBy?.fullName ?? "unknown"} ·{" "}
                    {formatDateTime(campaign.createdAt)}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
