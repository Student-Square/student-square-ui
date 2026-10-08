import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { serverGet } from "@/lib/serverApi";
import type { ApiCampaignDetail } from "@/types/campaigns";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

// page.tsx is a client component and cannot export metadata itself.
export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await serverGet<ApiCampaignDetail>(`/campaigns/${encodeURIComponent(slug)}`);
  if (!project) return {};

  return pageMetadata({
    title: project.title,
    description: project.summary.slice(0, 160),
    path: `/projects/${project.slug}`,
    image: project.coverImage?.url,
  });
}

export default function ProjectLayout({ children }: LayoutProps) {
  return children;
}
