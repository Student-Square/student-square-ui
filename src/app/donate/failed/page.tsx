import Link from "next/link";
import { XCircle, ArrowRight } from "lucide-react";
import BreakIframe from "@/components/common/BreakIframe";

export default async function DonateFailedPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return (
    <main className="mt-12 sm:mt-14 lg:mt-16 flex min-h-[60vh] items-center justify-center bg-background px-4 py-16">
      <BreakIframe />
      <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-card p-8 text-center">
        <XCircle className="mx-auto h-14 w-14 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Payment didn't go through</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't confirm your payment{ref ? <> (reference <span className="font-mono">{ref}</span>)</> : ""}.
          No charge has been recorded — please try again.
        </p>
        <div className="mt-6">
          <Link href="/donate" className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
            Try again <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
