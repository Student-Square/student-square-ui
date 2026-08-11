/** Types for the /auth API surface. */

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "COUNSELLOR"
  | "MENTOR"
  | "MODERATOR"
  | "EDITOR"
  | "AUTHOR"
  | "FINANCE_MANAGER"
  | "HR_MANAGER"
  | "MEMBER";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";

export type ApiMe = {
  id: string;
  email: string;
  fullName: string;
  slug: string | null;
  memberId?: string | null;
  role: UserRole;
  status: UserStatus;
  /** Whether this account has confirmed TOTP MFA. */
  mfaEnabled?: boolean;
  /** Whether this role must use MFA under current policy. */
  mfaRequired?: boolean;
  /** Platform-wide enforcement switch (false = MFA optional for everyone). */
  mfaEnforced?: boolean;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  profile: {
    id: string;
    avatarUrl: string | null;
    bio: string | null;
    bioBn: string | null;
    phone: string | null;
    country: string | null;
    city: string | null;
    currentAddress: string | null;
    university: string | null;
    department: string | null;
    profession: string | null;
    workplace: string | null;
    preferredAnonymous: boolean;
  } | null;
  memberProfile?: {
    id: string;
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
    occupationStatus: string;
    disabilityStatus: string;
    completedAt: string;
  } | null;
};

export type ApiAuthTokens = {
  accessToken: string;
  refreshToken: string;
};
