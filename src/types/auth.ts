/** Types for the /auth API surface. */

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MODERATOR"
  | "EDITOR"
  | "FINANCE_MANAGER"
  | "MEMBER";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";

export type ApiMe = {
  id: string;
  email: string;
  fullName: string;
  slug: string | null;
  role: UserRole;
  status: UserStatus;
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
};

export type ApiAuthTokens = {
  accessToken: string;
  refreshToken: string;
};
