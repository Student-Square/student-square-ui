import type { Metadata } from "next";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import ReportDetail from "@/components/features/Reports/ReportDetail";
import { serverGet } from "@/lib/serverApi";
import type { ApiReportDetail } from "@/types/reports";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const report = await serverGet<ApiReportDetail>(`/reports/${encodeURIComponent(slug)}`);
  if (!report) return { title: "Report | Student Square" };
  return {
    title: `${report.title} | Student Square`,
    description: report.summary?.slice(0, 160) ?? `${report.title} (${report.year})`,
  };
}

export default async function ReportPage({ params }: Params) {
  const { slug } = await params;
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ReportDetail slug={slug} />
      <Footer />
    </main>
  );
}
