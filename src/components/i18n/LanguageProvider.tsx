"use client";

import { Fragment, useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import {
  LANGUAGE_STORAGE_KEY,
  formatNumber,
  knownBangla,
  localeFor,
  navLabel,
  translate,
  type Language,
  type TranslateVars,
} from "@/lib/i18n";

type DateStyle = "short" | "long";

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  /** BCP-47 locale for the current language ("bn-BD" / "en-GB"). */
  locale: string;
  /** Translate a UI dictionary key, filling `{name}` placeholders from `vars`. */
  t: (key: string, vars?: TranslateVars) => string;
  /**
   * `t` for a sentence with elements inside it (a link, a bold email): each
   * `{name}` is replaced by `nodes[name]`, so word order can differ by language.
   */
  rich: (key: string, nodes: Record<string, ReactNode>) => ReactNode;
  /**
   * The Bengali value when in BN and it exists; otherwise the Bangla for the
   * English text if it is a known seeded string; otherwise the English.
   */
  pick: (en: string | null | undefined, bn: string | null | undefined) => string;
  /** `pick` for text with no Bengali column: known Bangla in BN, else as-is. */
  tr: (en: string | null | undefined) => string;
  /** Number in the current language's digits. `grouping: false` for years. */
  num: (value: number, grouping?: boolean) => string;
  /** Swap ASCII digits for Bangla ones in BN, for figures stored as text ("5,000+"). */
  digits: (text: string) => string;
  /** "16 Sept 2026" / "১৬ সেপ্টে, ২০২৬". Empty for a missing date. */
  date: (iso: string | null | undefined, style?: DateStyle) => string;
  /** Nav label for a route path, translated in BN. */
  nav: (path: string | undefined, fallback: string) => string;
};

/*
 * The chosen language lives in localStorage, which the server cannot read, so
 * the server always renders English. Components read the language through
 * useSyncExternalStore with an English server snapshot: React hydrates each
 * component in English, matching the HTML, and switches to Bangla right after.
 * That includes Suspense boundaries that hydrate late (useSearchParams pages);
 * a context switched from an effect would hand those Bangla mid-hydration and
 * fail with a text mismatch.
 */
let current: Language | null = null;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

function getSnapshot(): Language {
  if (current === null) {
    try {
      current = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "BN" ? "BN" : "EN";
    } catch {
      current = "EN"; // storage blocked — stay English
    }
  }
  return current;
}

const getServerSnapshot = (): Language => "EN";

// Keep tabs in sync if the choice changes in another one.
function onStorage(e: StorageEvent) {
  if (e.key !== LANGUAGE_STORAGE_KEY || (e.newValue !== "EN" && e.newValue !== "BN")) return;
  if (e.newValue === current) return;
  current = e.newValue;
  emit();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function setLanguage(next: Language) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  if (next === getSnapshot()) return;
  current = next;
  emit();
}

const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

function buildValue(lang: Language): LanguageContextValue {
  const locale = localeFor(lang);
  const pick = (en: string | null | undefined, bn: string | null | undefined) => {
    if (lang === "BN") {
      if (bn) return bn;
      const known = knownBangla(en);
      if (known) return known;
    }
    return en ?? bn ?? "";
  };
  return {
    lang,
    setLang: setLanguage,
    locale,
    t: (key, vars) => translate(lang, key, vars),
    rich: (key, nodes) =>
      translate(lang, key)
        .split(/(\{\w+\})/)
        .map((part, i) => {
          const name = /^\{(\w+)\}$/.exec(part)?.[1];
          return <Fragment key={i}>{name && name in nodes ? nodes[name] : part}</Fragment>;
        }),
    pick,
    tr: (en) => pick(en, null),
    num: (value, grouping) => formatNumber(lang, value, grouping),
    digits: (text) => (lang === "BN" ? text.replace(/[0-9]/g, (d) => BANGLA_DIGITS[Number(d)]) : text),
    date: (iso, style = "short") =>
      iso
        ? new Date(iso).toLocaleDateString(locale, {
            day: "numeric",
            month: style === "long" ? "long" : "short",
            year: "numeric",
          })
        : "",
    nav: (path, fallback) => navLabel(lang, path, fallback),
  };
}

// Built once per language, so every consumer gets a stable object.
const VALUES: Record<Language, LanguageContextValue> = { EN: buildValue("EN"), BN: buildValue("BN") };

export function useLanguage(): LanguageContextValue {
  return VALUES[useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)];
}

/** Reflects the chosen language on <html lang> for accessibility and font shaping. */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const { lang } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = lang === "BN" ? "bn" : "en";
  }, [lang]);
  return <>{children}</>;
}
