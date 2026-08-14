"use client";

import { transformCards } from "../constants";
import { container } from "../ui";
import { useDonateContent } from "../useDonateContent";

export default function DonateTransformSection() {
  const { transformLives, targetedImpact } = useDonateContent();

  // The seed splits this into a lead card ("Targeted Impact") plus three
  // supporting ones; the bundled copy already carries all four together.
  const cards = targetedImpact?.items
    ? [
        {
          icon: "🎯",
          title: targetedImpact.heading ?? "Targeted Impact",
          description: targetedImpact.intro ?? "",
        },
        ...targetedImpact.items.map((item) => ({
          icon: item.icon,
          title: item.title,
          description: item.body,
        })),
      ]
    : transformCards;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 py-16 sm:py-20">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className={`${container} relative`}>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              Our Mission
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {transformLives?.heading ?? "Transform Lives with Your Support"}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-emerald-50/70 sm:text-base">
              {transformLives?.body ??
                "Your donation, no matter the size, has the power to change someone's life. By contributing to Student Square, you become a vital part of a movement dedicated to education, environmental sustainability, community well-being, and skill development."}
            </p>
            <blockquote className="mt-7 border-l-2 border-emerald-400/60 pl-5 text-base italic leading-relaxed text-emerald-100 sm:text-lg">
              &ldquo;
              {transformLives?.quote ??
                "Together, we can create a lasting impact and build a better tomorrow. We aim to create a chain effect for sustainable development in society."}
              &rdquo;
            </blockquote>
          </div>

          <div className="space-y-3">
            {cards.map((card) => (
              <div
                key={card.title}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-lg">
                  {card.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{card.title}</div>
                  <p className="mt-1 text-[13px] leading-relaxed text-emerald-50/60">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
