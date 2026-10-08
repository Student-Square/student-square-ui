import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getCityBySlug } from "@/data/locations";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ country: string; city: string }>;
};

// page.tsx is a client component and cannot export metadata itself. Every city
// shares one placeholder bio, so the description is built from the names
// rather than copied — and the cities stay out of the sitemap until each has
// its own text.
export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { country, city } = await params;
  const found = getCityBySlug(country, city);
  if (!found) return {};

  return pageMetadata({
    title: `Student Square in ${found.city.name}, ${found.country.name}`,
    description: `Student counselling, parent advocacy and community programmes run by Student Square volunteers in ${found.city.name}, ${found.country.name}.`,
    path: `/about/where-we-work/${found.country.slug}/${found.city.slug}`,
    image: found.city.image,
  });
}

export default function CityLayout({ children }: LayoutProps) {
  return children;
}
