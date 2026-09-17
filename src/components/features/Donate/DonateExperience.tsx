"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, HeartOff } from "lucide-react";
import { closestAmountKey, impacts } from "./constants";
import DonateHeroSection from "./sections/DonateHeroSection";
import DonateImpactSection from "./sections/DonateImpactSection";
import DonateJoinSection from "./sections/DonateJoinSection";
import DonateProjectsSection from "./sections/DonateProjectsSection";
import DonateTransformSection from "./sections/DonateTransformSection";
import DonateUtilizationSection from "./sections/DonateUtilizationSection";
import DonateWaysToGiveSection from "./sections/DonateWaysToGiveSection";
import { container } from "./ui";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useGetCampaignsQuery } from "@/redux/features/campaigns/campaignsApi";

/** The slug /donate links to for a gift that is not tied to one project. */
export const GENERAL_FUND_SLUG = "general";

/**
 * The amount-and-pay page for what the donor picked on /donate: one active
 * project, or the general fund.
 */
export default function DonateExperience({ slug }: { slug: string }) {
  const { data: campaigns, isLoading: campaignsLoading } = useGetCampaignsQuery({ status: "ACTIVE" });
  const isGeneral = slug === GENERAL_FUND_SLUG;
  const campaign = isGeneral ? undefined : campaigns?.find((c) => c.slug === slug);

  const [currentAmt, setCurrentAmt] = useState<number>(500);
  const [heroCustomValue, setHeroCustomValue] = useState("");
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(null);

  // The form takes a single gift, so the one-time wording is the honest one.
  const heroImpact = useMemo(() => impacts.onetime[closestAmountKey(currentAmt)], [currentAmt]);

  const handleHeroCustomAmount = (value: string) => {
    setHeroCustomValue(value);
    const parsedValue = Number.parseInt(value, 10);
    if (Number.isFinite(parsedValue) && parsedValue > 0) {
      setCurrentAmt(parsedValue);
    }
  };

  // Picking a preset fills the amount box too, so the figure being charged is
  // always visible in one place.
  const handleHeroAmountPick = (amount: number) => {
    setCurrentAmt(amount);
    setHeroCustomValue(String(amount));
  };

  const handleToggleAccordion = (index: number) => {
    setOpenAccordionIndex((previous) => (previous === index ? null : index));
  };

  // Only once the list has actually arrived: a failed request is not proof
  // that the project is closed.
  if (!isGeneral && campaigns && !campaign) return <ProjectNotFound />;

  return (
    <main className="min-h-screen bg-background">
      {/* Section order follows the client's donation document, except the ways
          to give (its payment methods and direct giving, merged), which sit
          under the form they explain. */}
      <DonateHeroSection
        campaign={campaign}
        isGeneral={isGeneral}
        campaignLoading={!isGeneral && campaignsLoading}
        currentAmt={currentAmt}
        heroCustomValue={heroCustomValue}
        heroImpact={heroImpact}
        onAmountPick={handleHeroAmountPick}
        onCustomAmountChange={handleHeroCustomAmount}
      />
      <DonateWaysToGiveSection />
      <DonateJoinSection />
      <DonateProjectsSection selectedSlug={slug} />
      <DonateUtilizationSection
        openAccordionIndex={openAccordionIndex}
        onToggleAccordion={handleToggleAccordion}
      />
      <DonateTransformSection />
      <DonateImpactSection currentAmt={currentAmt} onAmountPick={handleHeroAmountPick} />
    </main>
  );
}

function ProjectNotFound() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen bg-background">
      <section className={`${container} flex min-h-[70vh] flex-col items-center justify-center py-24 text-center`}>
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <HeartOff className="h-6 w-6" />
        </span>
        <h1 className="mt-6 max-w-md text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t("donate.projectNotFound")}
        </h1>
        <Link
          href="/donate"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("donate.backToProjects")}
        </Link>
      </section>
    </main>
  );
}
