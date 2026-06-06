import Link from "next/link";
import { CheckCircle2, ArrowRight, FileText } from "lucide-react";
import BreakIframe from "@/components/common/BreakIframe";

export default async function DonateSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; token?: string }>;
}) {
  const { ref, token } = await searchParams;
  return (
    <main className="mt-12 sm:mt-14 lg:mt-16 flex min-h-[60vh] items-center justify-center bg-background px-4 py-16">
      <BreakIframe />
      <div className="w-full max-w-md rounded-2xl border border-emerald-500/30 bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Thank you for your donation!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your payment was successful{ref ? <> — reference <span className="font-mono font-semibold text-foreground">{ref}</span></> : ""}.
          A PDF receipt has been emailed to you.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          {token && (
            <Link
              href={`/donate/receipt?token=${encodeURIComponent(token)}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              <FileText className="h-4 w-4" /> View &amp; download receipt
            </Link>
          )}
          <Link
            href="/dashboard/donation"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
          >
            My donations <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
