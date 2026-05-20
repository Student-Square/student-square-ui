import type { ReactNode } from "react";
import Footer from "@/components/common/Footer/Footer";
import Header from "@/components/common/Header/Header";

export default function DonateLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen relative">
      <div className="relative z-10">
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
}
