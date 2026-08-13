import type { UserRole, UserStatus } from "@/types/auth";

export type AdminUser = {
  id: string;
  slug: string | null;
  email: string;
  fullName: string;
  memberId?: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  profile: {
    fullNameBn: string | null;
    avatarUrl: string | null;
    bio: string | null;
    phone?: string | null;
  } | null;
  memberProfile?: {
    homeDistrict: string;
    occupationStatus: string;
    studyLevel: string;
    institutionName: string;
    fieldOfStudy: string;
    disabilityStatus: string;
    completedAt: string;
  } | null;
};

export type AdminCreateUserInput = {
  email: string;
  fullName: string;
  fullNameBn?: string;
  password: string;
  role?: UserRole;
};

export type AdminUpdateUserInput = Partial<
  Pick<AdminUser, "fullName" | "slug" | "role" | "status"> & {
    fullNameBn: string | null;
    bio: string | null;
    avatarUrl: string | null;
  }
>;

export type AdminUserListParams = {
  q?: string;
  role?: UserRole;
  status?: UserStatus;
  verifiedOnly?: boolean;
  foundationOnly?: boolean;
  occupationStatus?: string;
  homeDistrict?: string;
  sortBy?: AdminUserSortKey;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

/** Must match the server's sort allow-list. */
export type AdminUserSortKey =
  | "fullName"
  | "memberId"
  | "role"
  | "status"
  | "createdAt"
  | "lastLoginAt"
  | "homeDistrict"
  | "occupationStatus"
  | "studyLevel";

export type PaginatedUsers = {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
