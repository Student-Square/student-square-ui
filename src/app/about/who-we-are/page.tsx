'use client';

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { getMembersByCategory, type TeamMember } from "@/data/team";
import { ChevronLeft, ChevronRight } from "lucide-react";

function GridCard({ member }: { member: TeamMember }) {
  return (
    <Link href={`/about/who-we-are/${member.slug}`} className="group block text-center">
      <div className="overflow-hidden rounded-lg aspect-square bg-muted mb-3">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <p className="font-semibold text-sm text-foreground group-hover:text-emerald-600 transition-colors leading-snug">
        {member.name}
      </p>
      <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">
        {member.role}
      </p>
    </Link>
  );
}

function BoardCard({ member }: { member: TeamMember }) {
  return (
    <Link href={`/about/who-we-are/${member.slug}`} className="group block text-center">
      <div className="overflow-hidden rounded-xl aspect-square bg-muted mb-4">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <p className="font-bold text-base text-emerald-600 group-hover:text-emerald-700 transition-colors underline underline-offset-2">
        {member.name}
      </p>
      <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
        {member.role}
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
  members: TeamMember[];
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10">
        {title}
      </h2>
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
  const board = getMembersByCategory("board");
  const advisory = getMembersByCategory("advisory");
  const leadership = getMembersByCategory("leadership");
  const management = getMembersByCategory("management");

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 h-[55vh] min-h-[320px] w-full overflow-hidden">
        <img
          src="/images/student-square-introduction-presention-by-Humayra-Nasrin.jpg"
          alt="Who We Are"
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
            Who We Are
          </motion.h1>
        </div>
      </section>

      {/* Our People intro */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl font-bold text-foreground mb-3">Our People</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              We&apos;re a bunch of student ninjas ready to unleash our superpowers and help our fellow mates reach
              their goals by boosting their brain muscles and making better decisions. We feel and breathe the same
              as we have faced the same difficulty. We wholeheartedly assess the students&apos; goals and the
              challenges they are looking to overcome. We are from the future, working effortlessly reminiscing our
              past experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Board of Trustees */}
      <section className="bg-muted/30 py-14 lg:py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-8">
          <PaginatedSection
            title="Board of Trustees"
            members={board}
            perPage={4}
            variant="board"
          />
        </div>
      </section>

      {/* Advisory Board */}
      <section className="bg-background py-14 lg:py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-8">
          <PaginatedSection
            title="Advisory Board"
            members={advisory}
            perPage={5}
          />
        </div>
      </section>

      {/* Leadership Team */}
      <section className="bg-muted/30 py-14 lg:py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-8">
          <PaginatedSection
            title="Leadership Team"
            members={leadership}
            perPage={10}
          />
        </div>
      </section>

      {/* Management Team */}
      <section className="bg-background py-14 lg:py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-8">
          <PaginatedSection
            title="Management Team"
            members={management}
            perPage={10}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
