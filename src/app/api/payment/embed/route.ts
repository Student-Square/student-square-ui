import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND = process.env.INTERNAL_BACKEND_URL ?? "http://localhost:8080/api/v1";

export async function POST(request: NextRequest) {
  const body = await request.text();

  try {
    const backendRes = await fetch(`${BACKEND}/payments/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err) {
    console.error("[/api/payment/embed]", err);
    return NextResponse.json(
      { status: "fail", data: null, message: "Payment service unavailable." },
      { status: 502 }
    );
  }
}
