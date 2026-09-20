"use client";

import { useEffect, useRef, useState } from "react";
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
  type OccupationStatus,
} from "@/lib/registration";
import type { ApiMe } from "@/types/auth";
import type { MembershipUpdateInput } from "@/types/profile";

/**
 * The registration answers, as fields inside Personal Information.
 *
 * They are not a separate card or tab on purpose: a member looking for "my
 * details" should find all of them in one place, whether the answer was given
 * during signup or typed in afterwards. So this exports the fields and a draft
 * hook, and the profile page owns the form, the Save button and the layout
 * around them.
 */

export type MembershipDraft = MembershipUpdateInput;

// Tolerates a null user: the hook runs before the page's "not signed in yet"
// guard, so it must survive the first render with nothing loaded.
const draftFrom = (user: ApiMe | null | undefined): MembershipDraft => {
  const m = user?.memberProfile;
  return {
    fullNameBn: user?.fullNameBn ?? null,
    preferredLocale: (user?.preferredLocale ?? "en") as "en" | "bn",
    guardianName: user?.guardianName ?? null,
    guardianPhone: user?.guardianPhone ?? null,

    phone: m?.phone ?? "",
    address: m?.address ?? "",
    ageBand: m?.ageBand ?? "",
    gender: m?.gender ?? "",
    homeDistrict: m?.homeDistrict ?? "",

    studyLevel: m?.studyLevel ?? "",
    institutionType: m?.institutionType ?? "",
    institutionTypeOther: m?.institutionTypeOther ?? null,
    institutionName: m?.institutionName ?? "",
    fieldOfStudy: m?.fieldOfStudy ?? "",
    subjectDepartment: m?.subjectDepartment ?? "",
    subjectFeeling: m?.subjectFeeling ?? "",
    subjectFeelingWhy: m?.subjectFeelingWhy ?? null,
    facedSubjectConfusion: m?.facedSubjectConfusion ?? false,
    regretsSubject: m?.regretsSubject ?? null,
    regretsSubjectWhy: m?.regretsSubjectWhy ?? null,

    occupationStatus: m?.occupationStatus ?? "",
    employmentSector: m?.employmentSector ?? null,
    businessType: m?.businessType ?? null,
    jobseekerDuration: m?.jobseekerDuration ?? null,

    disabilityStatus: m?.disabilityStatus ?? "",
    disabilityNote: m?.disabilityNote ?? null,
    hasInstitutionalRelatives: m?.hasInstitutionalRelatives ?? null,
    relativeIndustry: m?.relativeIndustry ?? null,
    familyMonthlyIncomeBand: m?.familyMonthlyIncomeBand ?? null,
    parentEducationLevel: m?.parentEducationLevel ?? null,
  };
};

/** "" and null both mean empty here, so an untouched blank is not a change. */
const isEmpty = (v: unknown) => v === "" || v === null || v === undefined;

/**
 * Draft state for the registration half of the profile form.
 *
 * `buildPatch` returns only what changed, because the endpoint is a PATCH and
 * the server applies its cross-field rules to the merged record — sending the
 * whole draft every time would make an untouched field look like an edit.
 */
export function useMembershipDraft(user: ApiMe | null | undefined) {
  const [draft, setDraft] = useState<MembershipDraft>(() => draftFrom(user));
  const stored = useRef<MembershipDraft>(draftFrom(user));

  // Re-seed when the saved record changes (a save refetches /auth/me), the
  // same way the page re-seeds its own profile fields.
  useEffect(() => {
    const next = draftFrom(user);
    stored.current = next;
    setDraft(next);
  }, [user]);

  const set = <K extends keyof MembershipDraft>(
    key: K,
    value: MembershipDraft[K]
  ) => setDraft((d) => ({ ...d, [key]: value }));

  const buildPatch = (): MembershipUpdateInput => {
    const before = stored.current;
    const out: Record<string, unknown> = {};

    if (!user?.memberProfile) {
      // No questionnaire on file — a staff account that never walked the
      // wizard. A diff would send almost nothing, so send the whole draft and
      // let the server create the record in one go.
      for (const [key, value] of Object.entries(draft)) {
        if (!isEmpty(value)) out[key] = value;
      }
    } else {
      for (const key of Object.keys(draft) as (keyof MembershipDraft)[]) {
        const a = draft[key];
        const b = before[key];
        if (isEmpty(a) && isEmpty(b)) continue;
        if (a !== b) out[key] = a;
      }
    }
    // Only meaningful for a minor band with no consent on record; the server
    // ignores it otherwise.
    if (
      Object.keys(out).length > 0 &&
      draft.ageBand &&
      isMinorAgeBand(draft.ageBand) &&
      !user?.guardianConsentAt
    ) {
      out.guardianConsent = true;
    }
    return out as MembershipUpdateInput;
  };

  return { draft, set, buildPatch };
}

