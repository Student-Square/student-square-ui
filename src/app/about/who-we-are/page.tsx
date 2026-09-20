'use client';

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import PageHero from "@/components/common/PageHero";
import Container from "@/components/common/Container";
import { motion } from "motion/react";
import { fadeInWhileInView } from "@/lib/motion";
import { useGetBoardGroupsQuery, useGetEditablePageQuery } from "@/redux/features/content/contentApi";
import type { ApiBoardAssignment } from "@/types/content";
import { BriefcaseBusiness, ChevronLeft, ChevronRight, Lightbulb, Loader2, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import Pagination from "@/components/common/Pagination";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const PLACEHOLDER_AVATAR = "/images/student-square-school-session.jpg";

type SectionId = "people" | "board" | "advisory" | "leadership" | "management";

/** Heading text and eyebrow label are dictionary keys. */
const SECTION_META: Record<SectionId, { icon: LucideIcon; titleKey: string; eyebrowKey: string | null }> = {
  people: { icon: Users, titleKey: "team.ourPeople", eyebrowKey: null },
  board: { icon: ShieldCheck, titleKey: "team.board", eyebrowKey: "team.eyebrowGovernance" },
  advisory: { icon: Lightbulb, titleKey: "team.advisory", eyebrowKey: "team.eyebrowGuidance" },
  leadership: { icon: Users, titleKey: "team.leadership", eyebrowKey: "team.eyebrowLeadership" },
  management: { icon: BriefcaseBusiness, titleKey: "team.management", eyebrowKey: "team.eyebrowOperations" },
};

function SectionHeading({ section, title, center = true }: { section: SectionId; title?: string; center?: boolean }) {
  const { t } = useLanguage();
  const meta = SECTION_META[section];
  const Icon = meta.icon;
  const eyebrow = meta.eyebrowKey ? t(meta.eyebrowKey) : "";

  return (
    <div className={center ? "mb-10 text-center" : "mb-5"}>
      {eyebrow ? (
        <div
          className={`inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300 ${
            center ? "" : "mb-0"
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          <span>{eyebrow}</span>
        </div>
      ) : null}
      <h2 className={`mt-4 text-2xl font-bold tracking-[0.02em] text-foreground sm:text-3xl ${center ? "" : "text-left"}`}>
        {title ?? t(meta.titleKey)}
      </h2>
    </div>
  );
}

/**
 * A single team member tile. `board` is the larger, emphasized style used for
 * the Board of Trustees; `grid` is the compact style for everyone else.
 */
function MemberCard({
  member,
  variant = "grid",
}: {
  member: ApiBoardAssignment;
  variant?: "board" | "grid";
}) {
  const { tr } = useLanguage();
  const href = `/about/who-we-are/${member.slug}`;
  const isBoard = variant === "board";

  return (
    <Link href={href} className="group block text-center">
      <div
        className={`aspect-square overflow-hidden bg-muted ${
          isBoard ? "mb-4 rounded-xl" : "mb-3 rounded-lg"
        }`}
      >
        <img
          src={member.avatarUrl ?? PLACEHOLDER_AVATAR}
          alt={member.fullName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <p
        className={`transition-colors ${
          isBoard
            ? "text-base font-bold text-emerald-600 group-hover:text-emerald-700"
            : "text-sm font-semibold leading-snug text-foreground group-hover:text-emerald-600"
        }`}
      >
        {member.fullName}
      </p>
      <p
        className={`text-xs uppercase text-muted-foreground ${
          isBoard ? "mt-1 tracking-widest" : "mt-0.5 tracking-wide"
        }`}
      >
        {tr(member.roleLabel)}
      </p>
    </Link>
  );
}


function PaginatedSection({
  section,
  members,
  perPage,
  variant = "grid",
}: {
  section: SectionId;
  members: ApiBoardAssignment[];
  perPage: number;
  variant?: "board" | "grid";
}) {
  const { t, num } = useLanguage();
  const [page, setPage] = useState(1);
  const start = (page - 1) * perPage;
  const visible = members.slice(start, start + perPage);

  const gridCols =
    variant === "board"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

  if (members.length === 0) return null;

  return (
    <motion.div {...fadeInWhileInView}>
      <SectionHeading section={section} />
      <div className={`grid ${gridCols} gap-6`}>
        {visible.map((m) => (
          <MemberCard key={m.id} member={m} variant={variant} />
        ))}
      </div>
      <Pagination
        page={page}
        totalPages={Math.ceil(members.length / perPage)}
        onPageChange={(p) => {
          setPage(p);
          window.scrollBy({ top: -400, behavior: "smooth" });
        }}
        className="mt-10"
        labels={{
          prev: t("common.prev"),
          next: t("common.next"),
          pagination: t("common.pagination"),
        }}
        formatNumber={(n) => num(n, false)}
      />
    </motion.div>
  );
}

export default function WhoWeArePage() {
  const { data: page } = useGetEditablePageQuery("about-who-we-are");
  const { data: groups, isLoading, isError } = useGetBoardGroupsQuery();
  const { t, tr } = useLanguage();

  const bannerUrl = page?.bannerUrl ?? "/images/student-square-introduction-presention-by-Humayra-Nasrin.jpg";
  const heroTitle = page?.heroTitle || "Who We Are";
  const ourPeopleSection = page?.sections.find((s) => s.heading.toLowerCase().includes("people") || s.order === 0);
  const ourPeopleBody = ourPeopleSection?.body ?? "We’re a bunch of student ninjas ready to unleash our superpowers and help our fellow mates reach their goals by boosting their brain muscles and making better decisions.";

  return (
    <main className="min-h-screen">
      <Header overDarkHero />

      {/* Hero */}
      <PageHero imageSrc={bannerUrl} imageAlt={heroTitle} title={heroTitle} />

      {/* Our People intro */}
      <section className="bg-background py-12 lg:py-16">
        <Container>
          <motion.div {...fadeInWhileInView} className="w-[90%] mx-auto">
            <SectionHeading section="people" title={tr(ourPeopleSection?.heading ?? "Our People")} center={false} />
            <p className="text-base text-muted-foreground leading-relaxed">
              {tr(ourPeopleBody)}
            </p>
          </motion.div>
        </Container>
      </section>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-20">
          <Loader2 className="h-5 w-5 animate-spin" /> {t("common.loading")}
        </div>
      )}
      {isError && (
        <p className="text-center text-sm text-red-600 py-20">{t("team.loadFailed")}</p>
      )}

      {groups && (
        <>
          {/* Board of Trustees */}
          {groups.board.length > 0 && (
            <section className="bg-muted/30 py-14 lg:py-20">
              <Container>
                <div className="w-[90%] mx-auto">
                  <PaginatedSection
                    section="board"
                    members={groups.board}
                    perPage={4}
                    variant="board"
                  />
                </div>
              </Container>
            </section>
          )}

          {/* Advisory Board */}
          {groups.advisory.length > 0 && (
            <section className="bg-background py-14 lg:py-20">
              <Container>
                <div className="w-[90%] mx-auto">
                  <PaginatedSection
                    section="advisory"
                    members={groups.advisory}
                    perPage={5}
                  />
                </div>
              </Container>
            </section>
          )}

          {/* Leadership Team */}
          {groups.leadership.length > 0 && (
            <section className="bg-muted/30 py-14 lg:py-20">
              <Container>
                <div className="w-[90%] mx-auto">
                  <PaginatedSection
                    section="leadership"
                    members={groups.leadership}
                    perPage={10}
                  />
                </div>
              </Container>
            </section>
          )}

          {/* Management Team */}
          {groups.management.length > 0 && (
            <section className="bg-background py-14 lg:py-20">
              <Container>
                <div className="w-[90%] mx-auto">
                  <PaginatedSection
                    section="management"
                    members={groups.management}
                    perPage={10}
                  />
                </div>
              </Container>
            </section>
          )}

          {groups.board.length === 0 &&
            groups.advisory.length === 0 &&
            groups.leadership.length === 0 &&
            groups.management.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-20">
                {t("team.empty")}
              </p>
            )}
        </>
      )}

      <Footer />
    </main>
  );
}
