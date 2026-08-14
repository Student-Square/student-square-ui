import Link from "next/link";
import AuthBrand from "./AuthBrand";
import { authLegalClass } from "./auth-ui";

type AuthShellProps = {
  /** split = login-style two columns; card = signup-style green backdrop + white card */
  variant: "split" | "card";
  children: React.ReactNode;
  className?: string;
  /** card variant width */
  wide?: boolean;
};

export function AuthLegalFooter() {
  return (
    <p className="mt-8 text-center text-xs text-muted-foreground">
      <Link href="/terms" className={authLegalClass}>
        Terms of use
      </Link>
      <span className="mx-2">·</span>
      <Link href="/privacy" className={authLegalClass}>
        Privacy Policy
      </Link>
    </p>
  );
}

export default function AuthShell({
  variant,
  children,
  className = "",
  wide = false,
}: AuthShellProps) {
  if (variant === "card") {
    return (
      <main
        className={`min-h-screen bg-[#e8f5e9] px-4 py-8 sm:py-12 dark:bg-emerald-950/30 ${className}`}
      >
        <div
          className={`mx-auto w-full ${wide ? "max-w-4xl lg:max-w-5xl" : "max-w-md"} space-y-6`}
        >
          <div className="flex justify-center">
            <AuthBrand variant="header" />
          </div>
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-border dark:bg-card">
            {children}
          </div>
          <AuthLegalFooter />
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen bg-white dark:bg-background ${className}`}>
      <div className="grid min-h-screen lg:grid-cols-2">
        <aside className="hidden flex-col items-center justify-center border-r border-gray-100 bg-white px-10 py-12 dark:border-border lg:flex">
          <AuthBrand variant="hero" />
        </aside>

        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-16 xl:px-20">
          <div className="mb-8 flex justify-center lg:hidden">
            <AuthBrand variant="header" />
          </div>
          <div className="mx-auto w-full max-w-md">{children}</div>
          <div className="mx-auto w-full max-w-md">
            <AuthLegalFooter />
          </div>
        </div>
      </div>
    </main>
  );
}
