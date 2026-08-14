import type { Metadata } from "next";
import { serverGet } from "@/lib/serverApi";
import type { ApiEvent } from "@/types/events";
import EventView from "./_components/EventView";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await serverGet<ApiEvent>(`/events/${slug}`);
  if (!event) return {};

  const url = `/blog/events/${slug}`;
  const description = event.description.slice(0, 200);
  const images = event.coverImage ? [{ url: event.coverImage.url, alt: event.coverImage.alt ?? event.title }] : undefined;

  return {
    title: event.title,
    description,
    alternates: { canonical: url },
    openGraph: { title: event.title, description, url, type: "article", images },
    twitter: { card: "summary_large_image", title: event.title, description, images: images?.map((i) => i.url) },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await serverGet<ApiEvent>(`/events/${slug}`);

  const jsonLd = event
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title,
        description: event.description,
        startDate: event.startsAt,
        endDate: event.endsAt ?? undefined,
        eventAttendanceMode:
          event.mode === "ONLINE"
            ? "https://schema.org/OnlineEventAttendanceMode"
            : event.mode === "HYBRID"
              ? "https://schema.org/MixedEventAttendanceMode"
              : "https://schema.org/OfflineEventAttendanceMode",
        location: event.location
          ? { "@type": "Place", name: event.location }
          : event.onlineUrl
            ? { "@type": "VirtualLocation", url: event.onlineUrl }
            : undefined,
        image: event.coverImage?.url,
        organizer: { "@type": "Organization", name: "Student Square" }
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <EventView slug={slug} />
    </>
  );
}
