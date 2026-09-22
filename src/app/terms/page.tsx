import type { Metadata } from "next";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { NAVBAR_PAD_TOP } from "@/components/common/Header/navbarHeight";
import TermsContent from "./_components/TermsContent";

export const metadata: Metadata = {
  title: "Terms of Use | Student Square",
  description:
    "Terms of Use for Student Square Foundation membership and platform services.",
};

/**
 * Terms of Use — linked from registration and the site footer.
 * Sensitive-data disclosure lives here (not as a separate registration checkbox).
 */
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className={NAVBAR_PAD_TOP}>
        <TermsContent />
      </div>
      <Footer />
    </div>
  );
}
