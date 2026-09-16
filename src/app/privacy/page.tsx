import type { Metadata } from "next";
import PrivacyContent from "./_components/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Notice | Student Square",
  description:
    "What Student Square collects, why, who can see it, and how long we keep it.",
};

/**
 * The Privacy Notice registration links to. The body, including the FR-11-004
 * Super Admin disclosure, is in PrivacyContent.
 */
export default function PrivacyPage() {
  return <PrivacyContent />;
}
