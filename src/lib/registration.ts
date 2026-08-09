export const AGE_BANDS = [
  "14-16",
  "17-18",
  "19-21",
  "22-24",
  "25-27",
  "27+",
] as const;

export const GENDERS = [
  "Male",
  "Female",
  "Non-binary",
  "Prefer not to say",
] as const;

export const STUDY_LEVELS = [
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "Honours 1st year",
  "Honours 2nd year",
  "Honours 3rd year",
  "Honours 4th year",
  "Honours 5th year",
  "Masters",
  "PhD",
  "Diploma",
] as const;

export const INSTITUTION_TYPES = [
  "Public",
  "Private",
  "National University",
  "Medical College",
  "TVET/Polytechnic",
  "Nursing College",
  "Other",
] as const;

export const FIELDS_OF_STUDY = [
  "Engineering",
  "Medical",
  "Business",
  "Social Science",
  "Health",
  "Arts",
  "Fine Arts",
  "Other",
] as const;

export const SUBJECT_FEELINGS = [
  "Satisfied",
  "Neutral",
  "Wish I'd chosen differently",
] as const;

/**
 * FR-01-006 branch point. These are the values the API stores; the labels
 * below are presentation only, because the form ships in English and Bangla
 * (FR-01-016) and a translated label must never become stored data.
 */
export const OCCUPATION_STATUSES = [
  "STUDENT",
  "SELF_EMPLOYED",
  "WAGE_EMPLOYED",
  "JOBSEEKER",
] as const;

export type OccupationStatus = (typeof OCCUPATION_STATUSES)[number];

export const OCCUPATION_LABELS: Record<
  OccupationStatus,
  { en: string; bn: string }
> = {
  STUDENT: { en: "Student", bn: "শিক্ষার্থী" },
  SELF_EMPLOYED: {
    en: "Self-employed / Business / Entrepreneur",
    bn: "স্ব-নিযুক্ত / ব্যবসা / উদ্যোক্তা",
  },
  WAGE_EMPLOYED: { en: "Wage employed", bn: "চাকরিজীবী" },
  JOBSEEKER: { en: "Jobseeker", bn: "চাকরিপ্রার্থী" },
};

/** The follow-up field each branch owns. Nothing else may be sent with it. */
export const OCCUPATION_BRANCH_FIELD: Record<
  OccupationStatus,
  "businessType" | "employmentSector" | "jobseekerDuration" | null
> = {
  STUDENT: null,
  SELF_EMPLOYED: "businessType",
  WAGE_EMPLOYED: "employmentSector",
  JOBSEEKER: "jobseekerDuration",
};

/**
 * FR-01-007: three equally weighted options. Render them the same size, in
 * this order, with no visual emphasis on any one — "Prefer not to say" is a
 * real answer, not an opt-out.
 */
export const DISABILITY_STATUSES = ["YES", "NO", "PREFER_NOT_TO_SAY"] as const;

export type DisabilityStatus = (typeof DISABILITY_STATUSES)[number];

export const DISABILITY_LABELS: Record<
  DisabilityStatus,
  { en: string; bn: string }
> = {
  YES: { en: "Yes", bn: "হ্যাঁ" },
  NO: { en: "No", bn: "না" },
  PREFER_NOT_TO_SAY: { en: "Prefer not to say", bn: "বলতে চাই না" },
};

export const JOBSEEKER_DURATIONS = [
  "UNDER_6_MONTHS",
  "6_TO_12_MONTHS",
  "1_TO_2_YEARS",
  "OVER_2_YEARS",
] as const;

export const JOBSEEKER_DURATION_LABELS: Record<
  (typeof JOBSEEKER_DURATIONS)[number],
  { en: string; bn: string }
> = {
  UNDER_6_MONTHS: { en: "Less than 6 months", bn: "৬ মাসের কম" },
  "6_TO_12_MONTHS": { en: "6 to 12 months", bn: "৬ থেকে ১২ মাস" },
  "1_TO_2_YEARS": { en: "1 to 2 years", bn: "১ থেকে ২ বছর" },
  OVER_2_YEARS: { en: "More than 2 years", bn: "২ বছরের বেশি" },
};

export const INCOME_BANDS = [
  "BELOW_10K",
  "10K_25K",
  "25K_50K",
  "50K_100K",
  "ABOVE_100K",
  "PREFER_NOT_TO_SAY",
] as const;

export const INCOME_BAND_LABELS: Record<
  (typeof INCOME_BANDS)[number],
  { en: string; bn: string }
> = {
  BELOW_10K: { en: "Below ৳10,000", bn: "১০,০০০ টাকার নিচে" },
  "10K_25K": { en: "৳10,000 – ৳25,000", bn: "১০,০০০ – ২৫,০০০ টাকা" },
  "25K_50K": { en: "৳25,000 – ৳50,000", bn: "২৫,০০০ – ৫০,০০০ টাকা" },
  "50K_100K": { en: "৳50,000 – ৳100,000", bn: "৫০,০০০ – ১,০০,০০০ টাকা" },
  ABOVE_100K: { en: "Above ৳100,000", bn: "১,০০,০০০ টাকার বেশি" },
  PREFER_NOT_TO_SAY: { en: "Prefer not to say", bn: "বলতে চাই না" },
};

export const PARENT_EDUCATION_LEVELS = [
  "NO_FORMAL_EDUCATION",
  "PRIMARY",
  "SECONDARY",
  "HIGHER_SECONDARY",
  "BACHELORS",
  "MASTERS_OR_ABOVE",
  "PREFER_NOT_TO_SAY",
] as const;

