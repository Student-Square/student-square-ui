"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useUnsubscribeMutation } from "@/redux/features/comms/commsApi";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/**
 * FR-18-008 — one click.
 *
 * The link in the email lands here and the request fires on load: no sign-in,
 * no confirmation button. A recipient who cannot log in must still be able to
 * stop the email, and every extra step is a step where they give up and mark
 * it as spam instead.
 */
export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </main>
      }
    >
      <UnsubscribeInner />
    </Suspense>
  );
}

function UnsubscribeInner() {
  const { t } = useLanguage();
  const params = useSearchParams();
  const email = params.get("e");
  const token = params.get("t");

  const [unsubscribe] = useUnsubscribeMutation();
  const [state, setState] = useState<"working" | "done" | "failed">("working");
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    if (!email || !token) {
      setState("failed");
      return;
    }

    unsubscribe({ e: email, t: token })
      .unwrap()
      .then(() => setState("done"))
      .catch(() => setState("failed"));
  }, [email, token, unsubscribe]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center">
        {state === "working" && (
          <>
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              {t("unsub.working")}
            </p>
          </>
        )}

        {state === "done" && (
          <>
            <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-600" />
            <h1 className="mt-4 text-lg font-bold">{t("unsub.doneTitle")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("unsub.doneBody", { email: email ?? "" })}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {t("unsub.essential")}
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              {t("auth.backHome")}
            </Link>
          </>
        )}

        {state === "failed" && (
          <>
            <XCircle className="h-10 w-10 mx-auto text-rose-600" />
            <h1 className="mt-4 text-lg font-bold">{t("unsub.failedTitle")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("unsub.failedBody")}
            </p>
            <Link
              href="/dashboard/settings"
              className="mt-6 inline-block rounded-lg border border-border px-4 py-2 text-sm font-semibold"
            >
              {t("unsub.settings")}
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
