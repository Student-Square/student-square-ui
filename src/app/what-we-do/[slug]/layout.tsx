import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { serializeJsonLd } from "@/lib/jsonLd";
import { getServiceBySlug } from "@/data/services";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://studentsquare.org";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

// page.tsx is a client component and cannot export metadata itself.
export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return pageMetadata({
    title: `${service.title} in Bangladesh`,
    description: service.description,
    path: `/what-we-do/${service.slug}`,
    image: service.heroImage,
  });
}

export default async function ServiceLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  const jsonLd = service && {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    alternateName: service.titleBn,
    description: service.description,
    url: `${siteUrl}/what-we-do/${service.slug}`,
    image: `${siteUrl}${service.heroImage}`,
    areaServed: { "@type": "Country", name: "Bangladesh" },
    provider: { "@id": `${siteUrl}/#organization` },
  };

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      )}
      {children}
    </>
  );
}
