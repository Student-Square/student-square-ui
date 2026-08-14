import Image from "next/image";
import Link from "next/link";

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
  const isHero = variant === "hero";

  return (
    <Link
      href="/"
      className={`inline-flex flex-col items-center shrink-0 ${className}`}
      aria-label="Student Square home"
    >
      <Image
        src="/images/ss-logo.png"
        alt="Student Square"
        width={isHero ? 320 : 180}
        height={isHero ? 120 : 52}
        className={
          isHero
            ? "h-auto w-full max-w-[280px] sm:max-w-[320px]"
            : "h-10 w-auto sm:h-12"
        }
        priority
      />
      {isHero && (
        <span className="mt-5 bg-emerald-600 px-5 py-1.5 text-[11px] font-bold tracking-[0.28em] text-white sm:text-xs">
          UNVEILING SUCCESS
        </span>
      )}
    </Link>
  );
}
