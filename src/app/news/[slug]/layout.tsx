import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { serverGet } from "@/lib/serverApi";
import type { ApiBlogPost } from "@/types/blogs";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

// A news item is a blog post, so it also lives at /blog/<category>/<id> — the
// URL the sitemap lists. The canonical sends this copy's ranking there instead
// of the two splitting it.
export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await serverGet<ApiBlogPost>(`/blogs/${encodeURIComponent(slug)}`);
  if (!post) return {};

  return pageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.category.slug}/${post.id}`,
    image: post.coverImage?.url,
    type: "article",
  });
}

export default function NewsItemLayout({ children }: LayoutProps) {
  return children;
}
