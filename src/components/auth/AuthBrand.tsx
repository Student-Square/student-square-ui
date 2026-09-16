"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type AuthBrandProps = {
  className?: string;
  /** hero = large logo + tagline for split login panel */
  variant?: "header" | "hero";
};

/** Org logo on auth screens — links home like the main site header. */
export default function AuthBrand({
  className = "",
  variant = "header",
}: AuthBrandProps) {
  const { t } = useLanguage();
  const isHero = variant === "hero";

  return (
    <Link
      href="/"
      className={`inline-flex flex-col items-center shrink-0 ${className}`}
      aria-label={t("auth.brandHome")}
    >
      <Image
        src="/images/ss-logo.png"
        alt={t("common.studentSquare")}
        width={isHero ? 340 : 200}
        height={isHero ? 128 : 56}
        className={
          isHero
            ? "h-auto w-full max-w-[300px] drop-shadow-sm sm:max-w-[340px]"
            : "h-11 w-auto sm:h-12"
        }
        priority
      />
      {isHero && (
        <span className="mt-6 w-full max-w-[300px] bg-gradient-to-r from-[#388e3c] to-[#43a047] px-4 py-2 text-center text-[11px] font-bold tracking-[0.32em] text-white shadow-md shadow-emerald-900/15 sm:max-w-[340px] sm:text-xs">
          {t("auth.brandTagline")}
        </span>
      )}
    </Link>
  );
}
