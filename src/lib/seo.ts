import type { Metadata } from "next";

type PageSeo = {
  /** Page name only — the root layout's template appends " | Student Square". */
  title: string;
  description: string;
  /** Site-relative path; resolved against metadataBase. */
  path: string;
  image?: string | null;
  type?: "website" | "article";
};

/**
 * Title, description, canonical and share cards for one public page.
 *
 * Every indexable page needs its own canonical: www.studentsquare.org and
 * ?query variants otherwise count as separate copies. It must be set per page —
 * a canonical on the root layout is inherited by every page without one and
 * would point them all at the homepage.
 *
 * A child's openGraph replaces the parent's wholesale — including the image
 * from app/opengraph-image — so siteName, locale and a fallback image are
 * repeated here rather than inherited. Without the image, a shared link shows
 * no preview.
 */
export function pageMetadata({ title, description, path, image, type = "website" }: PageSeo): Metadata {
  const images = image ? [{ url: image }] : [{ url: "/opengraph-image", width: 1200, height: 630 }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type,
      siteName: "Student Square",
      locale: "en_US",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((i) => i.url),
    },
  };
}

/** For pages that must work but never appear in results: receipts, search, unsubscribe. */
export const NO_INDEX: Metadata = { robots: { index: false, follow: true } };
