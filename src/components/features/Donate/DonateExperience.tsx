"use client";

import { useEffect, useMemo, useState } from "react";
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
 * The donate page. With no slug (/donate) nothing is selected and the donor
 * must choose a project before paying. A slug is one active project, or the
 * general fund.
 */
export default function DonateExperience({ slug }: { slug?: string }) {
  const { data: campaigns, isLoading: campaignsLoading } = useGetCampaignsQuery({ status: "ACTIVE" });
  // On /donate the choice lives here, so picking a project opens the form in
  // place rather than loading a second page. /donate/[slug] is already a
  // choice, so that route stays fixed to its own project.
  const [picked, setPicked] = useState("");
  const target = slug ?? picked;
  const unselected = !target;
  const isGeneral = target === GENERAL_FUND_SLUG;
  const campaign = isGeneral || unselected ? undefined : campaigns?.find((c) => c.slug === target);
  // The address bar still names the project, so the page can be shared or
  // refreshed — but written straight to history rather than pushed through the
  // router, which would remount the page and throw away a half-filled form.
  const syncUrl = (next: string) => {
    window.history.pushState(null, "", next ? `/donate/${next}` : "/donate");
  };

  // The projects grid moves as the choice changes, so the scroll has to wait
  // for the render that moved it — hence a request here and the effect below,
  // rather than scrolling straight from the click.
  const [scrollTo, setScrollTo] = useState<"projects" | "donate-main" | "">("");
  useEffect(() => {
    if (!scrollTo) return;
    document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" });
    setScrollTo("");
  }, [scrollTo]);

  const chooseProject = (next: string) => {
    setPicked(next);
    syncUrl(next);
    // Back up to the form, which is what the choice just opened.
    setScrollTo("donate-main");
  };

  // Only the in-page choice can be undone here; /donate/[slug] goes back to
  // /donate for that, since its project is the route itself. Undoing it returns
  // the donor to the grid they chose from.
  const clearProject = slug
    ? undefined
    : () => {
        setPicked("");
        syncUrl("");
        setScrollTo("projects");
      };

  // Back and forward walk those rewritten URLs, so the choice has to follow the
  // address bar or the two drift apart.
  useEffect(() => {
    if (slug) return;
    const onPopState = () => {
      const match = /^\/donate\/([^/]+)/.exec(window.location.pathname);
      setPicked(match ? decodeURIComponent(match[1]) : "");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [slug]);

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
  // that the project is closed. /donate itself has no project to miss.
  if (!unselected && !isGeneral && campaigns && !campaign) return <ProjectNotFound />;

  return (
    <main className="min-h-screen bg-background">
      {/* Section order follows the client's donation document, except the ways
          to give (its payment methods and direct giving, merged), which sit
          under the form they explain. */}
      <DonateHeroSection
        campaign={campaign}
        unselected={unselected}
        isGeneral={isGeneral}
        campaignLoading={!unselected && !isGeneral && campaignsLoading}
        onClearProject={clearProject}
        onBrowseProjects={() => setScrollTo("projects")}
        currentAmt={currentAmt}
        heroCustomValue={heroCustomValue}
        heroImpact={heroImpact}
        onAmountPick={handleHeroAmountPick}
        onCustomAmountChange={handleHeroCustomAmount}
      />
      <DonateWaysToGiveSection />
      <DonateJoinSection />
      {/* One place in the order, chosen or not, so /donate and a project's own
          page are the same page with the same sections. */}
      <DonateProjectsSection selectedSlug={target} onSelect={slug ? undefined : chooseProject} />
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
