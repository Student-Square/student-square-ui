import { pageMetadata } from "@/lib/seo";
import PartnerContent from "./_components/PartnerContent";

export const metadata = pageMetadata({
  title: "Partner With Us",
  description:
    "Become a campaign, project, institution or career partner of Student Square and help students across Bangladesh reach counselling, careers and scholarships.",
  path: "/get-involved/partner",
});

export default function PartnerPage() {
  return <PartnerContent />;
}
