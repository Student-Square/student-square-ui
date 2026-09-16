"use client";

import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Heart, Loader2, Sparkles } from "lucide-react";
import { amountOptions, closestAmountKey, heroStats } from "../constants";
import type { ImpactEntry } from "../types";
import { container, field } from "../ui";
import { useDonateContent } from "../useDonateContent";
import { useImpactStats } from "@/components/common/ImpactStats";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useGetCampaignsQuery } from "@/redux/features/campaigns/campaignsApi";
import { useCreateDonationMutation } from "@/redux/features/donations/donationsApi";
import type { CreateDonationBody } from "@/types/donations";

const MIN_AMOUNT = 10;
const OTHER = "__other__";

interface DonateHeroSectionProps {
  currentAmt: number;
  heroCustomValue: string;
  heroImpact: ImpactEntry;
  onAmountPick: (amount: number) => void;
  onCustomAmountChange: (value: string) => void;
}

export default function DonateHeroSection({
  currentAmt,
  heroCustomValue,
  heroImpact,
  onAmountPick,
  onCustomAmountChange,
}: DonateHeroSectionProps) {
  const user = useSelector(selectCurrentUser);
  const { t, tr, pick, digits } = useLanguage();
  const { hero } = useDonateContent();
  const impactStats = useImpactStats();
  const stats = impactStats.length
    ? impactStats
    : heroStats.map((s) => ({ value: digits(s.number), label: tr(s.label), detail: undefined }));
  const { data: campaigns, isLoading: campaignsLoading } = useGetCampaignsQuery({
    status: "ACTIVE",
  });
  const [createDonation, { isLoading }] = useCreateDonationMutation();

  const [target, setTarget] = useState<string>("");
  const [purpose, setPurpose] = useState("");
  const [donorName, setDonorName] = useState(user?.fullName ?? "");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorEmail, setDonorEmail] = useState(user?.email ?? "");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paying, setPaying] = useState(false);
  const idempotency = useRef<{ body: string; key: string } | null>(null);

  const targetIsOther = target === OTHER;
  const busy = paying || isLoading;

  const handleDonate = async () => {
    if (!target) return toast.error(t("donate.err.target"));
    if (targetIsOther && !purpose.trim())
      return toast.error(t("donate.err.purpose"));
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
      kind: targetIsOther ? "OTHER" : "PROJECT",
      campaignId: targetIsOther ? undefined : target,
      purpose: targetIsOther ? purpose.trim() : undefined,
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
    <section id="donate-main" className="mt-12 sm:mt-14 lg:mt-16 py-8 sm:py-10 lg:py-14">
      <div className={container}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 px-5 py-10 sm:px-10 lg:px-12 lg:py-14">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_440px] lg:gap-14">
            {/* Left: the case for giving */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                <Sparkles className="h-3 w-3" />
                {tr(hero?.eyebrow ?? "Student Square Foundation")}
              </span>

              <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {t("donate.headingLead")}{" "}
                <em className="not-italic text-emerald-300">{t("donate.headingAccent")}</em>
                <br />
                {t("donate.headingTail")}
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-emerald-50/80 sm:text-base">
                {hero?.body ? tr(hero.body) : t("donate.heroBodyFallback")}
              </p>

              <div className="mt-10 border-t border-white/10 pt-8">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300/70">
                  {t("donate.ourImpact")}
                </span>
                <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="relative pl-4">
                      <span className="absolute left-0 top-0.5 text-emerald-300/50">›</span>
                      <div className="text-2xl font-bold leading-none text-emerald-300 sm:text-3xl">
                        {stat.value}
                      </div>
                      <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                        {stat.label}
                      </div>
                      {stat.detail && (
                        <div className="mt-0.5 text-[11px] leading-snug text-white/40">
                          {stat.detail}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: the donation form */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
              <div className="border-b border-border bg-emerald-50 px-5 py-4 dark:bg-emerald-950/40">
                <h2 className="text-base font-bold text-foreground sm:text-lg">
                  {t("donate.formTitle")}
                </h2>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t("donate.whereGoes")}
                  </label>
                  <select
                    className={`${field} cursor-pointer`}
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    aria-label={t("donate.projectOrPurpose")}
                  >
                    <option value="" disabled>
                      {campaignsLoading ? t("donate.loadingProjects") : t("donate.selectProject")}
                    </option>
                    {(campaigns ?? []).map((c) => (
                      <option key={c.id} value={c.id}>
                        {pick(c.title, c.titleBn)}
                      </option>
                    ))}
                    <option value={OTHER}>{t("donate.otherOption")}</option>
                  </select>
                  {targetIsOther && (
                    <input
                      className={`${field} mt-2`}
                      type="text"
                      placeholder={t("donate.otherPlaceholder")}
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t("donate.selectAmount")}
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {amountOptions.map((amount) => {
                      const active = currentAmt === amount;
                      return (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => onAmountPick(amount)}
                          className={`rounded-lg border-2 px-2 py-2.5 text-xs font-bold transition-colors ${
                            active
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-border bg-background text-foreground hover:border-emerald-500 hover:text-emerald-600"
                          }`}
                        >
                          {t("donate.amount", { amount })}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 dark:border-emerald-900 dark:bg-emerald-950/40">
                  <span className="text-sm leading-none">{heroImpact.icon}</span>
                  <span className="text-xs font-medium leading-relaxed text-emerald-800 dark:text-emerald-200">
                    {t(`donate.impact.${closestAmountKey(currentAmt)}`)}
                  </span>
                </div>

                <div className="flex overflow-hidden rounded-lg border border-border focus-within:border-emerald-500">
                  <span className="flex items-center bg-muted px-3 text-xs font-bold text-muted-foreground">
                    {t("donate.currency")}
                  </span>
                  <input
                    className="w-full bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    type="number"
                    placeholder={t("donate.otherAmount")}
                    value={heroCustomValue}
                    onChange={(event) => onCustomAmountChange(event.target.value)}
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-emerald-600"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  {t("donate.anonymous")}
                </label>

                {isAnonymous ? (
                  <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                    {t("donate.anonymousNote")}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {/* All three are required for a named gift — marked so the
                        donor knows before pressing Donate, not after. */}
                    <input
                      className={field}
                      type="text"
                      placeholder={t("donate.name")}
                      autoComplete="name"
                      aria-required="true"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                    />
                    <input
                      className={field}
                      type="tel"
                      placeholder={t("donate.phone")}
                      autoComplete="tel"
                      aria-required="true"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                    />
                    <input
                      className={`${field} sm:col-span-2`}
                      type="email"
                      placeholder={t("donate.email")}
                      autoComplete="email"
                      aria-required="true"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => void handleDonate()}
                  disabled={busy}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-sm shadow-emerald-600/30 transition-colors hover:bg-emerald-700 disabled:opacity-60"
                >
                  {busy ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("donate.redirecting")}
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4" />
                      {t("donate.donateAmount", { amount: currentAmt })}
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-muted-foreground">
                  {t("donate.sslNote")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
