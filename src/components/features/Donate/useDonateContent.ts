"use client";

import {
  useGetPageSectionsQuery,
  useGetSiteSettingsQuery,
} from "@/redux/features/content/contentApi";

/**
 * The donate page copy, seeded as the `content` section of the `donate` page
 * from the client's "Donation Button Content" document. Every field is optional
 * so a section can fall back to its bundled default while the request is in
 * flight or if the row has not been seeded yet.
 */
export type DonateContent = {
  hero?: { eyebrow?: string; heading?: string; body?: string };
  joinUs?: { heading?: string; body?: string };
  transparency?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: { icon: string; title: string; body: string }[];
  };
  transformLives?: { heading?: string; body?: string; quote?: string };
  targetedImpact?: {
    heading?: string;
    intro?: string;
    items?: { icon: string; title: string; body: string }[];
  };
  makeAnImpact?: {
    eyebrow?: string;
    heading?: string;
    body?: string;
    amounts?: { amount: number; impact: string }[];
  };
};

export function useDonateContent(): DonateContent {
  const { data } = useGetPageSectionsQuery("donate");
  const section = data?.find((s) => s.sectionKey === "content");
  return (section?.content as DonateContent) ?? {};
}

/** The foundation's published giving details, from site settings. */
export type DonationDetails = {
  bankTransfer?: {
    accountName?: string;
    accountNumber?: string;
    bank?: string;
    swift?: string;
    routingNumber?: string;
  };
  mobileBanking?: {
    providers?: string[];
    number?: string;
    accountType?: string;
  };
  zakat?: { noteBn?: string; noteEn?: string; reference?: string };
};

export function useDonationDetails(): DonationDetails {
  const { data } = useGetSiteSettingsQuery();
  return (data as { donation?: DonationDetails } | undefined)?.donation ?? {};
}
