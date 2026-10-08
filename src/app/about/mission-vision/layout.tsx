import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component and cannot export metadata itself.
export const metadata = pageMetadata({
  title: "Our Vision and Mission",
  description:
    "The vision and mission behind Student Square: the purpose that guides every counselling programme, project and partnership we run for students in Bangladesh.",
  path: "/about/mission-vision",
});

export default function MissionVisionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
