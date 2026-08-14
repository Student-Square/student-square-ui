import Image from "next/image";
import Link from "next/link";

/** Org logo on auth screens — links home like the main site header. */
export default function AuthBrand({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 ${className}`}
      aria-label="Student Square home"
    >
      <Image
        src="/images/ss-logo.png"
        alt="Student Square"
        width={160}
        height={44}
        className="h-10 w-auto sm:h-11"
        priority
      />
    </Link>
  );
}
