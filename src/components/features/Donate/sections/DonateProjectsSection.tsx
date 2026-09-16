"use client";

import { projectCards } from "../constants";
import { container, eyebrow, heading, sub } from "../ui";
import { useGetCampaignsQuery } from "@/redux/features/campaigns/campaignsApi";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/** Emoji per project, keyed by slug — the API carries no icon of its own. */
const ICONS: Record<string, string> = {
  "counter-climate-change": "🌿",
  "amar-bhai-er-eid": "🕌",
  "one-minute-investment": "📚",
  "health-care-for-all": "🏥",
  "beyond-the-journey": "🎯",
};

export default function DonateProjectsSection() {
  const { data: campaigns } = useGetCampaignsQuery({ status: "ACTIVE" });
  const { t, pick, tr } = useLanguage();

  const projects = campaigns?.length
    ? campaigns.map((c) => ({
        key: c.slug,
        icon: ICONS[c.slug] ?? "🌱",
        title: pick(c.title, c.titleBn),
        description: pick(c.summary, c.summaryBn),
      }))
    : projectCards.map((p) => ({ key: p.title, icon: p.icon, title: tr(p.title), description: tr(p.description) }));

  return (
    <section id="projects" className="py-14 sm:py-20">
      <div className={container}>
        <span className={eyebrow}>{t("donate.projectsEyebrow")}</span>
        <h2 className={heading}>{t("donate.projectsHeading")}</h2>
        <p className={sub}>{t("donate.projectsBody")}</p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.key}
              className="flex gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-emerald-500/50"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl dark:bg-emerald-950/40">
                {project.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">{project.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
