"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import {
  AGE_BANDS,
  DISABILITY_LABELS,
  DISABILITY_STATUSES,
  FIELDS_OF_STUDY,
  FOUNDATION_WELCOME_TEXT,
  GENDERS,
  HOME_DISTRICTS,
  INCOME_BANDS,
  INCOME_BAND_LABELS,
  INSTITUTION_TYPES,
  JOBSEEKER_DURATIONS,
  JOBSEEKER_DURATION_LABELS,
  OCCUPATION_BRANCH_FIELD,
  OCCUPATION_LABELS,
  OCCUPATION_STATUSES,
  PARENT_EDUCATION_LABELS,
  PARENT_EDUCATION_LEVELS,
  SENSITIVE_CONSENT_SUMMARY,
  STUDY_LEVELS,
  SUBJECT_FEELINGS,
  isMinorAgeBand,
  stripForeignBranchFields,
  type FoundationRegisterInput,
  type OccupationStatus,
} from "@/lib/registration";

type Stage = "wizard" | "sent";
type Step = 1 | 2 | 3 | 4 | 5 | 6;

const DRAFT_KEY = "ssf-register-draft-v1";

type Draft = {
  // Step 1 — three separate decisions (FR-01-002/003)
  termsConsent: boolean;
  privacyConsent: boolean;
  sensitiveDataConsent: boolean;
  marketingConsent: boolean;
  researchConsent: boolean;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  ageBand: string;
  gender: string;
  homeDistrict: string;
  studyLevel: string;
  institutionType: string;
  institutionTypeOther: string;
  institutionName: string;
  fieldOfStudy: string;
  subjectDepartment: string;
  subjectFeeling: string;
  subjectFeelingWhy: string;
  facedSubjectConfusion: "" | "yes" | "no";
  regretsSubject: "" | "yes" | "no";
  regretsSubjectWhy: string;
  occupationStatus: string;
  // Only the field owned by the chosen branch is ever sent (FR-01-006).
  businessType: string;
  employmentSector: string;
  jobseekerDuration: string;
  // Guardian — required for minor age bands (FR-01-013)
  guardianName: string;
  guardianPhone: string;
  guardianConsent: boolean;
  disabilityStatus: string;
  disabilityNote: string;
  hasInstitutionalRelatives: "" | "yes" | "no";
  relativeIndustry: string;
  familyMonthlyIncomeBand: string;
  parentEducationLevel: string;
};

const emptyDraft = (): Draft => ({
  termsConsent: false,
  privacyConsent: false,
  sensitiveDataConsent: false,
  marketingConsent: false,
  researchConsent: false,
  fullName: "",
  email: "",
  phone: "",
  address: "",
  ageBand: "",
  gender: "",
  homeDistrict: "",
  studyLevel: "",
  institutionType: "",
  institutionTypeOther: "",
  institutionName: "",
  fieldOfStudy: "",
  subjectDepartment: "",
  subjectFeeling: "",
  subjectFeelingWhy: "",
  facedSubjectConfusion: "",
  regretsSubject: "",
  regretsSubjectWhy: "",
  occupationStatus: "",
  businessType: "",
  employmentSector: "",
  jobseekerDuration: "",
  guardianName: "",
  guardianPhone: "",
  guardianConsent: false,
  disabilityStatus: "",
  disabilityNote: "",
  hasInstitutionalRelatives: "",
  relativeIndustry: "",
  familyMonthlyIncomeBand: "",
  parentEducationLevel: "",
});

/**
 * Fields never written to localStorage.
 *
 * The draft is saved so a long form survives a refresh, but these are C3
 * sensitive (SRS §3.5) or belong to a third party. Persisting them would
 * leave health and guardian data readable in the browser of a shared or
 * public computer long after the form was abandoned.
 */
const NEVER_PERSIST = [
  "disabilityStatus",
  "disabilityNote",
  "guardianName",
  "guardianPhone",
  "address",
  "phone",
  "familyMonthlyIncomeBand",
] as const;

