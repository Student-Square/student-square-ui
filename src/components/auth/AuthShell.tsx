"use client";

import Link from "next/link";
import { Languages } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import AuthBrand from "./AuthBrand";
import AuthCrossBg from "./AuthCrossBg";
import { authCardClass, authLegalClass } from "./auth-ui";

type AuthShellProps = {
  variant: "login" | "register" | "split" | "card";
  children: React.ReactNode;
  className?: string;
  /** card variant width */
  wide?: boolean;
};

export function AuthLegalFooter() {
  const { lang, setLang, t } = useLanguage();
  return (
    <p className="mt-8 text-center text-xs text-gray-500 dark:text-muted-foreground">
      <Link href="/terms" className={authLegalClass}>
        {t("footer.terms")}
      </Link>
      <span className="mx-2 text-gray-300">·</span>
      <Link href="/privacy" className={authLegalClass}>
        {t("footer.privacy")}
      </Link>
      <span className="mx-2 text-gray-300">·</span>
      {/* Auth pages have no site header, so the language switch lives here. */}
      <button
        type="button"
        onClick={() => setLang(lang === "EN" ? "BN" : "EN")}
        aria-label={t("language")}
        className={`${authLegalClass} inline-flex items-center gap-1`}
      >
        <Languages className="h-3 w-3" />
        {lang === "EN" ? "বাংলা" : "English"}
      </button>
    </p>
  );
}

function AuthBrandPanel() {
  const { t, num } = useLanguage();
  return (
    <aside className="relative hidden min-h-full flex-col overflow-hidden bg-gradient-to-br from-[#174f35] via-[#246c46] to-[#3d8b57] px-10 py-10 text-white lg:flex">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[48px] border-white/[0.06]" />
      <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-lime-300/[0.08]" />

      <div className="relative my-auto max-w-md">
        <div className="mx-auto w-fit bg-transparent px-8 py-6">
          <AuthBrand
            variant="hero"
            className="[&_img]:!max-w-[220px] [&_span]:!max-w-[220px]"
          />
        </div>
        <div className="mt-9 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100/80">
            {t("auth.portal")}
          </p>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            {t("auth.heroTitle")}
          </h2>
          <p className="mx-auto mt-5 max-w-sm text-base leading-7 text-emerald-50/75">
            {t("auth.heroBody")}
          </p>
        </div>
      </div>

      <div className="relative flex items-center justify-between text-[11px] text-emerald-100/65">
        <span>© {num(new Date().getFullYear(), false)} {t("common.studentSquare")}</span>
        <span>{t("auth.tagline")}</span>
      </div>
    </aside>
  );
}

export default function AuthShell({
  variant,
  children,
  className = "",
  wide = false,
}: AuthShellProps) {
  if (variant === "login") {
    return (
      <main
        className={`auth-fixed-theme min-h-screen bg-[#f2f6f2] px-4 py-6 sm:px-6 sm:py-10 ${className}`}
      >
        <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xl shadow-emerald-950/[0.08] sm:min-h-[calc(100vh-5rem)] lg:grid-cols-[44%_56%]">
          <AuthBrandPanel />

          <section className="flex flex-col justify-center bg-white px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
            <div className="mb-8 flex justify-center lg:hidden">
              <AuthBrand variant="header" />
            </div>
            <div className="mx-auto w-full max-w-lg">{children}</div>
            <div className="mx-auto w-full max-w-lg">
              <AuthLegalFooter />
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (variant === "register") {
    return (
      <main
        className={`auth-fixed-theme min-h-screen bg-[#f2f6f2] px-4 py-6 sm:px-6 sm:py-10 ${className}`}
      >
        <div className="mx-auto grid h-[calc(100vh-3rem)] w-full max-w-7xl overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xl shadow-emerald-950/[0.08] sm:h-[calc(100vh-5rem)] lg:grid-cols-[36%_64%]">
          <AuthBrandPanel />

          <section className="flex min-h-0 flex-col overflow-y-auto bg-white px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
            <div className="mb-8 flex justify-center lg:hidden">
              <AuthBrand variant="header" />
            </div>
            <div className="mx-auto my-auto w-full max-w-3xl">{children}</div>
            <div className="mx-auto w-full max-w-3xl">
              <AuthLegalFooter />
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (variant === "card") {
    return (
      <main
        className={`auth-fixed-theme relative min-h-screen overflow-hidden px-4 py-8 sm:py-12 ${className}`}
      >
        <AuthCrossBg tone="mint" />

        <div
          className={`relative mx-auto w-full ${wide ? "max-w-4xl lg:max-w-5xl" : "max-w-md"} space-y-6`}
        >
          <div className="flex justify-center pt-2">
            <AuthBrand variant="header" className="drop-shadow-sm" />
          </div>
          <div className={authCardClass}>{children}</div>
          <AuthLegalFooter />
        </div>
      </main>
    );
  }

  return (
    <main
      className={`auth-fixed-theme min-h-screen border-t-2 border-[#4caf50] bg-white dark:bg-background ${className}`}
    >
      <div className="mx-auto grid min-h-screen w-full max-w-6xl lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="hidden items-center justify-end bg-white px-8 py-12 dark:bg-background lg:flex">
          <div className="w-full max-w-sm">
            <AuthBrand variant="hero" />
          </div>
        </aside>

        <div className="flex flex-col justify-center bg-white px-6 py-10 dark:bg-background sm:px-10 lg:px-8">
          <div className="mb-8 flex justify-center lg:hidden">
            <AuthBrand variant="header" />
          </div>
          <div className="w-full max-w-md">{children}</div>
          <div className="w-full max-w-md">
            <AuthLegalFooter />
          </div>
        </div>
      </div>
    </main>
  );
}
