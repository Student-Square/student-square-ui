import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getPartnerBySlug } from "@/data/partners";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

// page.tsx is a client component and cannot export metadata itself.
export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);
  if (!partner) return {};

  return pageMetadata({
    title: partner.title,
    description: partner.description.slice(0, 160),
    path: `/get-involved/partner/${partner.slug}`,
    image: partner.image,
  });
}

export default function PartnerTypeLayout({ children }: LayoutProps) {
  return children;
}