export const PARENT_EDUCATION_LABELS: Record<
  (typeof PARENT_EDUCATION_LEVELS)[number],
  { en: string; bn: string }
> = {
  NO_FORMAL_EDUCATION: { en: "No formal education", bn: "প্রাতিষ্ঠানিক শিক্ষা নেই" },
  PRIMARY: { en: "Primary", bn: "প্রাথমিক" },
  SECONDARY: { en: "Secondary (SSC)", bn: "মাধ্যমিক (এসএসসি)" },
  HIGHER_SECONDARY: { en: "Higher Secondary (HSC)", bn: "উচ্চ মাধ্যমিক (এইচএসসি)" },
  BACHELORS: { en: "Bachelor's", bn: "স্নাতক" },
  MASTERS_OR_ABOVE: { en: "Master's or above", bn: "স্নাতকোত্তর বা উচ্চতর" },
  PREFER_NOT_TO_SAY: { en: "Prefer not to say", bn: "বলতে চাই না" },
};

/** FR-01-013: these two bands require guardian details before step 5. */
export const MINOR_AGE_BANDS: readonly string[] = ["14-16", "17-18"];

export const isMinorAgeBand = (band: string): boolean =>
  MINOR_AGE_BANDS.includes(band);

export const HOME_DISTRICTS = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barishal",
  "Bhola",
  "Bogura",
  "Brahmanbaria",
  "Chandpur",
  "Chapai Nawabganj",
  "Chattogram",
  "Chuadanga",
  "Cox's Bazar",
  "Cumilla",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokati",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachhari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon",
] as const;

export const FOUNDATION_WELCOME_TEXT =
  "Student Square Foundation works with young people across Bangladesh on education, wellbeing, and leadership. This registration collects contact details, education background, occupation status, and optionally disability/accessibility information so we can match you with programmes and support. Your Member ID will be emailed after you verify your address.";

/**
 * FR-01-003. Shown on step 1 as its own checkbox, separate from the Terms.
 * Kept verbatim in sync with the server's consent registry — the server
 * stores its own copy, so this is what the applicant reads, not what is saved.
 */
export const SENSITIVE_CONSENT_SUMMARY = {
  categories: [
    "Disability and accessibility status",
    "Health information (Hepatitis-B status, sleep, migraine, nutrition)",
    "Psychological self-assessment answers",
  ],
  purpose:
    "Used only to help an assigned human counsellor understand your situation and give better guidance. It is never used to score, grade or rank you, and the platform produces no medical or psychological diagnosis.",
  access:
    "Your assigned counsellor and Foundation administrators. Your assigned mentor cannot see your health or psychological answers.",
  retention:
    "Kept while your account is active and for two years afterwards, then deleted.",
  withdrawal:
    "You may withdraw this consent at any time by contacting the Foundation. Withdrawing it does not affect your use of the rest of the platform.",
} as const;

/** Mirrors the server payload in auth.service.ts. */
export type FoundationRegisterInput = {
  // Step 1 — three separate consent decisions (FR-01-002/003)
  termsConsent: true;
  privacyConsent: true;
  sensitiveDataConsent: true;
  marketingConsent?: boolean;
  researchConsent?: boolean;

  // Step 2 — identity
  email: string;
  password: string;
  fullName: string;
  fullNameBn?: string | null;
  phone: string;
  address: string;
  ageBand: (typeof AGE_BANDS)[number];
  gender: (typeof GENDERS)[number];
  homeDistrict: (typeof HOME_DISTRICTS)[number];
  preferredLocale?: "en" | "bn";

  // Guardian — required when ageBand is a minor band (FR-01-013)
  guardianName?: string | null;
  guardianPhone?: string | null;
  guardianConsent?: boolean;

  // Step 3 — education
  studyLevel: (typeof STUDY_LEVELS)[number];
  institutionType: (typeof INSTITUTION_TYPES)[number];
  institutionTypeOther?: string | null;
  institutionName: string;
  fieldOfStudy: (typeof FIELDS_OF_STUDY)[number];
  subjectDepartment: string;
  subjectFeeling: (typeof SUBJECT_FEELINGS)[number];
  subjectFeelingWhy?: string | null;
  facedSubjectConfusion: boolean;
  regretsSubject?: boolean | null;
  regretsSubjectWhy?: string | null;

  // Step 4 — occupation branch (FR-01-006)
  occupationStatus: OccupationStatus;
  employmentSector?: string | null;
  businessType?: string | null;
  jobseekerDuration?: (typeof JOBSEEKER_DURATIONS)[number] | null;

  // Step 5 — background (sensitive)
  disabilityStatus: DisabilityStatus;
  disabilityNote?: string | null;
  hasInstitutionalRelatives?: boolean | null;
  relativeIndustry?: string | null;
  familyMonthlyIncomeBand?: (typeof INCOME_BANDS)[number] | null;
  parentEducationLevel?: (typeof PARENT_EDUCATION_LEVELS)[number] | null;
};

/**
 * Strips fields that do not belong to the chosen occupation branch.
 *
 * The server rejects a payload carrying another branch's fields with 422
 * (FR-01-006), so this must run before submit — otherwise a user who picks
 * "Jobseeker", fills the duration, then goes back and switches to "Student"
 * would be blocked by an error about a field no longer on screen.
 */
export function stripForeignBranchFields<
  T extends { occupationStatus: OccupationStatus }
>(payload: T): T {
  const keep = OCCUPATION_BRANCH_FIELD[payload.occupationStatus];
  const out = { ...payload } as Record<string, unknown>;
  for (const field of ["businessType", "employmentSector", "jobseekerDuration"]) {
    if (field !== keep) delete out[field];
  }
  return out as T;
}
