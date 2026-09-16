"use client";

import { Suspense, useEffect, useState } from "react";
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
  STUDY_LEVELS,
  SUBJECT_FEELINGS,
  isMinorAgeBand,
  stripForeignBranchFields,
  type FoundationRegisterInput,
  type OccupationStatus,
} from "@/lib/registration";
import AuthShell from "@/components/auth/AuthShell";
import { authButtonClass, authInputClass, authLinkClass, authHeadingClass, authSubheadingClass } from "@/components/auth/auth-ui";
import T from "@/components/i18n/T";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { REGISTRATION_OPTION_BN } from "@/lib/translations/auth";

type Stage = "wizard" | "sent";
type Step = 1 | 2 | 3 | 4 | 5 | 6;

const DRAFT_KEY = "ssf-register-draft-v1";

type Draft = {
  // Step 1 — Terms + Privacy (sensitive-data disclosure lives on /terms)
  termsConsent: boolean;
  privacyConsent: boolean;
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

const fieldClass = authInputClass;

const labelClass =
  "block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <AuthShell variant="register" wide>
          <p className="text-center text-sm text-muted-foreground"><T k="common.loading" /></p>
        </AuthShell>
      }
    >
      <RegisterWizard />
    </Suspense>
  );
}

function RegisterWizard() {
  const { lang, t, rich } = useLanguage();
  // Which half of the { en, bn } label maps in lib/registration to show.
  const labelLang = lang === "BN" ? "bn" : "en";
  const [register, { isLoading }] = useRegisterMutation();
  const [stage, setStage] = useState<Stage>("wizard");
  const [step, setStep] = useState<Step>(1);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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

  const patch = (partial: Partial<Draft>) => {
    setDraft((d) => ({ ...d, ...partial }));
    setFieldErrors((current) => {
      const next = { ...current };
      Object.keys(partial).forEach((key) => delete next[key]);
      return next;
    });
  };

  const stepTitle = t(`reg.step.${step}`);

  function validateStep(): string | null {
    if (step === 1) {
      // Terms of Use now include the sensitive-information disclosure.
      if (!draft.termsConsent) return t("reg.err.terms");
      if (!draft.privacyConsent) return t("reg.err.privacy");
    }
    if (step === 2) {
      if (!draft.fullName.trim()) return t("reg.err.fullName");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim()))
        return t("reg.err.email");
      if (!/^\d{10,15}$/.test(draft.phone.trim()))
        return t("reg.err.phone");
      if (!draft.address.trim()) return t("reg.err.address");
      if (!draft.ageBand) return t("reg.err.ageBand");
      if (!draft.gender) return t("reg.err.gender");
      if (!draft.homeDistrict) return t("reg.err.district");

      // FR-01-013: a minor supplies guardian details here, BEFORE step 5 asks
      // any sensitive question.
      if (isMinorAgeBand(draft.ageBand)) {
        if (!draft.guardianName.trim())
          return t("reg.err.guardianNameAge");
        if (!/^01[3-9]\d{8}$/.test(draft.guardianPhone.replace(/[\s-]/g, "")))
          return t("reg.err.guardianPhone");
        if (!draft.guardianConsent)
          return t("reg.err.guardianConsentAge");
      }
    }
    if (step === 3) {
      if (!draft.studyLevel) return t("reg.err.studyLevel");
      if (!draft.institutionType) return t("reg.err.institutionType");
      if (
        draft.institutionType === "Other" &&
        !draft.institutionTypeOther.trim()
      )
        return t("reg.err.institutionOther");
      if (!draft.institutionName.trim()) return t("reg.err.institutionName");
      if (!draft.fieldOfStudy) return t("reg.err.field");
      if (!draft.subjectDepartment.trim()) return t("reg.err.subject");
      if (!draft.subjectFeeling) return t("reg.err.feeling");
      if (!draft.facedSubjectConfusion)
        return t("reg.err.confusion");
    }
    if (step === 4) {
      if (!draft.occupationStatus)
        return t("reg.err.occupation");
      // Each branch requires only its own follow-up (FR-01-006).
      const needed = OCCUPATION_BRANCH_FIELD[
        draft.occupationStatus as OccupationStatus
      ];
      if (needed && !String(draft[needed] ?? "").trim()) {
        return t("reg.err.followUp");
      }
    }
    // FR-01-007: the status itself is required; the note never is.
    if (step === 5 && !draft.disabilityStatus)
      return t("reg.err.option");
    if (step === 6) {
      if (password.length < 8) return t("reset.errLength");
      if (password !== confirmPassword) return t("reset.errMatch");
    }
    return null;
  }

  function validateIdentityFields() {
    const errors: Record<string, string> = {};
    if (!draft.fullName.trim()) errors.fullName = t("reg.err.fullName");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim()))
      errors.email = t("reg.fe.email");
    if (!/^\d{10,15}$/.test(draft.phone.trim()))
      errors.phone = t("reg.fe.phone");
    if (!draft.address.trim()) errors.address = t("reg.err.address");
    if (!draft.ageBand) errors.ageBand = t("reg.fe.age");
    if (!draft.homeDistrict)
      errors.homeDistrict = t("reg.fe.district");
    if (!draft.gender) errors.gender = t("reg.fe.gender");

    if (isMinorAgeBand(draft.ageBand)) {
      if (!draft.guardianName.trim())
        errors.guardianName = t("reg.fe.guardianName");
      if (!/^01[3-9]\d{8}$/.test(draft.guardianPhone.replace(/[\s-]/g, "")))
        errors.guardianPhone = t("reg.err.guardianPhone");
      if (!draft.guardianConsent)
        errors.guardianConsent = t("reg.fe.guardianConsent");
    }

    return errors;
  }

  function goNext() {
    setFormError(null);
    setFieldErrors({});
    if (step === 2) {
      const errors = validateIdentityFields();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
    }
    const err = validateStep();
    if (err) {
      setFormError(err);
      return;
    }
    if (step < 6) setStep((s) => (s + 1) as Step);
  }

  function goBack() {
    setFormError(null);
    setFieldErrors({});
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
      // Covered by accepting Terms of Use (sensitive section lives on /terms).
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
        t("reg.err.failed");
      setFormError(msg);
    }
  }

  if (stage === "sent") {
    return (
      <AuthShell variant="register" wide>
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 ring-8 ring-emerald-100 dark:ring-emerald-900/20">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("reg.thanks")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {rich("reg.sentBody", {
              memberId: sentMemberId
                ? rich("reg.yourId", {
                    id: <span className="font-semibold text-foreground">{sentMemberId}</span>,
                  })
                : "",
              email: <span className="font-semibold text-foreground">{sentEmail}</span>,
            })}
          </p>
          <p className="mt-6">
            <Link href="/auth/login" className={authLinkClass}>
              {t("reg.loginHere")}
            </Link>
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell variant="register" wide>
      <div className="text-center">
        <h1 className={authHeadingClass}>
          {t("reg.welcome")}
        </h1>
        <p className={authSubheadingClass}>
          {t("reg.subtitle")}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
          {t("reg.stepOf", { step, total: 6 })}
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
      <h2 className="mt-3 text-lg font-semibold text-foreground">{stepTitle}</h2>

      <div
        className={
          step === 1
            ? "mt-6 space-y-4"
            : "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
        }
      >
            {step === 1 && (
              <>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("reg.welcomeText")}
                </p>

                {/* Terms cover the sensitive-information disclosure on /terms. */}
                <label className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-emerald-600"
                    checked={draft.termsConsent}
                    onChange={(e) => patch({ termsConsent: e.target.checked })}
                  />
                  <span className="text-sm text-foreground leading-relaxed">
                    {rich("reg.agreeTerms", {
                      terms: (
                        <Link href="/terms" className="underline font-medium" target="_blank">
                          {t("legal.terms")}
                        </Link>
                      ),
                    })}
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
                    {rich("reg.readPrivacy", {
                      privacy: (
                        <Link href="/privacy" className="underline font-medium" target="_blank">
                          {t("legal.privacy")}
                        </Link>
                      ),
                    })}
                  </span>
                </label>

                {/* Optional — never a condition of registering. */}
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground pt-2">
                  {t("reg.optional")}
                </p>
                <label className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-emerald-600"
                    checked={draft.marketingConsent}
                    onChange={(e) => patch({ marketingConsent: e.target.checked })}
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {t("reg.marketing")}
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
                    {t("reg.research")}
                  </span>
                </label>
              </>
            )}

            {step === 2 && (
              <>
                <Field
                  label={t("reg.fullName")}
                  className="md:col-span-2"
                  error={fieldErrors.fullName}
                >
                  <input
                    className={fieldClass}
                    value={draft.fullName}
                    onChange={(e) => patch({ fullName: e.target.value })}
                    autoComplete="name"
                  />
                </Field>
                <Field label={t("reg.email")} error={fieldErrors.email}>
                  <input
                    type="email"
                    className={fieldClass}
                    value={draft.email}
                    onChange={(e) => patch({ email: e.target.value })}
                    autoComplete="email"
                  />
                </Field>
                <Field
                  label={t("reg.phone")}
                  error={fieldErrors.phone}
                >
                  <input
                    inputMode="numeric"
                    className={fieldClass}
                    value={draft.phone}
                    onChange={(e) =>
                      patch({ phone: e.target.value.replace(/\D/g, "") })
                    }
                    placeholder={t("reg.digitsOnly")}
                  />
                </Field>
                <Field
                  label={t("reg.address")}
                  className="md:col-span-2"
                  error={fieldErrors.address}
                >
                  <textarea
                    className={fieldClass}
                    rows={3}
                    value={draft.address}
                    onChange={(e) => patch({ address: e.target.value })}
                  />
                </Field>
                <Field label={t("reg.age")} error={fieldErrors.ageBand}>
                  <Select
                    value={draft.ageBand}
                    onChange={(v) => patch({ ageBand: v })}
                    options={AGE_BANDS}
                  />
                </Field>
                <Field
                  label={t("reg.district")}
                  error={fieldErrors.homeDistrict}
                >
                  <Select
                    value={draft.homeDistrict}
                    onChange={(v) => patch({ homeDistrict: v })}
                    options={HOME_DISTRICTS}
                  />
                </Field>
                <Field
                  label={t("reg.gender")}
                  className="md:col-span-2"
                  error={fieldErrors.gender}
                >
                  <ChoiceList
                    name="gender"
                    value={draft.gender}
                    onChange={(v) => patch({ gender: v })}
                    options={GENDERS}
                    columns={2}
                  />
                </Field>

                {/* FR-01-013 — guardian details are collected HERE, on the
                    step where age band is chosen, so they are in place before
                    step 5 asks anything sensitive. */}
                {isMinorAgeBand(draft.ageBand) && (
                  <div className="rounded-lg border-2 border-sky-300 dark:border-sky-800 bg-sky-50/60 dark:bg-sky-950/30 p-4 space-y-4 md:col-span-2">
                    <p className="text-sm font-bold text-foreground">
                      {t("reg.guardianTitle")}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t("reg.guardianBody")}
                    </p>

                    <Field
                      label={t("reg.guardianName")}
                      error={fieldErrors.guardianName}
                    >
                      <input
                        className={fieldClass}
                        value={draft.guardianName}
                        onChange={(e) => patch({ guardianName: e.target.value })}
                        placeholder={t("reg.guardianNamePlaceholder")}
                      />
                    </Field>

                    <Field
                      label={t("reg.guardianPhone")}
                      error={fieldErrors.guardianPhone}
                    >
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
                        {t("reg.guardianConsent")}
                      </span>
                    </label>
                    {fieldErrors.guardianConsent && (
                      <p className="text-xs font-medium text-red-600">
                        {fieldErrors.guardianConsent}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <Field label={t("reg.studyLevel")}>
                  <Select
                    value={draft.studyLevel}
                    onChange={(v) => patch({ studyLevel: v })}
                    options={STUDY_LEVELS}
                  />
                </Field>
                <Field label={t("reg.institutionName")}>
                  <input
                    className={fieldClass}
                    value={draft.institutionName}
                    onChange={(e) => patch({ institutionName: e.target.value })}
                  />
                </Field>
                <Field label={t("reg.institutionType")}>
                  <ChoiceList
                    name="institutionType"
                    value={draft.institutionType}
                    onChange={(v) => patch({ institutionType: v })}
                    options={INSTITUTION_TYPES}
                  />
                </Field>
                <Field label={t("reg.field")}>
                  <ChoiceList
                    name="fieldOfStudy"
                    value={draft.fieldOfStudy}
                    onChange={(v) => patch({ fieldOfStudy: v })}
                    options={FIELDS_OF_STUDY}
                  />
                </Field>
                {draft.institutionType === "Other" && (
                  <Field
                    label={t("reg.institutionOther")}
                    className="md:col-span-2"
                  >
                    <input
                      className={fieldClass}
                      value={draft.institutionTypeOther}
                      onChange={(e) =>
                        patch({ institutionTypeOther: e.target.value })
                      }
                    />
                  </Field>
                )}
                <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
                  <div className="space-y-4">
                    <Field label={t("reg.subject")}>
                      <input
                        className={fieldClass}
                        value={draft.subjectDepartment}
                        onChange={(e) =>
                          patch({ subjectDepartment: e.target.value })
                        }
                      />
                    </Field>
                    <Field label={t("reg.confusion")}>
                      <ChoiceList
                        name="facedSubjectConfusion"
                        value={draft.facedSubjectConfusion}
                        onChange={(v) =>
                          patch({
                            facedSubjectConfusion: v as "" | "yes" | "no",
                          })
                        }
                        options={[
                          { value: "yes", label: t("reg.yes") },
                          { value: "no", label: t("reg.no") },
                        ]}
                      />
                    </Field>
                  </div>
                  <Field label={t("reg.feeling")}>
                    <ChoiceList
                      name="subjectFeeling"
                      value={draft.subjectFeeling}
                      onChange={(v) => patch({ subjectFeeling: v })}
                      options={SUBJECT_FEELINGS}
                    />
                  </Field>
                </div>
                <Field label={t("reg.why")} className="md:col-span-2">
                  <textarea
                    className={fieldClass}
                    rows={2}
                    value={draft.subjectFeelingWhy}
                    onChange={(e) =>
                      patch({ subjectFeelingWhy: e.target.value })
                    }
                  />
                </Field>
              </>
            )}

            {/* FR-01-006: the branch question is the ONLY question on this
                step, so switching branches cannot orphan an answer below it.
                The follow-up appears only after a choice is made. */}
            {step === 4 && (
              <>
                <Field label={t("reg.occupation")}>
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
                    labels={(v) => OCCUPATION_LABELS[v as OccupationStatus][labelLang]}
                  />
                </Field>

                {draft.occupationStatus === "SELF_EMPLOYED" && (
                  <Field label={t("reg.business")}>
                    <input
                      className={fieldClass}
                      value={draft.businessType}
                      onChange={(e) => patch({ businessType: e.target.value })}
                      placeholder={t("reg.businessPlaceholder")}
                    />
                  </Field>
                )}

                {draft.occupationStatus === "WAGE_EMPLOYED" && (
                  <Field label={t("reg.sector")}>
                    <input
                      className={fieldClass}
                      value={draft.employmentSector}
                      onChange={(e) => patch({ employmentSector: e.target.value })}
                      placeholder={t("reg.sectorPlaceholder")}
                    />
                  </Field>
                )}

                {draft.occupationStatus === "JOBSEEKER" && (
                  <Field label={t("reg.jobseeking")}>
                    <select
                      className={fieldClass}
                      value={draft.jobseekerDuration}
                      onChange={(e) => patch({ jobseekerDuration: e.target.value })}
                    >
                      <option value="">{t("reg.select")}</option>
                      {JOBSEEKER_DURATIONS.map((d) => (
                        <option key={d} value={d}>
                          {JOBSEEKER_DURATION_LABELS[d][labelLang]}
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
                <Field
                  label={t("reg.disability")}
                  className="md:col-span-2"
                >
                  <ChoiceList
                    name="disabilityStatus"
                    value={draft.disabilityStatus}
                    onChange={(v) => patch({ disabilityStatus: v })}
                    options={DISABILITY_STATUSES}
                    labels={(v) =>
                      DISABILITY_LABELS[v as keyof typeof DISABILITY_LABELS][labelLang]
                    }
                    columns={3}
                  />
                </Field>

                {draft.disabilityStatus === "YES" && (
                  <Field
                    label={t("reg.disabilityNote")}
                    className="md:col-span-2"
                  >
                    <textarea
                      className={fieldClass}
                      rows={3}
                      value={draft.disabilityNote}
                      onChange={(e) => patch({ disabilityNote: e.target.value })}
                      placeholder={t("reg.disabilityPlaceholder")}
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {t("reg.optionalNote")}
                    </p>
                  </Field>
                )}

                <div className="grid gap-4 rounded-xl border border-border bg-muted/20 p-4 md:col-span-2 md:grid-cols-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground md:col-span-2">
                    {t("reg.background")}
                  </p>

                  <Field
                    label={t("reg.relatives")}
                    className={
                      draft.hasInstitutionalRelatives === "yes"
                        ? ""
                        : "md:col-span-2"
                    }
                  >
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
                      labels={(v) => (v === "yes" ? t("reg.yes") : t("reg.no"))}
                      columns={2}
                    />
                  </Field>

                  {draft.hasInstitutionalRelatives === "yes" && (
                    <Field label={t("reg.industry")}>
                      <input
                        className={fieldClass}
                        value={draft.relativeIndustry}
                        onChange={(e) => patch({ relativeIndustry: e.target.value })}
                        placeholder={t("reg.industryPlaceholder")}
                      />
                    </Field>
                  )}

                  <Field label={t("reg.income")}>
                    <select
                      className={fieldClass}
                      value={draft.familyMonthlyIncomeBand}
                      onChange={(e) =>
                        patch({ familyMonthlyIncomeBand: e.target.value })
                      }
                    >
                      <option value="">{t("reg.preferNot")}</option>
                      {INCOME_BANDS.map((b) => (
                        <option key={b} value={b}>
                          {INCOME_BAND_LABELS[b][labelLang]}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {t("reg.incomeNote")}
                    </p>
                  </Field>

                  <Field label={t("reg.parentEdu")}>
                    <select
                      className={fieldClass}
                      value={draft.parentEducationLevel}
                      onChange={(e) =>
                        patch({ parentEducationLevel: e.target.value })
                      }
                    >
                      <option value="">{t("reg.preferNot")}</option>
                      {PARENT_EDUCATION_LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {PARENT_EDUCATION_LABELS[l][labelLang]}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </>
            )}

            {step === 6 && (
              <>
                <p className="text-sm text-muted-foreground md:col-span-2">
                  {t("reg.passwordIntro")}
                </p>
                <Field label={t("auth.password")}>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${fieldClass} pl-9 pr-10`}
                      placeholder={t("reg.passwordPlaceholder")}
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? t("auth.hidePassword") : t("auth.showPassword")
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
                <Field label={t("reset.confirmLabel")}>
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
                        showConfirm ? t("auth.hidePassword") : t("auth.showPassword")
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
              <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-3.5 py-3 text-sm text-red-700 dark:text-red-400 md:col-span-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2 md:col-span-2">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("auth.back")}
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
                  {t("reg.continue")}
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className={authButtonClass}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("reg.submitting")}
                    </span>
                  ) : (
                    t("reg.signUp")
                  )}
                </button>
              )}
            </div>
          </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {rich("reg.haveAccount", {
          link: (
            <Link href="/auth/login" className={authLinkClass}>
              {t("reg.loginHere")}
            </Link>
          ),
        })}
      </p>
    </AuthShell>
  );
}

/**
 * Display name for an option stored as its English text. The submitted value
 * is unchanged; Bangla digits cover the age bands ("14-16").
 */
function useOptionLabel() {
  const { lang, digits } = useLanguage();
  return (value: string) => (lang === "BN" ? (REGISTRATION_OPTION_BN[value] ?? digits(value)) : value);
}

function Field({
  label,
  children,
  className = "",
  error,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  error?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass}>{label}</span>
      {children}
      {error && (
        <span className="mt-1.5 block text-xs font-medium text-red-600">
          {error}
        </span>
      )}
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
  const optionLabel = useOptionLabel();
  const { t } = useLanguage();
  return (
    <select
      className={fieldClass}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{t("reg.select")}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {optionLabel(o)}
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
  columns,
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
  columns?: 2 | 3;
}) {
  const optionLabel = useOptionLabel();
  const normalised = options.map((o) =>
    typeof o === "string"
      ? { value: o, label: labels ? labels(o) : optionLabel(o) }
      : o
  );
  return (
    <div
      className={
        columns === 3
          ? "grid grid-cols-1 gap-2 sm:grid-cols-3"
          : columns === 2
            ? "grid grid-cols-2 gap-2"
            : "space-y-2"
      }
    >
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
