'use client';

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { useGetBoardGroupsQuery, useGetEditablePageQuery } from "@/redux/features/content/contentApi";
import type { ApiBoardAssignment } from "@/types/content";
import { BriefcaseBusiness, ChevronLeft, ChevronRight, Lightbulb, Loader2, ShieldCheck, Users, type LucideIcon } from "lucide-react";

const PLACEHOLDER_AVATAR = "/images/student-square-school-session.jpg";

const SECTION_META: Record<string, { icon: LucideIcon; eyebrow: string }> = {
  "Our People": { icon: Users, eyebrow: "" },
  "Board of Trustees": { icon: ShieldCheck, eyebrow: "Governance" },
  "Advisory Board": { icon: Lightbulb, eyebrow: "Guidance" },
  "Leadership Team": { icon: Users, eyebrow: "Leadership" },
  "Management Team": { icon: BriefcaseBusiness, eyebrow: "Operations" },
};

function SectionHeading({ title, center = true }: { title: string; center?: boolean }) {
  const meta = SECTION_META[title] ?? { icon: Users, eyebrow: "Student Square" };
  const Icon = meta.icon;

  return (
    <div className={center ? "mb-10 text-center" : "mb-5"}>
      {meta.eyebrow ? (
        <div
          className={`inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300 ${
            center ? "" : "mb-0"
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          <span>{meta.eyebrow}</span>
        </div>
      ) : null}
      <h2 className={`mt-4 text-2xl font-bold tracking-[0.02em] text-foreground sm:text-3xl ${center ? "" : "text-left"}`}>
        {title}
      </h2>
    </div>
  );
}

function GridCard({ member }: { member: ApiBoardAssignment }) {
  const href = `/about/who-we-are/${member.slug ?? member.userId}`;

  return (
    <Link href={href} className="group block text-center">
      <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-muted">
        <img
          src={member.avatarUrl ?? PLACEHOLDER_AVATAR}
          alt={member.fullName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <p className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-emerald-600">
        {member.fullName}
      </p>
      <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">
        {member.roleLabel}
      </p>
    </Link>
  );
}

function BoardCard({ member }: { member: ApiBoardAssignment }) {
  const href = `/about/who-we-are/${member.slug ?? member.userId}`;

  return (
    <Link href={href} className="group block text-center">
      <div className="mb-4 aspect-square overflow-hidden rounded-xl bg-muted">
        <img
          src={member.avatarUrl ?? PLACEHOLDER_AVATAR}
          alt={member.fullName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <p className="text-base font-bold text-emerald-600 transition-colors group-hover:text-emerald-700">
        {member.fullName}
      </p>
      <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
        {member.roleLabel}
      </p>
    </Link>
  );
}

function Pagination({
  page,
  total,
  perPage,
  onChange,
}: {
  page: number;
  total: number;
  perPage: number;
  onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-10 flex-wrap">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
              p === page
                ? "bg-emerald-600 text-white"
                : "hover:bg-muted text-foreground"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function PaginatedSection({
  title,
  members,
  perPage,
  variant = "grid",
}: {
  title: string;
  members: ApiBoardAssignment[];
  perPage: number;
  variant?: "board" | "grid";
}) {
  const [page, setPage] = useState(1);
  const start = (page - 1) * perPage;
  const visible = members.slice(start, start + perPage);

  const gridCols =
    variant === "board"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

  if (members.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <SectionHeading title={title} />
      <div className={`grid ${gridCols} gap-6`}>
        {visible.map((m) =>
          variant === "board" ? (
            <BoardCard key={m.id} member={m} />
          ) : (
            <GridCard key={m.id} member={m} />
          )
        )}
      </div>
      <Pagination
        page={page}
        total={members.length}
        perPage={perPage}
        onChange={(p) => {
          setPage(p);
          window.scrollBy({ top: -400, behavior: "smooth" });
        }}
      />
    </motion.div>
  );
}

export default function WhoWeArePage() {
  const { data: page } = useGetEditablePageQuery("about-who-we-are");
  const { data: groups, isLoading, isError } = useGetBoardGroupsQuery();

  const bannerUrl = page?.bannerUrl ?? "/images/student-square-introduction-presention-by-Humayra-Nasrin.jpg";
  const heroTitle = page?.heroTitle || "Who We Are";
  const ourPeopleSection = page?.sections.find((s) => s.heading.toLowerCase().includes("people") || s.order === 0);
  const ourPeopleBody = ourPeopleSection?.body ?? "We’re a bunch of student ninjas ready to unleash our superpowers and help our fellow mates reach their goals by boosting their brain muscles and making better decisions.";

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 h-[35vh] sm:h-[45vh] lg:h-[55vh] min-h-[220px] w-full overflow-hidden">
        <img
          src={bannerUrl}
          alt={heroTitle}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        <div className="absolute bottom-0 left-0 px-6 pb-10 sm:px-10 lg:px-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
          >
            {heroTitle}
          </motion.h1>
        </div>
      </section>

      {/* Our People intro */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-[90%] mx-auto"
          >
            <SectionHeading title="Our People" center={false} />
            <p className="text-base text-muted-foreground leading-relaxed">
              {ourPeopleBody}
            </p>
          </motion.div>
        </div>
      </section>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-20">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading…
        </div>
      )}
      {isError && (
        <p className="text-center text-sm text-red-600 py-20">Failed to load team data.</p>
      )}

      {groups && (
        <>
          {/* Board of Trustees */}
          {groups.board.length > 0 && (
            <section className="bg-muted/30 py-14 lg:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
                <div className="w-[90%] mx-auto">
                  <PaginatedSection
                    title="Board of Trustees"
                    members={groups.board}
                    perPage={4}
                    variant="board"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Advisory Board */}
          {groups.advisory.length > 0 && (
            <section className="bg-background py-14 lg:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
                <div className="w-[90%] mx-auto">
                  <PaginatedSection
                    title="Advisory Board"
                    members={groups.advisory}
                    perPage={5}
                  />
                </div>
              </div>
            </section>
          )}

          {/* Leadership Team */}
          {groups.leadership.length > 0 && (
            <section className="bg-muted/30 py-14 lg:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
                <div className="w-[90%] mx-auto">
                  <PaginatedSection
                    title="Leadership Team"
                    members={groups.leadership}
                    perPage={10}
                  />
                </div>
              </div>
            </section>
          )}

          {/* Management Team */}
          {groups.management.length > 0 && (
            <section className="bg-background py-14 lg:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
                <div className="w-[90%] mx-auto">
                  <PaginatedSection
                    title="Management Team"
                    members={groups.management}
                    perPage={10}
                  />
                </div>
              </div>
            </section>
          )}

          {groups.board.length === 0 &&
            groups.advisory.length === 0 &&
            groups.leadership.length === 0 &&
            groups.management.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-20">
                No team members have been added yet.
              </p>
            )}
        </>
      )}

      <Footer />
    </main>
  );
}
