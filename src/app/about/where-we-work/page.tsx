import { pageMetadata } from "@/lib/seo";
import WhereWeWorkContent from "./_components/WhereWeWorkContent";

export const metadata = pageMetadata({
  title: "Where We Work",
  description:
    "Student Square runs counselling and community programmes in Rajshahi, Joypurhat, Chapainawabganj, Kushtia, Khulna, Chittagong, Feni and Hampshire, UK.",
  path: "/about/where-we-work",
});

export default function WhereWeWorkPage() {
  return <WhereWeWorkContent />;
}
