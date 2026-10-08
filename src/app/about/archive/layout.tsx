import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component and cannot export metadata itself.
export const metadata = pageMetadata({
  title: "Archive",
  description:
    "Past Student Square initiatives, programmes and records from our work with students and communities in Bangladesh.",
  path: "/about/archive",
});

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
  return children;
}
