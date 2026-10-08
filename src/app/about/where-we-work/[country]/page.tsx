import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getCountryBySlug } from "@/data/locations";
import CountryContent from "./_components/CountryContent";

type PageProps = { params: Promise<{ country: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) return {};

  return pageMetadata({
    title: `Where We Work in ${country.name}`,
    description: country.description.slice(0, 160),
    path: `/about/where-we-work/${country.slug}`,
  });
}

export default function CountryPage() {
  return <CountryContent />;
}
