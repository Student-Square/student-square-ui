import { redirect } from "next/navigation";
import { serverGet } from "@/lib/serverApi";
import type { ApiCampaign } from "@/types/campaigns";

/**
 * /donate has no page of its own. It opens the donate page of the first active
 * project, whose project list lets the donor switch; with no active project,
 * or the API unreachable, it opens the general fund, which needs none.
 *
 * Read fresh every time: a cached list could keep sending donors to a project
 * that has just closed.
 */
export default async function DonatePage() {
  const campaigns = await serverGet<ApiCampaign[]>("/campaigns?status=ACTIVE", { revalidate: 0 });
  const first = [...(campaigns ?? [])].sort((a, b) => a.order - b.order)[0];
  redirect(first ? `/donate/${first.slug}` : "/donate/general");
}
