import Header from "@/components/common/Header/Header";
import Hero from "@/components/sections/Hero/Hero";
import Stats from "@/components/sections/Stats/Stats";
import Features from "@/components/sections/Features/Features";
import OurProjects from "@/components/sections/Projects/OurProjects";
import Stories from "@/components/sections/Stories/Stories";
import Video from "@/components/sections/Video/Video";
import News from "@/components/sections/News/News";
import { TestimonialsSection } from "@/components/sections/Testimonials/TestimonialsSection";
import BlogSection from "@/components/sections/Blog/BlogSection";
import ExpandableCards from "@/components/features/ExpandableCards/ExpandableCards";
import Contact from "@/components/sections/Contact/Contact";
import Footer from "@/components/common/Footer/Footer";
import SectionDivider from "@/components/ui/section-divider";

export default function Home() {
  return (
    <main className="min-h-screen relative">
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
        <BlogSection />
        <TestimonialsSection />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
