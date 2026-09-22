import type { Metadata } from "next";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { NAVBAR_PAD_TOP } from "@/components/common/Header/navbarHeight";
import DeliveryContent from "./_components/DeliveryContent";

export const metadata: Metadata = {
  title: "Delivery Policy | Student Square",
  description:
    "A confirmed donation is recorded at once and the receipt is issued immediately.",
};

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className={NAVBAR_PAD_TOP}>
        <DeliveryContent />
      </div>
      <Footer />
    </div>
  );
}
