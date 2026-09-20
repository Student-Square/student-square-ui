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
  /**
   * The list ships this seven-field summary. The detail endpoint returns the
   * whole questionnaire instead — see `AdminUserDetail`.
   */
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

/**
 * One user, opened from the list.
 *
 * Carries every registration answer, including the C3 columns the list
 * deliberately withholds, plus the guardian details that live on the account
 * rather than the questionnaire (FR-01-013).
 */
export type AdminUserDetail = Omit<AdminUser, "memberProfile"> & {
  fullNameBn?: string | null;
  preferredLocale?: string;
  isMinor?: boolean;
  guardianName?: string | null;
  guardianPhone?: string | null;
  guardianConsentAt?: string | null;
  memberProfile?: AdminMemberProfile | null;
};

export type AdminMemberProfile = {
  phone: string;
  address: string;
  ageBand: string;
  gender: string;
  homeDistrict: string;

  studyLevel: string;
  institutionType: string;
  institutionTypeOther: string | null;
  institutionName: string;
  fieldOfStudy: string;
  subjectDepartment: string;
  subjectFeeling: string;
  subjectFeelingWhy: string | null;
  facedSubjectConfusion: boolean;
  regretsSubject: boolean | null;
  regretsSubjectWhy: string | null;

  occupationStatus: string;
  employmentSector: string | null;
  businessType: string | null;
  jobseekerDuration: string | null;

  disabilityStatus: string;
  disabilityNote: string | null;
  hasInstitutionalRelatives: boolean | null;
  relativeIndustry: string | null;
  familyMonthlyIncomeBand: string | null;
  parentEducationLevel: string | null;

  completedAt: string;
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
