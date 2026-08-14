/** Types for the /magazines API surface. */

export type ApiMagazineListItem = {
  id: string;
  title: string;
  titleBn: string | null;
  description: string | null;
  descriptionBn: string | null;
  issueNumber: number | null;
  publishedAt: string | null;
  downloadCount: number;
  coverImage: { id: string; url: string; alt: string | null } | null;
};

export type ApiAdminMagazine = ApiMagazineListItem & {
  fileSizeBytes: number | null;
  published: boolean;
  createdAt: string;
  createdBy: { id: string; fullName: string } | null;
};

export type MagazineDownloadLink = {
  url: string;
  fileName: string;
  expiresInSeconds: number;
};

export type AdminMagazineWriteInput = {
  title: string;
  titleBn?: string;
  description?: string;
  descriptionBn?: string;
  issueNumber?: number;
  coverImageId?: string;
  published?: boolean;
  file?: File;
};
