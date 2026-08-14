import type { Metadata } from "next";
import { serverGet } from "@/lib/serverApi";
import type { ApiBlogPost } from "@/types/blogs";
import ArticleView from "./_components/ArticleView";

type PageProps = {
  params: Promise<{ category: string; id: string }>;
};

async function fetchPost(id: string): Promise<ApiBlogPost | null> {
  return serverGet<ApiBlogPost>(`/blogs/id/${id}`);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, id } = await params;
  const post = await fetchPost(id);
  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const url = `/blog/${category}/${id}`;
  const images = post.coverImage ? [{ url: post.coverImage.url, alt: post.coverImage.alt ?? post.title }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      authors: post.displayAuthorName ?? post.author?.fullName ?? undefined,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images?.map((i) => i.url),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await fetchPost(id);

  const jsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage?.url,
        datePublished: post.publishedAt ?? undefined,
        dateModified: post.publishedAt ?? undefined,
        author: {
          "@type": "Person",
          name: post.displayAuthorName ?? post.author?.fullName ?? "Student Square",
        },
        publisher: { "@type": "Organization", name: "Student Square" },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ArticleView id={id} />
    </>
  );
}
