import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND = process.env.INTERNAL_BACKEND_URL ?? "http://localhost:8080/api/v1";
const FRONTEND_BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function handleCallback(
  request: NextRequest,
  result: string
): Promise<NextResponse> {
  if (!["success", "fail", "cancel"].includes(result)) {
    return NextResponse.redirect(new URL("/donate", FRONTEND_BASE));
  }

  let body: string;
  if (request.method === "POST") {
    body = await request.text();
  } else {
    body = request.nextUrl.searchParams.toString();
  }

  try {
    const backendRes = await fetch(`${BACKEND}/payments/${result}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      redirect: "manual",
    });

    if (backendRes.status >= 300 && backendRes.status < 400) {
      const location = backendRes.headers.get("location");
      if (location) {
        return NextResponse.redirect(location, { status: 302 });
      }
    }

    if (!backendRes.ok) {
      console.error(`[/api/payment/${result}] backend status ${backendRes.status}`);
    }
  } catch (err) {
    console.error(`[/api/payment/${result}]`, err);
  }

  return NextResponse.redirect(new URL("/donate", FRONTEND_BASE));
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ result: string }> }
) {
  const { result } = await context.params;
  return handleCallback(request, result);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ result: string }> }
) {
  const { result } = await context.params;
  return handleCallback(request, result);
}
