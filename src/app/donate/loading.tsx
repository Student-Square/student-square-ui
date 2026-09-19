"use client";

import { Loader2 } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/**
 * /donate fetches the active projects on the server before redirecting to one,
 * and the layout renders the header and footer around whatever is in between.
 * Without this the gap was empty, so the footer sat directly under the header
 * until the redirect landed. Holding a screen's height keeps it off-screen.
 */
export default function DonateLoading() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
        {t("donate.loading")}
      </div>
    </main>
  );
}
