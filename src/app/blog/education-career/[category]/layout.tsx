import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CATEGORY_SEO } from "../_seo";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { category } = await params;
  const seo = CATEGORY_SEO[category];
  if (!seo) return {};
  return pageMetadata({ ...seo, path: `/blog/education-career/${category}` });
}

export default function EducationCareerCategoryLayout({ children }: LayoutProps) {
  return children;
}
