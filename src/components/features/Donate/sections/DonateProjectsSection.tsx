"use client";

import Link from "next/link";
import { HandHeart, Heart } from "lucide-react";
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

type ProjectItem = {
  slug: string;
  icon: string;
  title: string;
  description: string;
  image?: string;
};

/**
 * Every project the donor can give to, and the general fund. This is where a
 * donor switches project: each photo reveals a donate button on hover (always
 * shown on touch screens), and the project the page is for is marked.
 */
export default function DonateProjectsSection({
  selectedSlug,
  onSelect,
}: {
  /** Given on /donate: the tile picks the project in place, with no page load. */
  selectedSlug: string;
  onSelect?: (slug: string) => void;
}) {
  const { data: campaigns } = useGetCampaignsQuery({ status: "ACTIVE" });
  const { t, pick, tr } = useLanguage();

  const projects: ProjectItem[] = campaigns?.length
    ? campaigns.map((c) => ({
        slug: c.slug,
        icon: ICONS[c.slug] ?? "🌱",
        title: pick(c.title, c.titleBn),
        description: pick(c.summary, c.summaryBn),
        image: c.coverImage?.url,
      }))
    : projectCards.map((p) => ({ slug: p.slug, icon: p.icon, title: tr(p.title), description: tr(p.description) }));

  return (
    <section id="projects" className="scroll-mt-20 py-14 sm:py-20">
      <div className={container}>
        <span className={eyebrow}>{t("donate.projectsEyebrow")}</span>
        <h2 className={heading}>{t("donate.projectsHeading")}</h2>
        <p className={sub}>{t("donate.projectsBody")}</p>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectTile
              key={project.slug}
              project={project}
              selected={project.slug === selectedSlug}
              onSelect={onSelect}
            />
          ))}
          <ProjectTile
            project={{
              slug: "general",
              icon: "🤲",
              title: t("donate.generalTitle"),
              description: t("donate.generalBody"),
            }}
            selected={selectedSlug === "general"}
            onSelect={onSelect}
            general
          />
        </ul>
      </div>
    </section>
  );
}

function ProjectTile({
  project,
  selected,
  onSelect,
  general = false,
}: {
  project: ProjectItem;
  selected: boolean;
  onSelect?: (slug: string) => void;
  general?: boolean;
}) {
  const { t } = useLanguage();
  // Already selected, or selectable in place: the button only scrolls back up
  // to the form. Otherwise it opens that project's own donate page.
  const href = selected || onSelect ? "#donate-main" : `/donate/${project.slug}`;

  return (
    <li
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow duration-300 hover:shadow-xl hover:shadow-emerald-900/10 ${
        selected ? "border-emerald-500 ring-2 ring-emerald-500/25" : "border-border"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 dark:from-emerald-950/50 dark:to-teal-950/30 dark:text-emerald-400">
            {general ? <HandHeart className="h-14 w-14" /> : <span className="text-5xl">{project.icon}</span>}
          </div>
        )}

        {selected && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
            {t("donate.selectedProject")}
          </span>
        )}

        {/* Hidden until hover or keyboard focus on large screens; touch
            screens have no hover, so there it is always shown. */}
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-black/25 to-transparent p-4 transition-opacity duration-300 lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
          <Link
            href={href}
            onClick={
              onSelect &&
              ((event) => {
                // The parent does the scrolling, so the hash never lands in the
                // address bar next to the project's own URL.
                event.preventDefault();
                if (!selected) onSelect(project.slug);
                else document.getElementById("donate-main")?.scrollIntoView({ behavior: "smooth" });
              })
            }
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-emerald-700 lg:translate-y-3 lg:group-focus-within:translate-y-0 lg:group-hover:translate-y-0"
          >
            <Heart className="h-4 w-4" />
            {general ? t("donate.generalCta") : t("donate.donateToProject")}
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="flex items-start gap-2 text-base font-bold text-foreground">
          <span aria-hidden>{project.icon}</span>
          <span>{project.title}</span>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
      </div>
    </li>
  );
}
