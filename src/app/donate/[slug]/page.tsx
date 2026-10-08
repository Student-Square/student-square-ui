import type { Metadata } from "next";
import DonateExperience from "@/components/features/Donate/DonateExperience";
import { pageMetadata } from "@/lib/seo";
import { serverGet } from "@/lib/serverApi";
import type { ApiCampaign } from "@/types/campaigns";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await serverGet<ApiCampaign>(`/campaigns/${encodeURIComponent(slug)}`);
  if (!project) return {};

  return pageMetadata({
    title: `Donate to ${project.title}`,
    description: project.summary.slice(0, 160),
    path: `/donate/${project.slug}`,
    image: project.coverImage?.url,
  });
}

export default async function DonateProjectPage({ params }: PageProps) {
  const { slug } = await params;
  return <DonateExperience slug={slug} />;
}