const persistableDraft = (d: Draft): Partial<Draft> => {
  const copy = { ...d } as Record<string, unknown>;
  for (const key of NEVER_PERSIST) delete copy[key];
  return copy as Partial<Draft>;
};

const fieldClass =
  "w-full px-3 py-2.5 text-sm rounded-lg bg-background border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors";

const labelClass =
  "block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </main>
      }
    >
      <RegisterWizard />
    </Suspense>
  );
}

function RegisterWizard() {
  const [register, { isLoading }] = useRegisterMutation();
  const [stage, setStage] = useState<Stage>("wizard");
  const [step, setStep] = useState<Step>(1);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sentEmail, setSentEmail] = useState("");
  const [sentMemberId, setSentMemberId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setDraft({ ...emptyDraft(), ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(persistableDraft(draft)));
  }, [draft, hydrated]);

  const patch = (partial: Partial<Draft>) =>
    setDraft((d) => ({ ...d, ...partial }));

  const stepTitle = useMemo(
    () =>
      (
        {
          1: "Welcome & consent",
          2: "Contact & identity",
          3: "Education",
          4: "Occupation status",
          5: "Background & accessibility",
          6: "Account & submit",
        } as const
      )[step],
    [step]
  );

  function validateStep(): string | null {
    if (step === 1) {
      // FR-01-002/003: three separate consents. A combined checkbox would not
      // be valid consent for the sensitive categories.
      if (!draft.termsConsent) return "Please accept the Terms of Use.";
      if (!draft.privacyConsent) return "Please accept the Privacy Notice.";
      if (!draft.sensitiveDataConsent)
        return "Please consent to collection of disability, health and psychological information.";
    }
    if (step === 2) {
      if (!draft.fullName.trim()) return "Full name is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim()))
        return "Enter a valid email.";
      if (!/^\d{10,15}$/.test(draft.phone.trim()))
        return "Phone must be digits only (10–15).";
      if (!draft.address.trim()) return "Address is required.";
      if (!draft.ageBand) return "Select your age band.";
      if (!draft.gender) return "Select gender.";
      if (!draft.homeDistrict) return "Select home district.";

      // FR-01-013: a minor supplies guardian details here, BEFORE step 5 asks
      // any sensitive question.
      if (isMinorAgeBand(draft.ageBand)) {
        if (!draft.guardianName.trim())
          return "Guardian name is required for your age group.";
        if (!/^01[3-9]\d{8}$/.test(draft.guardianPhone.replace(/[\s-]/g, "")))
          return "Enter a valid guardian mobile number.";
        if (!draft.guardianConsent)
          return "Guardian consent is required for your age group.";
      }
    }
    if (step === 3) {
      if (!draft.studyLevel) return "Select current level of study.";
      if (!draft.institutionType) return "Select institution type.";
      if (
        draft.institutionType === "Other" &&
        !draft.institutionTypeOther.trim()
      )
        return "Please specify institution type.";
      if (!draft.institutionName.trim()) return "Institution name is required.";
      if (!draft.fieldOfStudy) return "Select field of study.";
      if (!draft.subjectDepartment.trim()) return "Subject/department is required.";
      if (!draft.subjectFeeling) return "Select how you feel about your subject.";
      if (!draft.facedSubjectConfusion)
        return "Please answer whether you faced confusion choosing your subject.";
    }
    if (step === 4) {
      if (!draft.occupationStatus)
        return "Select your current occupation status.";
      // Each branch requires only its own follow-up (FR-01-006).
      const needed = OCCUPATION_BRANCH_FIELD[
        draft.occupationStatus as OccupationStatus
      ];
      if (needed && !String(draft[needed] ?? "").trim()) {
        return "Please complete the follow-up question for your occupation.";
      }
    }
    // FR-01-007: the status itself is required; the note never is.
    if (step === 5 && !draft.disabilityStatus)
      return "Please select an option.";
    if (step === 6) {
      if (password.length < 8) return "Password must be at least 8 characters.";
      if (password !== confirmPassword) return "Passwords do not match.";
    }
    return null;
  }

  function goNext() {
    setFormError(null);
    const err = validateStep();
    if (err) {
      setFormError(err);
      return;
    }
    if (step < 6) setStep((s) => (s + 1) as Step);
  }

  function goBack() {
    setFormError(null);
    if (step > 1) setStep((s) => (s - 1) as Step);
  }

  async function handleSubmit() {
    setFormError(null);
    const err = validateStep();
    if (err) {
      setFormError(err);
      return;
    }

    const isMinor = isMinorAgeBand(draft.ageBand);

    const body: FoundationRegisterInput = stripForeignBranchFields({
      termsConsent: true,
      privacyConsent: true,
      sensitiveDataConsent: true,
      marketingConsent: draft.marketingConsent,
      researchConsent: draft.researchConsent,
      email: draft.email.trim(),
      password,
      fullName: draft.fullName.trim(),
      phone: draft.phone.trim(),
      address: draft.address.trim(),
      ageBand: draft.ageBand as FoundationRegisterInput["ageBand"],
      gender: draft.gender as FoundationRegisterInput["gender"],
      homeDistrict: draft.homeDistrict as FoundationRegisterInput["homeDistrict"],
      studyLevel: draft.studyLevel as FoundationRegisterInput["studyLevel"],
      institutionType:
        draft.institutionType as FoundationRegisterInput["institutionType"],
      institutionTypeOther:
        draft.institutionType === "Other"
          ? draft.institutionTypeOther.trim()
          : null,
      institutionName: draft.institutionName.trim(),
      fieldOfStudy:
        draft.fieldOfStudy as FoundationRegisterInput["fieldOfStudy"],
      subjectDepartment: draft.subjectDepartment.trim(),
      subjectFeeling:
        draft.subjectFeeling as FoundationRegisterInput["subjectFeeling"],
      subjectFeelingWhy: draft.subjectFeelingWhy.trim() || null,
      facedSubjectConfusion: draft.facedSubjectConfusion === "yes",
      regretsSubject:
        draft.regretsSubject === "" ? null : draft.regretsSubject === "yes",
      regretsSubjectWhy: draft.regretsSubjectWhy.trim() || null,

      occupationStatus: draft.occupationStatus as OccupationStatus,
      businessType: draft.businessType.trim() || null,
      employmentSector: draft.employmentSector.trim() || null,
      jobseekerDuration:
        (draft.jobseekerDuration ||
          null) as FoundationRegisterInput["jobseekerDuration"],

      guardianName: isMinor ? draft.guardianName.trim() : null,
      guardianPhone: isMinor
        ? draft.guardianPhone.replace(/[\s-]/g, "")
        : null,
      guardianConsent: isMinor ? true : undefined,

      disabilityStatus:
        draft.disabilityStatus as FoundationRegisterInput["disabilityStatus"],
      disabilityNote: draft.disabilityNote.trim() || null,
      hasInstitutionalRelatives:
        draft.hasInstitutionalRelatives === ""
          ? null
          : draft.hasInstitutionalRelatives === "yes",
      relativeIndustry: draft.relativeIndustry.trim() || null,
      familyMonthlyIncomeBand:
        (draft.familyMonthlyIncomeBand ||
          null) as FoundationRegisterInput["familyMonthlyIncomeBand"],
      parentEducationLevel:
        (draft.parentEducationLevel ||
          null) as FoundationRegisterInput["parentEducationLevel"],
    });

    try {
      const result = await register(body).unwrap();
      setSentEmail(body.email);
      setSentMemberId(result.memberId ?? null);
      localStorage.removeItem(DRAFT_KEY);
      setStage("sent");
    } catch (e) {
      const msg =
        (e as { data?: { message?: string } })?.data?.message ??
        "Registration failed. Please try again.";
      setFormError(msg);
    }
  }

  if (stage === "sent") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10 relative overflow-hidden">
        <Backdrop />
        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 ring-8 ring-emerald-100 dark:ring-emerald-900/20">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Thanks for registering!
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              You&apos;ll receive a verification email with your unique Member
              ID shortly
              {sentMemberId ? (
                <>
                  {" "}
                  — your ID is{" "}
                  <span className="font-semibold text-foreground">
                    {sentMemberId}
                  </span>
                </>
              ) : null}
              . We sent it to{" "}
              <span className="font-semibold text-foreground">{sentEmail}</span>.
            </p>
            <div className="mt-6 pt-5 border-t border-border">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-emerald-600 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10 sm:py-16 relative overflow-hidden">
      <Backdrop />
      <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-emerald-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Student Square
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3 mb-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              Step {step} of 6
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className={`h-1.5 w-6 rounded-full ${
                    n <= step ? "bg-emerald-600" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {stepTitle}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Student Square Foundation registration
          </p>

          <div className="mt-6 space-y-4">
            {step === 1 && (
              <>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {FOUNDATION_WELCOME_TEXT}
                </p>

                {/* FR-01-002/003 — three separate consents. The sensitive-data
                    consent is deliberately NOT bundled with the Terms. */}
                <label className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-emerald-600"
                    checked={draft.termsConsent}
                    onChange={(e) => patch({ termsConsent: e.target.checked })}
                  />
                  <span className="text-sm text-foreground leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="underline font-medium" target="_blank">
                      Terms of Use
                    </Link>
                    .
                  </span>
                </label>

                <label className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-emerald-600"
                    checked={draft.privacyConsent}
                    onChange={(e) => patch({ privacyConsent: e.target.checked })}
                  />
                  <span className="text-sm text-foreground leading-relaxed">
                    I have read the{" "}
                    <Link href="/privacy" className="underline font-medium" target="_blank">
                      Privacy Notice
                    </Link>{" "}
                    and understand what data is collected and how to have it deleted.
                  </span>
                </label>

                <div className="rounded-lg border-2 border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-950/30 p-4 space-y-3">
                  <p className="text-sm font-bold text-foreground">
                    Sensitive information — please read before agreeing
                  </p>

                  <div className="space-y-2 text-sm text-foreground leading-relaxed">
                    <p className="font-medium">We will ask you about:</p>
                    <ul className="list-disc pl-5 space-y-0.5">
                      {SENSITIVE_CONSENT_SUMMARY.categories.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                    <p>
                      <span className="font-medium">Why: </span>
                      {SENSITIVE_CONSENT_SUMMARY.purpose}
                    </p>
                    <p>
                      <span className="font-medium">Who can see it: </span>
                      {SENSITIVE_CONSENT_SUMMARY.access}
                    </p>
                    <p>
                      <span className="font-medium">How long we keep it: </span>
                      {SENSITIVE_CONSENT_SUMMARY.retention}
                    </p>
                    <p>
                      <span className="font-medium">Changing your mind: </span>
                      {SENSITIVE_CONSENT_SUMMARY.withdrawal}
                    </p>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-amber-600"
                      checked={draft.sensitiveDataConsent}
                      onChange={(e) =>
                        patch({ sensitiveDataConsent: e.target.checked })
                      }
                    />
                    <span className="text-sm font-medium text-foreground leading-relaxed">
                      I consent to Student Square Foundation collecting and storing
                      this sensitive information for the purpose described above.
                    </span>
                  </label>
                </div>

                {/* Optional — never a condition of registering. */}
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground pt-2">
                  Optional
                </p>
                <label className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-emerald-600"
                    checked={draft.marketingConsent}
                    onChange={(e) => patch({ marketingConsent: e.target.checked })}
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    Send me newsletters and updates about Foundation programmes.
                    I can unsubscribe at any time.
                  </span>
                </label>
                <label className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-emerald-600"
                    checked={draft.researchConsent}
                    onChange={(e) => patch({ researchConsent: e.target.checked })}
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    My answers may be used in anonymised, aggregated form for
                    research on student career outcomes. Nothing identifying me
                    will be published.
                  </span>
                </label>
              </>
            )}

            {step === 2 && (
              <>
                <Field label="Full name">
                  <input
                    className={fieldClass}
                    value={draft.fullName}
                    onChange={(e) => patch({ fullName: e.target.value })}
                    autoComplete="name"
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    className={fieldClass}
                    value={draft.email}
                    onChange={(e) => patch({ email: e.target.value })}
                    autoComplete="email"
                  />
                </Field>
                <Field label="Phone number (WhatsApp)">
                  <input
                    inputMode="numeric"
                    className={fieldClass}
                    value={draft.phone}
                    onChange={(e) =>
                      patch({ phone: e.target.value.replace(/\D/g, "") })
                    }
                    placeholder="Digits only"
                  />
                </Field>
                <Field label="Address">
                  <textarea
                    className={fieldClass}
                    rows={3}
                    value={draft.address}
                    onChange={(e) => patch({ address: e.target.value })}
                  />
                </Field>
                <Field label="Age">
                  <Select
                    value={draft.ageBand}
                    onChange={(v) => patch({ ageBand: v })}
                    options={AGE_BANDS}
                  />
                </Field>
                <Field label="Gender">
                  <ChoiceList
                    name="gender"
                    value={draft.gender}
                    onChange={(v) => patch({ gender: v })}
                    options={GENDERS}
                  />
                </Field>
                <Field label="Home district">
                  <Select
                    value={draft.homeDistrict}
                    onChange={(v) => patch({ homeDistrict: v })}
                    options={HOME_DISTRICTS}
                  />
                </Field>

                {/* FR-01-013 — guardian details are collected HERE, on the
                    step where age band is chosen, so they are in place before
                    step 5 asks anything sensitive. */}
                {isMinorAgeBand(draft.ageBand) && (
                  <div className="rounded-lg border-2 border-sky-300 dark:border-sky-800 bg-sky-50/60 dark:bg-sky-950/30 p-4 space-y-4">
                    <p className="text-sm font-bold text-foreground">
                      Parent or guardian details
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Because of your age group, we need a parent or guardian to
                      know about and agree to your registration before we ask
                      any questions about health or accessibility.
                    </p>

                    <Field label="Guardian full name">
                      <input
                        className={fieldClass}
                        value={draft.guardianName}
                        onChange={(e) => patch({ guardianName: e.target.value })}
                        placeholder="Parent or legal guardian"
                      />
                    </Field>

                    <Field label="Guardian mobile number">
                      <input
                        className={fieldClass}
                        value={draft.guardianPhone}
                        onChange={(e) => patch({ guardianPhone: e.target.value })}
                        placeholder="01XXXXXXXXX"
                        inputMode="numeric"
                      />
                    </Field>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-sky-600"
                        checked={draft.guardianConsent}
                        onChange={(e) =>
                          patch({ guardianConsent: e.target.checked })
                        }
                      />
                      <span className="text-sm text-foreground leading-relaxed">
                        I confirm that my parent or guardian has been informed
                        and consents to my registration, and understands that
                        information about health, disability and wellbeing will
                        be collected.
                      </span>
                    </label>
                  </div>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <Field label="Current level of study">
                  <Select
                    value={draft.studyLevel}
                    onChange={(v) => patch({ studyLevel: v })}
                    options={STUDY_LEVELS}
                  />
                </Field>
                <Field label="Institution type">
                  <ChoiceList
                    name="institutionType"
                    value={draft.institutionType}
                    onChange={(v) => patch({ institutionType: v })}
                    options={INSTITUTION_TYPES}
                  />
                </Field>
                {draft.institutionType === "Other" && (
                  <Field label="Specify institution type">
                    <input
                      className={fieldClass}
                      value={draft.institutionTypeOther}
                      onChange={(e) =>
                        patch({ institutionTypeOther: e.target.value })
                      }
                    />
                  </Field>
                )}
                <Field label="Institution name">
                  <input
                    className={fieldClass}
                    value={draft.institutionName}
                    onChange={(e) => patch({ institutionName: e.target.value })}
                  />
                </Field>
                <Field label="Field of study">
                  <ChoiceList
                    name="fieldOfStudy"
                    value={draft.fieldOfStudy}
                    onChange={(v) => patch({ fieldOfStudy: v })}
                    options={FIELDS_OF_STUDY}
                  />
                </Field>
                <Field label="Subject / department">
                  <input
                    className={fieldClass}
                    value={draft.subjectDepartment}
                    onChange={(e) =>
                      patch({ subjectDepartment: e.target.value })
                    }
                  />
                </Field>
                <Field label="How do you feel about your subject?">
                  <ChoiceList
                    name="subjectFeeling"
                    value={draft.subjectFeeling}
                    onChange={(v) => patch({ subjectFeeling: v })}
                    options={SUBJECT_FEELINGS}
                  />
                </Field>
                <Field label="Why? (optional)">
                  <textarea
                    className={fieldClass}
                    rows={2}
                    value={draft.subjectFeelingWhy}
                    onChange={(e) =>
                      patch({ subjectFeelingWhy: e.target.value })
                    }
                  />
                </Field>
                <Field label="Did you face confusion choosing your subject?">
                  <ChoiceList
                    name="facedSubjectConfusion"
                    value={draft.facedSubjectConfusion}
                    onChange={(v) =>
                      patch({
                        facedSubjectConfusion: v as "" | "yes" | "no",
                      })
                    }
                    options={[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                    ]}
                  />
                </Field>
              </>
            )}

            {/* FR-01-006: the branch question is the ONLY question on this
                step, so switching branches cannot orphan an answer below it.
                The follow-up appears only after a choice is made. */}
            {step === 4 && (
              <>
                <Field label="Current occupation status?">
                  <ChoiceList
                    name="occupationStatus"
                    value={draft.occupationStatus}
                    onChange={(v) =>
                      // Clear the other branches so a switch cannot leave a
                      // stale value that the server would reject with 422.
                      patch({
                        occupationStatus: v,
                        businessType: "",
                        employmentSector: "",
                        jobseekerDuration: "",
                      })
                    }
                    options={OCCUPATION_STATUSES}
                    labels={(v) => OCCUPATION_LABELS[v as OccupationStatus].en}
                  />
                </Field>

                {draft.occupationStatus === "SELF_EMPLOYED" && (
                  <Field label="What kind of business?">
                    <input
                      className={fieldClass}
                      value={draft.businessType}
                      onChange={(e) => patch({ businessType: e.target.value })}
                      placeholder="e.g. Online clothing store"
                    />
                  </Field>
                )}

                {draft.occupationStatus === "WAGE_EMPLOYED" && (
                  <Field label="Which sector do you work in?">
                    <input
                      className={fieldClass}
                      value={draft.employmentSector}
                      onChange={(e) => patch({ employmentSector: e.target.value })}
                      placeholder="e.g. Garments, IT, Education"
                    />
                  </Field>
                )}

                {draft.occupationStatus === "JOBSEEKER" && (
                  <Field label="How long have you been looking for work?">
                    <select
                      className={fieldClass}
                      value={draft.jobseekerDuration}
                      onChange={(e) => patch({ jobseekerDuration: e.target.value })}
                    >
                      <option value="">Select…</option>
                      {JOBSEEKER_DURATIONS.map((d) => (
                        <option key={d} value={d}>
                          {JOBSEEKER_DURATION_LABELS[d].en}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
              </>
            )}

            {step === 5 && (
              <>
                {/* FR-01-007: three equally weighted options, and no forced
                    follow-up after "Yes". */}
                <Field label="Do you have any disability or condition that makes certain tasks difficult?">
                  <ChoiceList
                    name="disabilityStatus"
                    value={draft.disabilityStatus}
                    onChange={(v) => patch({ disabilityStatus: v })}
                    options={DISABILITY_STATUSES}
                    labels={(v) =>
                      DISABILITY_LABELS[v as keyof typeof DISABILITY_LABELS].en
                    }
                  />
                </Field>

                {draft.disabilityStatus === "YES" && (
                  <Field label="Anything you would like us to know? (optional)">
                    <textarea
                      className={fieldClass}
                      rows={3}
                      value={draft.disabilityNote}
                      onChange={(e) => patch({ disabilityNote: e.target.value })}
                      placeholder="You can leave this blank."
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      This is optional. You can continue without answering.
                    </p>
                  </Field>
                )}

                <div className="pt-2 border-t border-border">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Background (all optional)
                  </p>

                  <Field label="Do you have relatives working in institutions or industries?">
                    <ChoiceList
                      name="hasInstitutionalRelatives"
                      value={draft.hasInstitutionalRelatives}
                      onChange={(v) =>
                        patch({
                          hasInstitutionalRelatives: v as "yes" | "no",
                          relativeIndustry:
                            v === "yes" ? draft.relativeIndustry : "",
                        })
                      }
                      options={["yes", "no"] as const}
                      labels={(v) => (v === "yes" ? "Yes" : "No")}
                    />
                  </Field>

                  {draft.hasInstitutionalRelatives === "yes" && (
                    <Field label="Which industry?">
                      <input
                        className={fieldClass}
                        value={draft.relativeIndustry}
                        onChange={(e) => patch({ relativeIndustry: e.target.value })}
                        placeholder="e.g. Healthcare, Banking"
                      />
                    </Field>
                  )}

                  <Field label="Family monthly income">
                    <select
                      className={fieldClass}
                      value={draft.familyMonthlyIncomeBand}
                      onChange={(e) =>
                        patch({ familyMonthlyIncomeBand: e.target.value })
                      }
                    >
                      <option value="">Prefer not to answer</option>
                      {INCOME_BANDS.map((b) => (
                        <option key={b} value={b}>
                          {INCOME_BAND_LABELS[b].en}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      A range only — we never ask for an exact figure.
                    </p>
                  </Field>

                  <Field label="Highest level of education in your family">
                    <select
                      className={fieldClass}
                      value={draft.parentEducationLevel}
                      onChange={(e) =>
                        patch({ parentEducationLevel: e.target.value })
                      }
                    >
                      <option value="">Prefer not to answer</option>
                      {PARENT_EDUCATION_LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {PARENT_EDUCATION_LABELS[l].en}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </>
            )}

            {step === 6 && (
              <>
                <p className="text-sm text-muted-foreground">
                  Create your login password. Profile picture can be added after
                  email verification from your dashboard (min 200×200px, max
                  2–5MB, square 1:1 recommended).
                </p>
                <Field label="Password">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${fieldClass} pl-9 pr-10`}
                      placeholder="At least 8 characters"
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </Field>
                <Field label="Confirm password">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`${fieldClass} pl-9 pr-10`}
                    />
                    <button
                      type="button"
                      aria-label={
                        showConfirm ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </Field>
              </>
            )}

            {formError && (
              <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-3.5 py-3 text-sm text-red-700 dark:text-red-400">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <div />
              )}
              <div className="flex-1" />
              {step < 6 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit registration
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <select
      className={fieldClass}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select…</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function ChoiceList({
  name,
  value,
  onChange,
  options,
  labels,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[] | { value: string; label: string }[];
  /**
   * Maps a stored value to its display label. Values are stable identifiers
   * (STUDENT, PREFER_NOT_TO_SAY); labels are translated, so the two must never
   * be the same string.
   */
  labels?: (value: string) => string;
}) {
  const normalised = options.map((o) =>
    typeof o === "string"
      ? { value: o, label: labels ? labels(o) : o }
      : o
  );
  return (
    <div className="space-y-2">
      {normalised.map((o) => (
        <label
          key={o.value}
          className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
            value === o.value
              ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
              : "border-border hover:bg-muted/40"
          }`}
        >
          <input
            type="radio"
            name={name}
            className="accent-emerald-600"
            checked={value === o.value}
            onChange={() => onChange(o.value)}
          />
          <span className="text-sm text-foreground">{o.label}</span>
        </label>
      ))}
    </div>
  );
}

function Backdrop() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-background dark:from-emerald-950/40 dark:via-background dark:to-background" />
    </div>
  );
}
