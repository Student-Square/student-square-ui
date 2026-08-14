"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { motion } from "motion/react";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useUpdateProfileMutation, useUploadAvatarMutation } from "@/redux/features/profile/profileApi";
import {
  Camera,
  Check,
  ChevronRight,
  Loader2,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import { getInitials } from "@/lib/utils";

export default function AdminProfilePage() {
  const user = useSelector(selectCurrentUser);

  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();

  const avatarInputRef = useRef<HTMLInputElement>(null);

  /* ── profile fields ── */
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [profession, setProfession] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (!user?.profile) return;
    setBio(user.profile.bio ?? "");
    setPhone(user.profile.phone ?? "");
    setCity(user.profile.city ?? "");
    setCountry(user.profile.country ?? "");
    setCurrentAddress(user.profile.currentAddress ?? "");
    setUniversity(user.profile.university ?? "");
    setDepartment(user.profile.department ?? "");
    setProfession(user.profile.profession ?? "");
    setWorkplace(user.profile.workplace ?? "");
  }, [user]);

  if (!user) return null;

  const initials = getInitials(user.fullName);

  /* ── handlers ── */
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    try {
      await uploadAvatar(form).unwrap();
      toast.success("Avatar updated");
    } catch { /* baseApi toasts */ }
    e.target.value = "";
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const f = (v: string) => v.trim() || undefined;
    try {
      await updateProfile({
        bio: f(bio),
        phone: f(phone),
        city: f(city),
        country: f(country),
        currentAddress: f(currentAddress),
        university: f(university),
        department: f(department),
        profession: f(profession),
        workplace: f(workplace),
      }).unwrap();
      setProfileSaved(true);
      toast.success("Profile saved");
      setTimeout(() => setProfileSaved(false), 2000);
    } catch { /* baseApi toasts */ }
  };

  return (
    <div className="space-y-8 max-w-4xl 2xl:max-w-none">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your avatar and personal information.
        </p>
      </div>

      {/* Identity card */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="h-20 w-20 rounded-2xl overflow-hidden bg-muted ring-2 ring-border shadow-sm">
            {user.profile?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.profile.avatarUrl}
                alt={user.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xl font-bold text-muted-foreground">
                {initials}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={isUploading}
            aria-label="Change avatar"
            className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-full bg-emerald-600 border-2 border-background shadow-md flex items-center justify-center text-white hover:bg-emerald-700 transition-colors disabled:opacity-60"
          >
            {isUploading
              ? <Loader2 className="h-3 w-3 animate-spin" />
              : <Camera className="h-3 w-3" />}
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Info */}
        <div className="text-center sm:text-left min-w-0">
          <p className="text-lg font-bold text-foreground">{user.fullName}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
            <span className="inline-flex text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {user.role.replace(/_/g, " ")}
            </span>
            {user.emailVerifiedAt && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                <Check className="h-2.5 w-2.5" /> Verified
              </span>
            )}
          </div>
        </div>

        {/* Upload hint */}
        <p className="hidden sm:block ml-auto text-xs text-muted-foreground self-end">
          Click the camera icon to change your photo.
        </p>
      </div>

      {/* Security lives in Settings — one place for MFA and password. */}
      <Link
        href="/admin/settings"
        className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm hover:bg-muted/50 transition-colors"
      >
        <span className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-foreground">Security</span>
          <span className="block text-xs text-muted-foreground">
            Password and two-factor authentication moved to Settings.
          </span>
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </Link>

      <div>
        {/* ── Profile form ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <span className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-emerald-600" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-foreground">Personal Information</h2>
              <p className="text-xs text-muted-foreground">Update your public profile details.</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Read-only */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full name">
                <input
                  type="text"
                  value={user.fullName}
                  disabled
                  className="field-input opacity-60 cursor-not-allowed"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="field-input opacity-60 cursor-not-allowed"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Profession">
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="field-input"
                />
              </Field>
              <Field label="Workplace (optional)">
                <input
                  type="text"
                  value={workplace}
                  onChange={(e) => setWorkplace(e.target.value)}
                  placeholder="e.g. Google, Self-employed"
                  className="field-input"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Institution">
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="University / College / School"
                  className="field-input"
                />
              </Field>
              <Field label="Department">
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="field-input"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="City">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Dhaka"
                  className="field-input"
                />
              </Field>
              <Field label="Country">
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Bangladesh"
                  className="field-input"
                />
              </Field>
            </div>

            <Field label="Address">
              <input
                type="text"
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
                placeholder="e.g. House 12, Road 5, Dhanmondi, Dhaka"
                className="field-input"
              />
            </Field>

            <Field label="Phone">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1700 000000"
                className="field-input"
              />
            </Field>

            <Field label="Bio">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Tell the community a little about yourself…"
                className="field-input resize-none"
              />
            </Field>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60 shadow-sm"
            >
              {isSaving
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : profileSaved
                ? <Check className="h-4 w-4" />
                : <Save className="h-4 w-4" />}
              {profileSaved ? "Saved!" : "Save changes"}
            </button>
          </form>
        </motion.section>

      </div>

      <style jsx>{`
        :global(.field-input) {
          display: block;
          width: 100%;
          font-size: 0.875rem;
          padding: 0.5rem 0.75rem;
          border-radius: 0.625rem;
          background: var(--color-background);
          border: 1px solid var(--color-border);
          color: var(--color-foreground);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        :global(.field-input:focus) {
          outline: none;
          border-color: rgb(16 185 129 / 0.7);
          box-shadow: 0 0 0 3px rgb(16 185 129 / 0.12);
        }
        :global(.field-input:disabled) {
          background: var(--color-muted);
        }
      `}</style>
    </div>
  );
}

/* ── Field wrapper ── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
