"use client";

import { Cormorant_Garamond, Outfit } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import { closestAmountKey, impacts } from "./constants";
import styles from "./DonateExperience.module.css";
import DonateHeroSection from "./sections/DonateHeroSection";
import DonatePaymentSection from "./sections/DonatePaymentSection";
import DonateProjectsSection from "./sections/DonateProjectsSection";
import DonateTransformSection from "./sections/DonateTransformSection";
import DonateUtilizationSection from "./sections/DonateUtilizationSection";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-donate-display",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-donate-body",
  weight: ["300", "400", "500", "600", "700"],
});

export default function DonateExperience() {
  const [currentAmt, setCurrentAmt] = useState<number>(500);
  const [heroCustomValue, setHeroCustomValue] = useState("");
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add(styles.revealVisible);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    const targets = document.querySelectorAll<HTMLElement>("[data-donate-reveal='true']");
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  const heroImpact = useMemo(() => {
    const key = closestAmountKey(currentAmt);
    return impacts.monthly[key];
  }, [currentAmt]);

  const handleHeroCustomAmount = (value: string) => {
    setHeroCustomValue(value);
    const parsedValue = Number.parseInt(value, 10);
    if (Number.isFinite(parsedValue) && parsedValue > 0) {
      setCurrentAmt(parsedValue);
    }
  };

  const handleHeroAmountPick = (amount: number) => {
    setCurrentAmt(amount);
    setHeroCustomValue("");
  };

  const handleToggleAccordion = (index: number) => {
    setOpenAccordionIndex((previous) => (previous === index ? null : index));
  };

  return (
    <main className={`${styles.page} ${cormorant.variable} ${outfit.variable}`}>
      <DonateHeroSection
        currentAmt={currentAmt}
        heroCustomValue={heroCustomValue}
        heroImpact={heroImpact}
        onAmountPick={handleHeroAmountPick}
        onCustomAmountChange={handleHeroCustomAmount}
      />
      <DonatePaymentSection />
      <DonateProjectsSection />
      <DonateUtilizationSection openAccordionIndex={openAccordionIndex} onToggleAccordion={handleToggleAccordion} />
      <DonateTransformSection />
    </main>
  );
}
