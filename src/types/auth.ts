/** Types for the /auth API surface. */

export type UserRole =
  | "SYSTEM_ADMIN"
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

export type ApiMemberProfile = {
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

export type ApiMe = {
  id: string;
  email: string;
  fullName: string;
  fullNameBn?: string | null;
  slug: string | null;
  memberId?: string | null;
  preferredLocale?: "en" | "bn";
  /** FR-01-013 — guardian details, kept only while the age band is a minor one. */
  isMinor?: boolean;
  guardianName?: string | null;
  guardianPhone?: string | null;
  guardianConsentAt?: string | null;
  role: UserRole;
  status: UserStatus;
  /** Whether this account has confirmed TOTP MFA. */
  mfaEnabled?: boolean;
  /** Whether this role must use MFA under current policy. */
  mfaRequired?: boolean;
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
  /**
   * The registration questionnaire. `/auth/me` returns it in full and
   * decrypts the C3 columns (phone, address, disability) on the way out.
   */
  memberProfile?: ApiMemberProfile | null;
};

/** Login response body. The refresh token is cookie-only, never in the body. */
export type ApiAuthTokens = {
  accessToken: string;
};
