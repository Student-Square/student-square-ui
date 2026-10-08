import { pageMetadata } from "@/lib/seo";
import AboutContent from "./_components/AboutContent";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Who we are and why we started: a youth-led non-profit in Rajshahi helping students and families in Bangladesh through counselling and advocacy.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutContent />;
}
