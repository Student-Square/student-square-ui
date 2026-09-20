"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  useAdminGetUserQuery,
  useAdminUpdateUserMutation,
  useAdminDeactivateUserMutation,
  useAdminReactivateUserMutation,
} from "@/redux/features/users/usersApi";
import { selectCurrentUser, selectUserRole } from "@/redux/features/auth/authSlice";
import { canSeeRole } from "@/lib/roleRank";
import type { UserRole, UserStatus } from "@/types/auth";
import { ArrowLeft, Loader2, UserCheck, UserX } from "lucide-react";

const ROLE_OPTIONS: Array<{ value: UserRole; label: string }> = [
  { value: "MEMBER", label: "Member" },
  { value: "COUNSELLOR", label: "Counsellor" },
  { value: "MENTOR", label: "Mentor" },
  { value: "AUTHOR", label: "Author" },
  { value: "EDITOR", label: "Editor" },
  { value: "MODERATOR", label: "Moderator" },
  { value: "FINANCE_MANAGER", label: "Finance Manager" },
  { value: "HR_MANAGER", label: "HR Manager" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "SYSTEM_ADMIN", label: "System Admin" },
];

const canAssign = canSeeRole;

const STATUS_OPTIONS: Array<{ value: UserStatus; label: string }> = [
  { value: "ACTIVE", label: "Active" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "PENDING_VERIFICATION", label: "Pending verification" },
];

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const me = useSelector(selectCurrentUser);
  const callerRole = useSelector(selectUserRole) as UserRole;
  const isSelf = me?.id === id;

  const { data: user, isLoading, isError } = useAdminGetUserQuery(id);
  const [updateUser, { isLoading: isSaving }] = useAdminUpdateUserMutation();
  const [deactivate] = useAdminDeactivateUserMutation();
  const [reactivate] = useAdminReactivateUserMutation();

  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [status, setStatus] = useState<UserStatus>("ACTIVE");

  useEffect(() => {
    if (!user) return;
    setFullName(user.fullName);
    setRole(user.role);
    setStatus(user.status);
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { toast.error("Full name is required."); return; }
    try {
      await updateUser({ id, data: { fullName: fullName.trim(), role, status } }).unwrap();
      toast.success("User updated");
    } catch { /* baseApi toasts */ }
  };

  const handleDeactivate = async () => {
    if (isSelf) { toast.error("You cannot deactivate yourself."); return; }
    if (!confirm("Deactivate this user?")) return;
    try { await deactivate(id).unwrap(); toast.success("User deactivated"); } catch { /* */ }
  };

  const handleReactivate = async () => {
    try { await reactivate(id).unwrap(); toast.success("User reactivated"); } catch { /* */ }
  };

  if (isLoading) return <div className="animate-pulse h-8 w-48 bg-muted rounded" />;
  if (isError || !user) return <p className="text-sm text-red-600">User not found.</p>;

  return (
    <>
      <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-emerald-600 transition-colors mb-5">
        <ArrowLeft className="h-4 w-4" /> Back to users
      </Link>

      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{user.fullName}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
        </div>
        {!isSelf && (
          user.status === "ACTIVE" ? (
            <button
              type="button"
              onClick={handleDeactivate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 text-red-700 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <UserX className="h-4 w-4" /> Deactivate
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReactivate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-300 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              <UserCheck className="h-4 w-4" /> Reactivate
            </button>
          )
        )}
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Member ID", value: user.memberId ?? "—" },
          { label: "Phone", value: user.profile?.phone ?? "—" },
          { label: "Created", value: new Date(user.createdAt).toLocaleDateString() },
          { label: "Last login", value: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "—" },
          { label: "Verified", value: user.emailVerifiedAt ? new Date(user.emailVerifiedAt).toLocaleDateString() : "Not verified" },
          { label: "Slug", value: user.slug ?? "—" },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-border bg-card/40 px-4 py-3">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">{m.label}</p>
            <p className="text-sm font-semibold text-foreground truncate">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Foundation registration — only members have answered this. */}
      {user.memberProfile && (
        <div className="mb-8 space-y-5">
          <div>
            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Foundation registration
            </h2>
            <p className="text-xs text-muted-foreground">
              Everything this member filled in when they signed up
              {user.memberProfile.completedAt
                ? ` · ${new Date(user.memberProfile.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
                : ""}
              . They can correct it themselves from their profile.
            </p>
          </div>

          <RegGroup title="Identity and contact">
            <Reg label="Name in Bangla" value={user.fullNameBn} />
            <Reg label="Phone" value={user.memberProfile.phone} />
            <Reg label="Address" value={user.memberProfile.address} />
            <Reg label="Age band" value={user.memberProfile.ageBand} />
            <Reg label="Gender" value={user.memberProfile.gender} />
            <Reg label="Home district" value={user.memberProfile.homeDistrict} />
            <Reg
              label="Preferred language"
              value={user.preferredLocale === "bn" ? "Bangla" : "English"}
            />
          </RegGroup>

          {user.isMinor && (
            <RegGroup title="Guardian">
              <Reg label="Guardian name" value={user.guardianName} />
              <Reg label="Guardian phone" value={user.guardianPhone} />
              <Reg
                label="Consent recorded"
                value={
                  user.guardianConsentAt
                    ? new Date(user.guardianConsentAt).toLocaleDateString("en-GB")
                    : null
                }
              />
            </RegGroup>
          )}

          <RegGroup title="Education">
            <Reg label="Study level" value={user.memberProfile.studyLevel} />
            <Reg
              label="Institution type"
              value={
                user.memberProfile.institutionType === "Other"
                  ? user.memberProfile.institutionTypeOther || "Other"
                  : user.memberProfile.institutionType
              }
            />
            <Reg label="Institution" value={user.memberProfile.institutionName} />
            <Reg label="Field of study" value={user.memberProfile.fieldOfStudy} />
            <Reg label="Subject / department" value={user.memberProfile.subjectDepartment} />
            <Reg label="Feeling about subject" value={user.memberProfile.subjectFeeling} />
            <Reg label="Why" value={user.memberProfile.subjectFeelingWhy} />
            <Reg
              label="Faced subject confusion"
              value={regYesNo(user.memberProfile.facedSubjectConfusion)}
            />
            <Reg label="Regrets subject" value={regYesNo(user.memberProfile.regretsSubject)} />
            <Reg label="Why" value={user.memberProfile.regretsSubjectWhy} />
          </RegGroup>

          <RegGroup title="Work">
            <Reg label="Occupation" value={regPretty(user.memberProfile.occupationStatus)} />
            <Reg label="Employment sector" value={user.memberProfile.employmentSector} />
            <Reg label="Business type" value={user.memberProfile.businessType} />
            <Reg
              label="Jobseeking for"
              value={regPretty(user.memberProfile.jobseekerDuration)}
            />
          </RegGroup>

          <RegGroup title="Background">
            <Reg
              label="Disability status"
              value={regPretty(user.memberProfile.disabilityStatus)}
            />
            <Reg label="Note" value={user.memberProfile.disabilityNote} />
            <Reg
              label="Relatives in institutions"
              value={regYesNo(user.memberProfile.hasInstitutionalRelatives)}
            />
            <Reg label="Their industry" value={user.memberProfile.relativeIndustry} />
            <Reg
              label="Family monthly income"
              value={regPretty(user.memberProfile.familyMonthlyIncomeBand)}
            />
            <Reg
              label="Parents' education"
              value={regPretty(user.memberProfile.parentEducationLevel)}
            />
          </RegGroup>
        </div>
      )}

      <form onSubmit={handleSave} className="max-w-lg 2xl:max-w-xl space-y-5">
        <Field label="Full name">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="form-input"
          />
        </Field>
        <Field label="Role">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            disabled={!canAssign(callerRole, role)}
            className="form-input"
          >
            {ROLE_OPTIONS.filter((o) => canAssign(callerRole, o.value)).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
            disabled={isSelf}
            className="form-input"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>
        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </button>
          <button type="button" onClick={() => router.back()} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
        </div>
      </form>

      <style jsx>{`
        :global(.form-input) {
          display: block; width: 100%; font-size: 0.875rem;
          padding: 0.5rem 0.75rem; border-radius: 0.5rem;
          background: var(--color-background); border: 1px solid var(--color-border);
          color: var(--color-foreground);
        }
        :global(.form-input:focus) {
          outline: none; border-color: rgb(16 185 129 / 0.6);
          box-shadow: 0 0 0 2px rgb(16 185 129 / 0.15);
        }
      `}</style>
    </>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</span>
      {children}
      {hint && <span className="block mt-1 text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

/* ── Registration record ── */

const regYesNo = (v: boolean | null | undefined) =>
  v === true ? "Yes" : v === false ? "No" : null;

/** Stored enums are SCREAMING_SNAKE; read them as words. */
const regPretty = (v: string | null | undefined) =>
  v ? v.replace(/_/g, " ").toLowerCase() : null;

function RegGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">
        {title}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{children}</div>
    </div>
  );
}

function Reg({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="rounded-lg border border-border bg-card/40 px-4 py-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground break-words first-letter:uppercase">
        {value?.trim() ? value : "—"}
      </p>
    </div>
  );
}
