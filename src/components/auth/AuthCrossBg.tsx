type AuthCrossBgProps = {
  /** mint = signup page; light = login panel; subtle = full-page wash */
  tone?: "mint" | "light" | "subtle";
  className?: string;
};

/** SS logo–inspired cross grid + soft gradients for auth screens. */
export default function AuthCrossBg({
  tone = "subtle",
  className = "",
}: AuthCrossBgProps) {
  const gradient =
    tone === "mint"
      ? "from-[#c5e1b5] via-[#dcefd4] to-[#b2dfaa]"
      : tone === "light"
        ? "from-[#eef8ec] via-white to-[#f4fbf2]"
        : "from-[#edf7eb]/90 via-white/95 to-[#e8f5e9]/80";

  const patternOpacity =
    tone === "mint" ? "opacity-[0.11]" : tone === "light" ? "opacity-[0.08]" : "opacity-[0.05]";

  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      <svg
        className={`absolute inset-0 h-full w-full ${patternOpacity}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="ss-auth-cross"
            width="72"
            height="72"
            patternUnits="userSpaceOnUse"
          >
            <rect x="22" y="22" width="28" height="28" fill="#388e3c" rx="1" />
            <rect
              x="22"
              y="22"
              width="28"
              height="28"
              fill="#d32f2f"
              rx="1"
              transform="rotate(45 36 36)"
            />
            <circle cx="36" cy="36" r="5" fill="#c62828" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ss-auth-cross)" />
      </svg>

      <div className="absolute -right-20 top-0 h-[28rem] w-[28rem] rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-lime-200/30 blur-3xl" />
      <div className="absolute right-1/3 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-red-200/10 blur-3xl" />
    </div>
  );
}
