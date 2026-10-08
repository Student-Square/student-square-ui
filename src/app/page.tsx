import Header from "@/components/common/Header/Header";
import Hero from "@/components/sections/Hero/Hero";
import Stats from "@/components/sections/Stats/Stats";
import Features from "@/components/sections/Features/Features";
import OurProjects from "@/components/sections/Projects/OurProjects";
import Stories from "@/components/sections/Stories/Stories";
import Video from "@/components/sections/Video/Video";
import News from "@/components/sections/News/News";
import { TestimonialsSection } from "@/components/sections/Testimonials/TestimonialsSection";
// Temporarily hidden on homepage — keep import for easy restore.
// import BlogSection from "@/components/sections/Blog/BlogSection";
import Contact from "@/components/sections/Contact/Contact";
import Footer from "@/components/common/Footer/Footer";
import SectionDivider from "@/components/ui/section-divider";
import T from "@/components/i18n/T";
import type { Metadata } from "next";

// The homepage is where the brand and the core services rank together;
// "absolute" skips the layout's " | Student Square" suffix.
export const metadata: Metadata = {
  title: { absolute: "Student Square — Student Counselling & Career Guidance in Bangladesh" },
  description:
    "One-to-one student counselling, career guidance, scholarships and parent advocacy across Bangladesh, from a youth-led non-profit based in Rajshahi.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* The hero is image cards with no headline, so the page had no <h1>.
          Screen readers and search engines both use it as the page's title. */}
      <h1 className="sr-only">
        <T k="home.h1" />
      </h1>
      <div className="relative z-10">
        <Header />
        <Hero />
        <Stats />
        <Features />
        <Video />
        <SectionDivider />
        <OurProjects />
        <Stories />
        <News />
        {/* <BlogSection /> — Student Square Blog, hidden for now */}
        <TestimonialsSection />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
