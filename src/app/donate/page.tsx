import DonateExperience from "@/components/features/Donate/DonateExperience";

/**
 * /donate starts with no project chosen. The donor picks a project (or the
 * general fund) and only then reaches the payment form for that choice.
 * A direct /donate/[slug] link still opens that project already selected.
 */
export default function DonatePage() {
  return <DonateExperience />;
}
