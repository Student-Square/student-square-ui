import Link from "next/link";
import AuthBrand from "./AuthBrand";
import AuthCrossBg from "./AuthCrossBg";
import { authCardClass, authLegalClass } from "./auth-ui";

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
    <p className="mt-8 text-center text-xs text-gray-500 dark:text-muted-foreground">
      <Link href="/terms" className={authLegalClass}>
        Terms of use
      </Link>
      <span className="mx-2 text-gray-300">·</span>
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
        className={`relative min-h-screen overflow-hidden px-4 py-8 sm:py-12 ${className}`}
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
    <main className={`relative min-h-screen overflow-hidden ${className}`}>
      <AuthCrossBg tone="subtle" />

      <div className="relative grid min-h-screen lg:grid-cols-2">
        <aside className="relative hidden flex-col items-center justify-center overflow-hidden border-r border-emerald-100/80 px-10 py-12 lg:flex">
          <AuthCrossBg tone="light" />
          <div className="relative z-10">
            <AuthBrand variant="hero" />
          </div>
        </aside>

        <div className="relative flex flex-col justify-center bg-white/75 px-6 py-10 backdrop-blur-[2px] sm:px-10 lg:bg-white/90 lg:px-16 lg:backdrop-blur-none xl:px-20">
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
