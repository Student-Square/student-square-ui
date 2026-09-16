import type { Metadata } from "next";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import PageHero from "@/components/common/PageHero";
import T from "@/components/i18n/T";
import ReportsLibrary from "@/components/features/Reports/ReportsLibrary";

export const metadata: Metadata = {
  title: "Annual Reports & Financials | Student Square",
  description:
    "Annual reports, highlights, program reports and financial statements from Student Square.",
};

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <PageHero
        imageSrc="/images/student-square-one-minute-investment-project.jpg"
        imageAlt="Annual Reports & Financials"
        imageAltKey="reports.title"
        title={<T k="reports.title" />}
      />

      <section className="bg-background py-14 lg:py-20">
        <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            <T k="reports.intro" />
          </p>

          <ReportsLibrary />

          <div className="rounded-xl border border-border p-6">
            <h2 className="mb-3 text-xl font-bold text-foreground">
              <T k="reports.commitment" />
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <T k="reports.commitmentBody" />
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
