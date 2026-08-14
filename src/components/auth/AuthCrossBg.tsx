type AuthCrossBgProps = {
  /** mint = signup page; light = login brand panel; subtle = login form wash */
  tone?: "mint" | "light" | "subtle";
  className?: string;
};

/** Soft brand gradients for auth screens. */
export default function AuthCrossBg({
  tone = "subtle",
  className = "",
}: AuthCrossBgProps) {
  const gradient =
    tone === "mint"
      ? "from-[#e7f5e5] via-[#f7fbf6] to-[#d9eed6]"
      : tone === "light"
        ? "from-[#173d2b] via-[#1f6b45] to-[#3f8f55]"
        : "from-[#f4faf3] via-white to-[#edf7eb]";

  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div
        className={`absolute -right-20 -top-24 h-[28rem] w-[28rem] rounded-full blur-3xl ${
          tone === "light" ? "bg-emerald-300/20" : "bg-emerald-300/30"
        }`}
      />
      <div
        className={`absolute -bottom-28 -left-20 h-96 w-96 rounded-full blur-3xl ${
          tone === "light" ? "bg-lime-200/10" : "bg-lime-200/40"
        }`}
      />
      <div className="absolute left-1/2 top-1/3 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
    </div>
  );
}
