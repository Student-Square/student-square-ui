import { pageMetadata } from "@/lib/seo";
import BlogContent from "./_components/BlogContent";

export const metadata = pageMetadata({
  title: "Blog: Career, Higher Study & Student Life",
  description:
    "Articles on career planning, higher study, scholarships, mental health and parenting, plus real-life stories from students in Bangladesh.",
  path: "/blog",
});

export default function BlogPage() {
  return <BlogContent />;
}
