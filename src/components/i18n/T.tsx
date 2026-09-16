"use client";

import { useLanguage } from "./LanguageProvider";
import type { TranslateVars } from "@/lib/i18n";

/**
 * A translated label for server components, which cannot call useLanguage().
 * Renders plain text, so it drops into any element: <h1><T k="…" /></h1>.
 */
export default function T({ k, vars }: { k: string; vars?: TranslateVars }) {
  const { t } = useLanguage();
  return <>{t(k, vars)}</>;
}
