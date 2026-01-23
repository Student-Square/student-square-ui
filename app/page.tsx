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
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import Aurora from "@/components/ui/aurora-effect";
import SectionDivider from "@/components/ui/section-divider";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Global Aurora Background - fixed to viewport, visible on all pages */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <Aurora 
          amplitude={1.2}
          blend={0.6}
          speed={0.5}
        />
        <div className="absolute inset-0 bg-background/60 dark:bg-background/70" />
      </div>
      
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
        <TestimonialsSection />
        <Partners />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
