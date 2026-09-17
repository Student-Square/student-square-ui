"use client";

import { useRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { CreditCard, EyeOff, HandHeart, Heart, Loader2, Lock, Mail, Phone, Sparkles, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { amountOptions, closestAmountKey, heroStats } from "../constants";
import type { ImpactEntry } from "../types";
import { container } from "../ui";
import { useDonateContent } from "../useDonateContent";
import { useImpactStats } from "@/components/common/ImpactStats";
import Aurora from "@/components/ui/aurora-effect";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useCreateDonationMutation } from "@/redux/features/donations/donationsApi";
import type { ApiCampaign } from "@/types/campaigns";
import type { CreateDonationBody } from "@/types/donations";

const MIN_AMOUNT = 10;

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

/** Methods SSLCommerz offers, shown under the button so donors know before leaving. */
const PAYMENT_LOGOS = [
  { src: "/images/bkash-logo.webp", alt: "bKash" },
  { src: "/images/Nagad-Logo.png", alt: "Nagad" },
  { src: "/images/rocket-logo.png", alt: "Rocket" },
];
/**
 * Stored as a general-fund gift's purpose when the donor names none. Kept in
 * English whatever the page language, so finance reports group these together.
 */
const GENERAL_FUND_PURPOSE = "General fund";

interface DonateHeroSectionProps {
  /** The project chosen on /donate; undefined for the general fund or while loading. */
  campaign?: ApiCampaign;
  isGeneral: boolean;
  campaignLoading: boolean;
  currentAmt: number;
  heroCustomValue: string;
  heroImpact: ImpactEntry;
  onAmountPick: (amount: number) => void;
  onCustomAmountChange: (value: string) => void;
}

export default function DonateHeroSection({
  campaign,
  isGeneral,
  campaignLoading,
  currentAmt,
  heroCustomValue,
  heroImpact,
  onAmountPick,
  onCustomAmountChange,
}: DonateHeroSectionProps) {
  const user = useSelector(selectCurrentUser);
  const { t, tr, pick, digits, num } = useLanguage();
  const { hero } = useDonateContent();
  const impactStats = useImpactStats();
  const stats = impactStats.length
    ? impactStats
    : heroStats.map((s) => ({ value: digits(s.number), label: tr(s.label), detail: undefined }));
  const [createDonation, { isLoading }] = useCreateDonationMutation();

  const [purpose, setPurpose] = useState("");
  const [donorName, setDonorName] = useState(user?.fullName ?? "");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorEmail, setDonorEmail] = useState(user?.email ?? "");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paying, setPaying] = useState(false);
  const idempotency = useRef<{ body: string; key: string } | null>(null);

  const busy = paying || isLoading;
  const targetTitle = isGeneral
    ? t("donate.generalTitle")
    : campaign
      ? pick(campaign.title, campaign.titleBn)
      : "";
  const cover = campaign?.coverImage?.url;

  const handleDonate = async () => {
    if (!isGeneral && !campaign) return toast.error(t("donate.err.target"));
    if (currentAmt < MIN_AMOUNT)
      return toast.error(t("donate.err.min", { min: MIN_AMOUNT }));
    if (!isAnonymous && !donorName.trim())
      return toast.error(t("donate.err.name"));
    if (!isAnonymous && !donorEmail.trim())
      return toast.error(t("donate.err.email"));
    // Required for a named gift: it is what the confirmation SMS is sent to.
    if (!isAnonymous && !donorPhone.trim())
      return toast.error(t("donate.err.phone"));

    const body: CreateDonationBody = {
      amount: String(currentAmt),
      currency: "BDT",
      kind: isGeneral ? "OTHER" : "PROJECT",
      campaignId: isGeneral ? undefined : campaign?.id,
      purpose: isGeneral ? purpose.trim() || GENERAL_FUND_PURPOSE : undefined,
      method: "SSLCOMMERZ",
      // Anonymous gifts omit personal details; the API stores placeholders for the gateway.
      donorName: isAnonymous ? "Anonymous" : donorName.trim(),
      donorEmail: isAnonymous ? "anonymous@studentsquare.org" : donorEmail.trim(),
      donorPhone: isAnonymous ? undefined : donorPhone.trim(),
      isAnonymous,
    };

    // Same form contents → same key, so retrying after a timeout gets back the
    // donation the first attempt created; any change makes it a new donation.
    const fingerprint = JSON.stringify(body);
    if (idempotency.current?.body !== fingerprint) {
      idempotency.current = {
        body: fingerprint,
        key:
          typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };
    }

    setPaying(true);
    try {
      // Create the PENDING donation, then hand the donor over to SSLCommerz's
      // own hosted page. Staying on our domain is not an option worth the
      // complexity here — the gateway page is where donors expect to land.
      const res = await createDonation({
        body,
        idempotencyKey: idempotency.current.key,
      }).unwrap();

      const gatewayRes = await fetch(res.embedEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ order: res.donation.tranId }),
      });
      const data = (await gatewayRes.json()) as {
        status?: string;
        data?: string;
        message?: string;
      };

      if (data.status === "success" && data.data) {
        window.location.href = data.data;
        return;
      }
      toast.error(data.message ?? t("donate.err.payment"));
    } catch {
      // createDonation errors are surfaced by baseApi
    } finally {
      setPaying(false);
    }
  };

  return (
    // The page's own background with the homepage hero's aurora wash and grid,
    // fading into the sections below, rather than a dark panel of its own.
    <section
      id="donate-main"
      className="relative overflow-hidden pb-10 pt-20 sm:pb-12 sm:pt-24 lg:pt-28 2xl:pt-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Aurora amplitude={1.2} blend={0.6} speed={0.5} />
        <div className="absolute inset-0 bg-background/50 dark:bg-background/60" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:4rem_4rem]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-32 bg-gradient-to-b from-transparent to-background" />

      <div className={`${container} relative z-10`}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_560px] xl:gap-14">
          {/* Left: the case for giving, top-aligned with the card and read top
              to bottom with the impact figures straight after the text. */}
          <div className="flex flex-col lg:self-start">
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-600/20 bg-emerald-600/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
              <Sparkles className="h-3 w-3" />
              {tr(hero?.eyebrow ?? "Student Square Foundation")}
            </span>

            <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {t("donate.headingLead")}{" "}
              <em className="not-italic text-emerald-600 dark:text-emerald-400">{t("donate.headingAccent")}</em>
              <br />
              {t("donate.headingTail")}
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {hero?.body ? tr(hero.body) : t("donate.heroBodyFallback")}
            </p>

            <div className="mt-8">
              <p className="flex items-center gap-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                <span aria-hidden className="h-px w-8 bg-emerald-500/60" />
                {t("donate.ourImpact")}
              </p>
              {/* auto-rows-fr: every tile as tall as the tallest, however the
                  labels wrap in either language. */}
              <div className="mt-3 grid auto-rows-fr grid-cols-2 gap-2.5">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col rounded-xl border border-border px-4 py-3"
                  >
                    <div className="text-2xl font-bold leading-none tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-3xl">
                      {stat.value}
                    </div>
                    <div className="mt-1.5 text-sm font-semibold leading-snug text-foreground">{stat.label}</div>
                    {stat.detail && (
                      <div className="mt-0.5 text-xs leading-snug text-muted-foreground">{stat.detail}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: the donation form */}
          <div className="self-start overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-emerald-900/10">
            {/* The project this page is for, as a photo banner. Changing it
                means picking another in the list below, which opens that
                project's page, so the page and the gift can never disagree. */}
            <div className="relative h-44 overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 sm:h-52">
              {campaignLoading ? (
                <div className="absolute inset-0 animate-pulse bg-muted" />
              ) : cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <HandHeart aria-hidden className="absolute -right-4 -top-4 h-32 w-32 text-white/15" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 via-45% to-transparent" />
              <div className="relative flex h-full items-end justify-between gap-3 p-4 sm:px-6">
                <div className="min-w-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-white/85">
                    {t("donate.whereGoes")}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-base font-bold leading-snug text-white">
                    {campaignLoading ? t("donate.loadingProjects") : targetTitle}
                  </p>
                </div>
                <a
                  href="#projects"
                  className="shrink-0 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                >
                  {t("donate.changeProject")}
                </a>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <h2 className="text-lg font-bold tracking-tight text-foreground">{t("donate.formTitle")}</h2>

              {isGeneral && (
                <div>
                  <label htmlFor="donate-purpose" className="mb-2 block text-sm font-semibold text-foreground">
                    {t("donate.projectOrPurpose")}
                  </label>
                  <input
                    id="donate-purpose"
                    className={inputClass}
                    type="text"
                    aria-label={t("donate.projectOrPurpose")}
                    placeholder={t("donate.otherPlaceholder")}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                  />
                </div>
              )}

              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-foreground">{t("donate.selectAmount")}</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {amountOptions.map((amount) => {
                    const active = currentAmt === amount;
                    return (
                      <button
                        key={amount}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onAmountPick(amount)}
                        className={`rounded-xl border-2 px-2 py-2 text-sm font-bold transition-all ${
                          active
                            ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                            : "border-border bg-background text-foreground hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400"
                        }`}
                      >
                        {/* The legend names the currency, so the symbol is enough
                            here and all four fit on one row. */}
                        ৳{num(amount)}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 flex h-11 items-center overflow-hidden rounded-xl border-2 border-border bg-background transition-colors focus-within:border-emerald-500">
                  <span className="flex h-full items-center border-r border-border bg-muted/60 px-4 text-sm font-bold text-muted-foreground">
                    {t("donate.currency")}
                  </span>
                  <input
                    className="h-full w-full bg-transparent px-3 text-base font-semibold text-foreground outline-none placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground"
                    type="number"
                    inputMode="numeric"
                    min={MIN_AMOUNT}
                    aria-label={t("donate.otherAmount")}
                    placeholder={t("donate.otherAmount")}
                    value={heroCustomValue}
                    onChange={(event) => onCustomAmountChange(event.target.value)}
                  />
                </div>

                <p className="mt-2 flex items-start gap-2.5 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm leading-relaxed text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                  <span aria-hidden className="text-base leading-snug">
                    {heroImpact.icon}
                  </span>
                  <span>{t(`donate.impact.${closestAmountKey(currentAmt)}`)}</span>
                </p>
              </fieldset>

              <div className="space-y-2 border-t border-border pt-4">
                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-muted/40 px-4 py-2.5">
                  <span className="flex items-center gap-2.5 text-sm text-foreground">
                    <EyeOff aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {t("donate.anonymous")}
                  </span>
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <span
                    aria-hidden
                    className="relative h-6 w-11 shrink-0 rounded-full bg-muted-foreground/30 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-emerald-600 peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card"
                  />
                </label>

                {isAnonymous ? (
                  <p className="rounded-xl border border-dashed border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                    {t("donate.anonymousNote")}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {/* All three are required for a named gift — marked so the
                        donor knows before pressing Donate, not after. */}
                    <IconInput
                      icon={User}
                      type="text"
                      placeholder={t("donate.name")}
                      aria-label={t("donate.name")}
                      autoComplete="name"
                      aria-required="true"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                    />
                    <IconInput
                      icon={Phone}
                      type="tel"
                      placeholder={t("donate.phone")}
                      aria-label={t("donate.phone")}
                      autoComplete="tel"
                      aria-required="true"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                    />
                    <IconInput
                      icon={Mail}
                      className="sm:col-span-2"
                      type="email"
                      placeholder={t("donate.email")}
                      aria-label={t("donate.email")}
                      autoComplete="email"
                      aria-required="true"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => void handleDonate()}
                  disabled={busy}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-base font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl active:scale-[0.99] disabled:opacity-60"
                >
                  {busy ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t("donate.redirecting")}
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5" />
                      {t("donate.donateAmount", { amount: currentAmt })}
                    </>
                  )}
                </button>

                <p className="text-center text-xs leading-relaxed text-muted-foreground">
                  <Lock aria-hidden className="mr-1 inline h-3.5 w-3.5 -translate-y-px text-emerald-600 dark:text-emerald-400" />
                  {t("donate.sslNote")}
                </p>

                {/* White chips, because the wallet logos are drawn for a light
                    background and the bKash wordmark vanishes on the dark card. */}
                <div className="flex items-center justify-center gap-2">
                  <span className="flex h-6 items-center rounded-md border border-border bg-white px-2">
                    <CreditCard aria-label={t("donate.card")} className="h-4 w-4 text-slate-500" />
                  </span>
                  {PAYMENT_LOGOS.map((logo) => (
                    <span key={logo.alt} className="flex h-6 items-center rounded-md border border-border bg-white px-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logo.src} alt={tr(logo.alt)} className="h-4 w-auto object-contain" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IconInput({
  icon: Icon,
  className = "",
  ...input
}: { icon: LucideIcon; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`relative ${className}`}>
      <Icon aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input {...input} className={`${inputClass} pl-10`} />
    </div>
  );
}
