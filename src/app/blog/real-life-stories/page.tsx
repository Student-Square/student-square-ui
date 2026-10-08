import { pageMetadata } from "@/lib/seo";
import RealLifeStoriesContent from "./_components/RealLifeStoriesContent";

export const metadata = pageMetadata({
  title: "Real Life Stories",
  description:
    "First-person stories from students and young people in Bangladesh about adversity, education and the turning points that changed their lives.",
  path: "/blog/real-life-stories",
});

export default function RealLifeStoriesPage() {
  return <RealLifeStoriesContent />;
}
