import { pageMetadata } from "@/lib/seo";
import NewsContent from "./_components/NewsContent";

export const metadata = pageMetadata({
  title: "News",
  description:
    "The latest from Student Square: counselling workshops, partnerships, competitions and community events across Bangladesh.",
  path: "/news",
});

export default function NewsPage() {
  return <NewsContent />;
}
