import type { Metadata } from "next";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { NAVBAR_PAD_TOP } from "@/components/common/Header/navbarHeight";
import RefundContent from "./_components/RefundContent";

export const metadata: Metadata = {
  title: "Return and Refund Policy | Student Square",
  description:
    "Refunds are completed within 7 to 10 working days.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className={NAVBAR_PAD_TOP}>
        <RefundContent />
      </div>
      <Footer />
    </div>
  );
}
