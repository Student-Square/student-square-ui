import type { Metadata } from "next";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import PageHero from "@/components/common/PageHero";
import Contact from "@/components/sections/Contact/Contact";

export const metadata: Metadata = {
  title: "Find Us | Student Square",
  description:
    "Visit our office in Godagari, Rajshahi, or send us a message about counselling support, volunteering, and partnerships.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <PageHero
        imageSrc="/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg"
        imageAlt="Student Square team at a group counselling workshop in Godagari, Rajshahi"
        title="Find Us"
      />

      <Contact />

      <Footer />
    </main>
  );
}
