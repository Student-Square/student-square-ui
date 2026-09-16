import type { Metadata } from "next";
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
  return <TermsContent />;
}
