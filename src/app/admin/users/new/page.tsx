"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAdminCreateUserMutation } from "@/redux/features/users/usersApi";
import type { UserRole } from "@/types/auth";
import { ArrowLeft, Copy, Loader2 } from "lucide-react";

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
];

export default function AdminNewUserPage() {
  const router = useRouter();
  const [createUser, { isLoading }] = useAdminCreateUserMutation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [created, setCreated] = useState<{ id: string; fullName: string; email: string; temporaryPassword: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || password.length < 8) {
      toast.error("Please fill in all required fields (password min 8 chars).");
      return;
    }
    try {
      const result = await createUser({ fullName: fullName.trim(), email: email.trim(), password, role }).unwrap();
      setCreated({ id: result.user.id, fullName: result.user.fullName, email: result.user.email, temporaryPassword: result.temporaryPassword });
      toast.success("User created");
    } catch { /* baseApi toasts */ }
  };

  if (created) {
    return (
      <>
        <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-emerald-600 transition-colors mb-5">
          <ArrowLeft className="h-4 w-4" /> Back to users
        </Link>
        <div className="max-w-lg rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-6">
          <h1 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-1">User created</h1>
          <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">
            Share these credentials with <strong>{created.fullName}</strong> ({created.email}). The password is shown only once.
          </p>
          <div className="rounded-lg bg-white dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 font-mono text-sm flex items-center justify-between gap-3">
            <span className="break-all">{created.temporaryPassword}</span>
            <button
              type="button"
              onClick={() => { navigator.clipboard?.writeText(created.temporaryPassword); toast.success("Copied"); }}
              className="shrink-0 p-1.5 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-5 flex gap-3">
            <Link
              href={`/admin/users/${created.id}`}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              View user
            </Link>
            <Link
              href="/admin/users"
              className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors"
            >
              Back to list
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-emerald-600 transition-colors mb-5">
        <ArrowLeft className="h-4 w-4" /> Back to users
      </Link>
      <h1 className="text-2xl font-bold text-foreground mb-6">New user</h1>

      <form onSubmit={handleSubmit} className="max-w-lg 2xl:max-w-xl space-y-5">
        <Field label="Full name *">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nusrat Jahan"
            required
            className="form-input"
          />
        </Field>
        <Field label="Email *">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nusrat@example.com"
            required
            className="form-input"
          />
        </Field>
        <Field label="Temporary password *" hint="Min 8 characters. Share this once — it won't be shown again.">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ChangeMe123!"
            required
            minLength={8}
            className="form-input font-mono"
          />
        </Field>
        <Field label="Role">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="form-input"
          >
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>
        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Create user
          </button>
          <Link href="/admin/users" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </Link>
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