export default function MembershipFields({
  user,
  draft,
  set,
}: {
  user: ApiMe;
  draft: MembershipDraft;
  set: <K extends keyof MembershipDraft>(
    key: K,
    value: MembershipDraft[K]
  ) => void;
}) {
  const minor = isMinorAgeBand(draft.ageBand ?? "");
  const branch = OCCUPATION_BRANCH_FIELD[draft.occupationStatus as OccupationStatus];

  return (
    <>
      <Divider
        title="Registration details"
        note={
          user.memberProfile
            ? "What you told us when you signed up. Change anything that is out of date."
            : "Not filled in yet — completing this stores your registration record."
        }
      />

      <Pair>
        <Field label="Name in Bangla">
          <input
            type="text"
            value={draft.fullNameBn ?? ""}
            onChange={(e) => set("fullNameBn", e.target.value || null)}
            className="field-input"
          />
        </Field>
        <Field label="Registered phone">
          <input
            type="tel"
            inputMode="numeric"
            value={draft.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="01XXXXXXXXX"
            className="field-input"
          />
        </Field>
      </Pair>

      <Field label="Registered address">
        <input
          type="text"
          value={draft.address ?? ""}
          onChange={(e) => set("address", e.target.value)}
          className="field-input"
        />
      </Field>

      <Pair>
        <Field label="Age band">
          <Select
            value={draft.ageBand ?? ""}
            onChange={(v) => set("ageBand", v)}
            options={AGE_BANDS}
          />
        </Field>
        <Field label="Gender">
          <Select
            value={draft.gender ?? ""}
            onChange={(v) => set("gender", v)}
            options={GENDERS}
          />
        </Field>
      </Pair>

      <Pair>
        <Field label="Home district">
          <Select
            value={draft.homeDistrict ?? ""}
            onChange={(v) => set("homeDistrict", v)}
            options={HOME_DISTRICTS}
          />
        </Field>
        <Field label="Preferred language">
          <select
            value={draft.preferredLocale ?? "en"}
            onChange={(e) => set("preferredLocale", e.target.value as "en" | "bn")}
            className="field-input"
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
        </Field>
      </Pair>

      {minor && (
        <>
          <Divider
            title="Guardian"
            note="Required for your age band — the Foundation contacts a guardian before anything sensitive."
          />
          <Pair>
            <Field label="Guardian name">
              <input
                type="text"
                value={draft.guardianName ?? ""}
                onChange={(e) => set("guardianName", e.target.value || null)}
                className="field-input"
              />
            </Field>
            <Field label="Guardian phone">
              <input
                type="tel"
                inputMode="numeric"
                value={draft.guardianPhone ?? ""}
                onChange={(e) => set("guardianPhone", e.target.value || null)}
                placeholder="01XXXXXXXXX"
                className="field-input"
              />
            </Field>
          </Pair>
        </>
      )}

      <Divider title="Education" />

      <Pair>
        <Field label="Study level">
          <Select
            value={draft.studyLevel ?? ""}
            onChange={(v) => set("studyLevel", v)}
            options={STUDY_LEVELS}
          />
        </Field>
        <Field label="Institution type">
          <Select
            value={draft.institutionType ?? ""}
            onChange={(v) => set("institutionType", v)}
            options={INSTITUTION_TYPES}
          />
        </Field>
      </Pair>

      {draft.institutionType === "Other" && (
        <Field label="Which type?">
          <input
            type="text"
            value={draft.institutionTypeOther ?? ""}
            onChange={(e) => set("institutionTypeOther", e.target.value || null)}
            className="field-input"
          />
        </Field>
      )}

      <Pair>
        <Field label="Institution name">
          <input
            type="text"
            value={draft.institutionName ?? ""}
            onChange={(e) => set("institutionName", e.target.value)}
            className="field-input"
          />
        </Field>
        <Field label="Field of study">
          <Select
            value={draft.fieldOfStudy ?? ""}
            onChange={(v) => set("fieldOfStudy", v)}
            options={FIELDS_OF_STUDY}
          />
        </Field>
      </Pair>

      <Pair>
        <Field label="Subject / department">
          <input
            type="text"
            value={draft.subjectDepartment ?? ""}
            onChange={(e) => set("subjectDepartment", e.target.value)}
            className="field-input"
          />
        </Field>
        <Field label="How you feel about it">
          <Select
            value={draft.subjectFeeling ?? ""}
            onChange={(v) => set("subjectFeeling", v)}
            options={SUBJECT_FEELINGS}
          />
        </Field>
      </Pair>

      <Field label="Why (optional)">
        <textarea
          rows={2}
          value={draft.subjectFeelingWhy ?? ""}
          onChange={(e) => set("subjectFeelingWhy", e.target.value || null)}
          className="field-input resize-none"
        />
      </Field>

      <Pair>
        <Field label="Faced confusion choosing it">
          <BoolSelect
            value={draft.facedSubjectConfusion ?? false}
            onChange={(v) => set("facedSubjectConfusion", v ?? false)}
            allowUnset={false}
          />
        </Field>
        <Field label="Regret the choice">
          <BoolSelect
            value={draft.regretsSubject ?? null}
            onChange={(v) => set("regretsSubject", v)}
          />
        </Field>
      </Pair>

      {draft.regretsSubject === true && (
        <Field label="Why (optional)">
          <textarea
            rows={2}
            value={draft.regretsSubjectWhy ?? ""}
            onChange={(e) => set("regretsSubjectWhy", e.target.value || null)}
            className="field-input resize-none"
          />
        </Field>
      )}

      <Divider
        title="Work"
        note="Changing your status clears the previous status's follow-up answer."
      />

      <Pair>
        <Field label="Occupation status">
          <select
            value={draft.occupationStatus ?? ""}
            onChange={(e) => set("occupationStatus", e.target.value)}
            className="field-input"
          >
            <option value="" disabled>
              Choose…
            </option>
            {OCCUPATION_STATUSES.map((o) => (
              <option key={o} value={o}>
                {OCCUPATION_LABELS[o].en}
              </option>
            ))}
          </select>
        </Field>
        {branch === "employmentSector" && (
          <Field label="Employment sector">
            <input
              type="text"
              value={draft.employmentSector ?? ""}
              onChange={(e) => set("employmentSector", e.target.value || null)}
              className="field-input"
            />
          </Field>
        )}
        {branch === "businessType" && (
          <Field label="Business type">
            <input
              type="text"
              value={draft.businessType ?? ""}
              onChange={(e) => set("businessType", e.target.value || null)}
              className="field-input"
            />
          </Field>
        )}
        {branch === "jobseekerDuration" && (
          <Field label="Looking for how long">
            <select
              value={draft.jobseekerDuration ?? ""}
              onChange={(e) => set("jobseekerDuration", e.target.value || null)}
              className="field-input"
            >
              <option value="">—</option>
              {JOBSEEKER_DURATIONS.map((d) => (
                <option key={d} value={d}>
                  {JOBSEEKER_DURATION_LABELS[d].en}
                </option>
              ))}
            </select>
          </Field>
        )}
      </Pair>

      <Divider
        title="Background"
        note="Sensitive answers, encrypted at rest. “Prefer not to say” is a full answer."
      />

      <Pair>
        <Field label="Disability status">
          <select
            value={draft.disabilityStatus ?? ""}
            onChange={(e) => set("disabilityStatus", e.target.value)}
            className="field-input"
          >
            <option value="" disabled>
              Choose…
            </option>
            {DISABILITY_STATUSES.map((d) => (
              <option key={d} value={d}>
                {DISABILITY_LABELS[d].en}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Note (optional)">
          <input
            type="text"
            value={draft.disabilityNote ?? ""}
            onChange={(e) => set("disabilityNote", e.target.value || null)}
            className="field-input"
          />
        </Field>
      </Pair>

      <Pair>
        <Field label="Relatives in institutions">
          <BoolSelect
            value={draft.hasInstitutionalRelatives ?? null}
            onChange={(v) => set("hasInstitutionalRelatives", v)}
          />
        </Field>
        <Field label="Their industry">
          <input
            type="text"
            value={draft.relativeIndustry ?? ""}
            onChange={(e) => set("relativeIndustry", e.target.value || null)}
            className="field-input"
          />
        </Field>
      </Pair>

      <Pair>
        <Field label="Family monthly income">
          <select
            value={draft.familyMonthlyIncomeBand ?? ""}
            onChange={(e) => set("familyMonthlyIncomeBand", e.target.value || null)}
            className="field-input"
          >
            <option value="">—</option>
            {INCOME_BANDS.map((b) => (
              <option key={b} value={b}>
                {INCOME_BAND_LABELS[b].en}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Parents' education">
          <select
            value={draft.parentEducationLevel ?? ""}
            onChange={(e) => set("parentEducationLevel", e.target.value || null)}
            className="field-input"
          >
            <option value="">—</option>
            {PARENT_EDUCATION_LEVELS.map((p) => (
              <option key={p} value={p}>
                {PARENT_EDUCATION_LABELS[p].en}
              </option>
            ))}
          </select>
        </Field>
      </Pair>
    </>
  );
}

/* ── Small pieces ── */

function Divider({ title, note }: { title: string; note?: string }) {
  return (
    <div className="border-t border-border pt-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      {note && <p className="mt-0.5 text-[11px] text-muted-foreground">{note}</p>}
    </div>
  );
}

function Pair({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
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
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="field-input"
    >
      <option value="" disabled>
        Choose…
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

/** Yes / No, with "not answered" kept where the column allows it. */
function BoolSelect({
  value,
  onChange,
  allowUnset = true,
}: {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
  allowUnset?: boolean;
}) {
  return (
    <select
      value={value === null ? "" : value ? "yes" : "no"}
      onChange={(e) =>
        onChange(e.target.value === "" ? null : e.target.value === "yes")
      }
      className="field-input"
    >
      {allowUnset && <option value="">Not answered</option>}
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </select>
  );
}
