import { NextRequest, NextResponse } from "next/server";

// Only these prefixes require a logged-in session.
// Every other route — /, /blog, /about, /what-we-do, /get-involved,
// /find-us, /donate, /campaigns, /contact — is always public.
//
// Role gating lives in each area's layout (see lib/auth-routing.ts); this only
// answers "is anyone signed in", which is all a cookie can honestly tell us.
const PROTECTED_PREFIXES = ["/account", "/admin", "/panel", "/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Either cookie means a session may exist. The access cookie expires after
  // 15 minutes while the refresh cookie lasts days; checking only the access
  // cookie sent people to the login page mid-session. The client refreshes on
  // the first 401 (baseApi), and the server stays the real authority.
  const hasSession =
    request.cookies.has("accessToken") || request.cookies.has("refreshToken");

  if (!hasSession) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run middleware on all routes except Next.js internals and static files.
    "/((?!_next/static|_next/image|favicon.ico|images/|icons/|video/|geo/).*)",
  ],
};
