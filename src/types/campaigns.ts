/** Types for the /campaigns API surface. */

export type CampaignStatus = "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";

export type CampaignImage = {
  /** The join row's id — what the remove endpoint takes, not the asset's. */
  id: string;
  caption: string | null;
  order: number;
  image: { id: string; url: string; alt: string | null };
};

export type ApiCampaign = {
  id: string;
  slug: string;
  title: string;
  titleBn: string | null;
  summary: string;
  summaryBn: string | null;
  /** Decimals come back as strings from Prisma to preserve precision. */
  goalAmount: string | null;
  raisedAmount: string;
  currency: string;
  status: CampaignStatus;
  startDate: string | null;
  endDate: string | null;
  order: number;
  /** Homepage carousel playback; Vimeo takes precedence over videoUrl. */
  videoUrl: string | null;
  vimeoVideoId: string | null;
  coverImage: { id: string; url: string; alt: string | null } | null;
  /** Extra shots of the work; the cover above is the single card image. */
  images?: CampaignImage[];
};

export type ApiCampaignDetail = ApiCampaign & {
  description: string;
  descriptionBn: string | null;
};
