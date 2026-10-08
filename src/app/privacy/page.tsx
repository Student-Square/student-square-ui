import type { Metadata } from "next";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { NAVBAR_PAD_TOP } from "@/components/common/Header/navbarHeight";
import PrivacyContent from "./_components/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "What Student Square collects, why, who can see it, and how long we keep it.",
  alternates: { canonical: "/privacy" },
};

/**
 * The Privacy Notice registration links to. The body, including the FR-11-004
 * Super Admin disclosure, is in PrivacyContent.
 */
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className={NAVBAR_PAD_TOP}>
        <PrivacyContent />
      </div>
      <Footer />
    </div>
  );
}
