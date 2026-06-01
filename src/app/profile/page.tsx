"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { motion } from "motion/react";
import { selectCurrentUser, selectAuthStatus } from "@/redux/features/auth/authSlice";
import { useUpdateProfileMutation, useUploadAvatarMutation } from "@/redux/features/profile/profileApi";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { Camera, Check, KeyRound, Loader2, Save, User } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const status = useSelector(selectAuthStatus);

  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
  const [changePassword, { isLoading: isChangingPw }] = useChangePasswordMutation();

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [university, setUniversity] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  // Populate from store
  useEffect(() => {
    if (!user?.profile) return;
    setBio(user.profile.bio ?? "");
    setPhone(user.profile.phone ?? "");
    setCity(user.profile.city ?? "");
    setCountry(user.profile.country ?? "");
    setUniversity(user.profile.university ?? "");
  }, [user]);

  if (status === "idle" || status === "loading") {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </main>
    );
  }
  if (!user) return null;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await uploadAvatar(form).unwrap();
      toast.success("Avatar updated");
      // Update is reflected via cache invalidation (Profile + Auth tags)
      void res;
    } catch {
      /* baseApi toasts */
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ bio, phone, city, country, university }).unwrap();
      setProfileSaved(true);
      toast.success("Profile saved");
      setTimeout(() => setProfileSaved(false), 2000);
    } catch {
      /* baseApi toasts */
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) { toast.error("New password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match."); return; }
    try {
      await changePassword({ oldPassword, newPassword }).unwrap();
      setPwSaved(true);
      toast.success("Password changed");
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      setTimeout(() => setPwSaved(false), 2000);
    } catch {
      /* baseApi toasts */
    }
  };

  const initials = user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="mt-12 sm:mt-14 lg:mt-16">
        {/* Hero band */}
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-700 h-32 sm:h-40 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent_60%)]" />
        </div>

        <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-8">
          {/* Avatar — overlaps hero */}
          <div className="-mt-14 sm:-mt-16 mb-6 flex items-end gap-5">
            <div className="relative shrink-0">
              <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl overflow-hidden ring-4 ring-background bg-muted shadow-xl">
                {user.profile?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.profile.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground bg-muted">
                    {initials}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-background border border-border shadow flex items-center justify-center text-muted-foreground hover:text-emerald-600 hover:border-emerald-500 transition-colors"
                aria-label="Change avatar"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </button>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div className="pb-2 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight truncate">{user.fullName}</h1>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                {user.role.replace(/_/g, " ")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pb-20">
            {/* Profile form */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-3 rounded-2xl border border-border bg-card/60 p-6"
            >
              <div className="flex items-center gap-2.5 mb-6">
                <span className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                  <User className="h-4 w-4 text-emerald-600" />
                </span>
                <h2 className="text-base font-bold text-foreground">Profile Information</h2>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <Field label="Full name">
                  <input type="text" value={user.fullName} disabled className="form-input opacity-60 cursor-not-allowed" />
                </Field>
                <Field label="Email">
                  <input type="email" value={user.email} disabled className="form-input opacity-60 cursor-not-allowed" />
                </Field>
                <Field label="University / Institution">
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. University of Dhaka"
                    className="form-input"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="City">
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Dhaka" className="form-input" />
                  </Field>
                  <Field label="Country">
                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Bangladesh" className="form-input" />
                  </Field>
                </div>
                <Field label="Phone">
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880 1700 000000" className="form-input" />
                </Field>
                <Field label="Bio">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={5}
                    placeholder="Tell us about yourself…"
                    className="form-input resize-none"
                  />
                </Field>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : profileSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                    {profileSaved ? "Saved!" : "Save changes"}
                  </button>
                </div>
              </form>
            </motion.section>

            {/* Right column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Change password */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="rounded-2xl border border-border bg-card/60 p-6"
              >
                <div className="flex items-center gap-2.5 mb-6">
                  <span className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                    <KeyRound className="h-4 w-4 text-amber-600" />
                  </span>
                  <h2 className="text-base font-bold text-foreground">Change Password</h2>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-3">
                  <Field label="Current password">
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      className="form-input"
                    />
                  </Field>
                  <Field label="New password">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="Min 8 characters"
                      className="form-input"
                    />
                  </Field>
                  <Field label="Confirm new password">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="form-input"
                    />
                  </Field>
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isChangingPw}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors disabled:opacity-60 w-full justify-center"
                    >
                      {isChangingPw ? <Loader2 className="h-4 w-4 animate-spin" /> : pwSaved ? <Check className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />}
                      {pwSaved ? "Password changed!" : "Update password"}
                    </button>
                  </div>
                </form>
              </motion.section>

              {/* Quick links */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="rounded-2xl border border-border bg-card/60 p-4 space-y-1"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 mb-2">Quick links</p>
                <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                  ← Back to site
                </Link>
                {["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(user.role) && (
                  <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                    Admin dashboard
                  </Link>
                )}
                <Link href="/about/who-we-are" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                  Who We Are
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        :global(.form-input) {
          display: block; width: 100%; font-size: 0.875rem;
          padding: 0.5rem 0.75rem; border-radius: 0.75rem;
          background: var(--color-background); border: 1px solid var(--color-border);
          color: var(--color-foreground);
        }
        :global(.form-input:focus) {
          outline: none; border-color: rgb(16 185 129 / 0.6);
          box-shadow: 0 0 0 2px rgb(16 185 129 / 0.15);
        }
        :global(.form-input:disabled) {
          background: var(--color-muted);
        }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}
