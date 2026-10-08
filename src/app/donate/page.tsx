import DonateExperience from "@/components/features/Donate/DonateExperience";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Donate",
  description:
    "Support student counselling, scholarships and community projects in Bangladesh. Give securely by card or mobile banking and get an instant receipt.",
  path: "/donate",
});

/**
 * /donate starts with no project chosen. The donor picks a project (or the
 * general fund) and only then reaches the payment form for that choice.
 * A direct /donate/[slug] link still opens that project already selected.
 */
export default function DonatePage() {
  return <DonateExperience />;
}
