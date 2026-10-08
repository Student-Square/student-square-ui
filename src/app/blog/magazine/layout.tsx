import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component and cannot export metadata itself.
export const metadata = pageMetadata({
  title: "Magazine",
  description:
    "The Student Square magazine: in-depth features, long-form stories and perspectives on education, career and community across Bangladesh.",
  path: "/blog/magazine",
});

export default function MagazineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
