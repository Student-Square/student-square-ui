import type { Metadata } from "next";
import { serverGet } from "@/lib/serverApi";
import { storiesData } from "@/data/stories";
import type { ApiStory } from "@/types/stories";
import StoryView from "./_components/StoryView";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const url = `/blog/real-life-stories/${id}`;

  if (/^\d+$/.test(id)) {
    const story = storiesData.find((s) => s.id === Number(id));
    if (!story) return {};
    return {
      title: `${story.name} — Real Life Story`,
      description: story.story,
      alternates: { canonical: url },
      openGraph: { title: story.name, description: story.story, url, type: "article", images: [{ url: story.image }] },
      twitter: { card: "summary_large_image", title: story.name, description: story.story, images: [story.image] },
    };
  }

  const story = await serverGet<ApiStory>(`/stories/${id}`);
  if (!story) return {};

  const title = `${story.name} — Real Life Story`;
  const description = story.summary ?? story.quote ?? undefined;
  const images = story.coverImage ? [{ url: story.coverImage.url, alt: story.coverImage.alt ?? story.name }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", publishedTime: story.publishedAt ?? undefined, images },
    twitter: { card: "summary_large_image", title, description, images: images?.map((i) => i.url) },
  };
}

export default async function StoryDetailPage({ params }: PageProps) {
  const { id } = await params;

  let jsonLd: Record<string, unknown> | null = null;
  if (!/^\d+$/.test(id)) {
    const story = await serverGet<ApiStory>(`/stories/${id}`);
    if (story) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: story.name,
        description: story.summary ?? story.quote ?? undefined,
        image: story.coverImage?.url,
        datePublished: story.publishedAt ?? undefined,
        publisher: { "@type": "Organization", name: "Student Square" },
      };
    }
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <StoryView id={id} />
    </>
  );
}
