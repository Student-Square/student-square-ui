import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Stats from "@/components/Stats/Stats";
import Features from "@/components/Features/Features";
import OurProjects from "@/components/Projects/OurProjects";
import Video from "@/components/Video/Video";
import News from "@/components/News/News";
import Partners from "@/components/Partners/Partners";
import { TestimonialsSection } from "@/components/Testimonials/TestimonialsSection";
import BlogSection from "@/components/Blog/BlogSection";
import ExpandableCards from "@/components/ExpandableCards/ExpandableCards";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
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
        <News />
        <BlogSection />
        <ExpandableCards />
        <TestimonialsSection />
        <Partners />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
