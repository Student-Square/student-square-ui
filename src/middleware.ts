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

  // Check for the access token cookie set by the backend.
  const hasSession = request.cookies.has("accessToken");

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
