"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/redux/features/auth/authSlice";
import { pickPostLoginDestination } from "@/lib/auth-routing";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";

// useSearchParams must be wrapped in <Suspense> in Next.js App Router
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Loading…</p>
    </main>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next"); // may be null

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Single source of redirect: once we know who the user is, route by role.
  // - Direct visit to /auth/login when already signed in → immediate redirect
  // - After successful submit → login mutation populates the store, this fires
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(pickPostLoginDestination(user.role, next));
    }
  }, [isAuthenticated, user, next, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!email.trim() || !password) {
      setFormError("Email and password are required.");
      return;
    }
    try {
      await login({ email: email.trim(), password }).unwrap();
      toast.success("Welcome back!");
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Something went wrong. Please try again.";
      setFormError(msg);
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10 sm:py-16 relative overflow-hidden">
      {/* Decorative backdrop */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-background dark:from-emerald-950/40 dark:via-background dark:to-background" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-emerald-600/10 dark:bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-emerald-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Student Square
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card shadow-xl shadow-emerald-500/5 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to your Student Square account.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email */}
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Email
              </span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-background border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                />
              </div>
            </label>

            {/* Password */}
            <label className="block">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Password
                </span>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg bg-background border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </label>

            {/* Inline error */}
            {formError && (
              <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-3.5 py-3 text-sm text-red-700 dark:text-red-400">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
