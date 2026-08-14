"use client";

import { Minus, Plus } from "lucide-react";
import { utilizationItems } from "../constants";
import { container, eyebrow, heading, sub } from "../ui";
import { useDonateContent } from "../useDonateContent";

interface DonateUtilizationSectionProps {
  openAccordionIndex: number | null;
  onToggleAccordion: (index: number) => void;
}

export default function DonateUtilizationSection({
  openAccordionIndex,
  onToggleAccordion,
}: DonateUtilizationSectionProps) {
  const { transparency } = useDonateContent();
  const items =
    transparency?.items?.map((item) => ({
      icon: item.icon,
      label: item.title,
      content: item.body,
    })) ?? utilizationItems;

  return (
    <section id="utilization" className="border-t border-border bg-muted/30 py-14 sm:py-20">
      <div className={container}>
        <span className={eyebrow}>{transparency?.eyebrow ?? "Full Transparency"}</span>
        <h2 className={heading}>{transparency?.heading ?? "How Your Donations Are Utilized"}</h2>
        <p className={sub}>
          {transparency?.intro ??
            "We are dedicated to using your contributions to foster positive change across various essential areas:"}
        </p>

        <div className="mt-10 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
          {items.map((item, index) => {
            const isOpen = openAccordionIndex === index;
            return (
              <div
                key={item.label}
                className={`overflow-hidden rounded-2xl border bg-card transition-colors ${
                  isOpen ? "border-emerald-500/60" : "border-border hover:border-emerald-500/40"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onToggleAccordion(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:text-emerald-600"
                >
                  <span className="flex items-center gap-3 text-sm font-semibold text-foreground">
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </span>
                  {isOpen ? (
                    <Minus className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </button>
                {isOpen && (
                  <p className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                    {item.content}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
