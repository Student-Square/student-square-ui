/** Types for the /events API surface. */

export type EventMode = "IN_PERSON" | "ONLINE" | "HYBRID";

export type ApiEvent = {
  id: string;
  slug: string;
  title: string;
  titleBn: string | null;
  description: string;
  descriptionBn: string | null;
  location: string | null;
  onlineUrl: string | null;
  mode: EventMode;
  startsAt: string;
  endsAt: string | null;
  registrationUrl: string | null;
  coverImage: { id: string; url: string; alt: string | null } | null;
};

export type ApiAdminEvent = ApiEvent & {
  published: boolean;
  createdAt: string;
  createdBy: { id: string; fullName: string } | null;
};

export type AdminEventWriteInput = {
  title: string;
  titleBn?: string;
  description: string;
  descriptionBn?: string;
  location?: string;
  onlineUrl?: string;
  mode?: EventMode;
  startsAt: string;
  endsAt?: string;
  registrationUrl?: string;
  coverImageId?: string;
  published?: boolean;
  slug?: string;
};
