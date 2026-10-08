import { pageMetadata } from "@/lib/seo";
import EventsContent from "./_components/EventsContent";

export const metadata = pageMetadata({
  title: "Events",
  description:
    "Upcoming and past Student Square events: counselling workshops, competitions, olympiads and community programmes for students in Bangladesh.",
  path: "/blog/events",
});

export default function EventsPage() {
  return <EventsContent />;
}
