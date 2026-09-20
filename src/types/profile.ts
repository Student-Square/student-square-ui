/** Types for the /profile API surface. */

export type ProfileUpdateInput = {
  bio?: string;
  bioBn?: string;
  phone?: string;
  country?: string;
  city?: string;
  currentAddress?: string;
  university?: string;
  department?: string;
  profession?: string;
  workplace?: string;
  preferredAnonymous?: boolean;
};

/**
 * The registration questionnaire, edited after the fact.
 *
 * Every field is optional because the endpoint is a PATCH, and the cross-field
 * rules (guardian details for a minor band, one occupation branch at a time)
 * are checked on the server against the merged record — the client cannot
 * decide them from a partial payload alone.
 */
export type MembershipUpdateInput = Partial<{
  fullNameBn: string | null;
  phone: string;
  address: string;
  ageBand: string;
  gender: string;
  homeDistrict: string;
  preferredLocale: "en" | "bn";

  guardianName: string | null;
  guardianPhone: string | null;
  guardianConsent: boolean;

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
}>;

/** The User-level half of the registration record. */
export type MembershipAccount = {
  fullNameBn: string | null;
  preferredLocale: string;
  isMinor: boolean;
  guardianName: string | null;
  guardianPhone: string | null;
  guardianConsentAt: string | null;
};
