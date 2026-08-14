"use client";

import { useMemo, useState } from "react";
import { closestAmountKey, impacts } from "./constants";
import DonateHeroSection from "./sections/DonateHeroSection";
import DonateHowToSection from "./sections/DonateHowToSection";
import DonateImpactSection from "./sections/DonateImpactSection";
import DonateJoinSection from "./sections/DonateJoinSection";
import DonatePaymentSection from "./sections/DonatePaymentSection";
import DonateProjectsSection from "./sections/DonateProjectsSection";
import DonateTransformSection from "./sections/DonateTransformSection";
import DonateUtilizationSection from "./sections/DonateUtilizationSection";

export default function DonateExperience() {
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

  return (
    <main className="min-h-screen bg-background">
      {/* Section order follows the client's donation document. */}
      <DonateHeroSection
        currentAmt={currentAmt}
        heroCustomValue={heroCustomValue}
        heroImpact={heroImpact}
        onAmountPick={handleHeroAmountPick}
        onCustomAmountChange={handleHeroCustomAmount}
      />
      <DonateJoinSection />
      <DonateProjectsSection />
      <DonateUtilizationSection
        openAccordionIndex={openAccordionIndex}
        onToggleAccordion={handleToggleAccordion}
      />
      <DonateTransformSection />
      <DonateImpactSection currentAmt={currentAmt} onAmountPick={handleHeroAmountPick} />
      <DonatePaymentSection />
      <DonateHowToSection />
    </main>
  );
}
