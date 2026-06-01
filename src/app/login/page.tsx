import { redirect } from "next/navigation";

/**
 * Friendly alias — anyone typing /login lands on the canonical /auth/login.
 * Preserves the ?next= query string (and any others) on the way through.
 */
export default async function LoginRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") qs.set(key, value);
  }
  const queryString = qs.toString();
  redirect(`/auth/login${queryString ? `?${queryString}` : ""}`);
}
