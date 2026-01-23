'use client';

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Aurora from "@/components/ui/aurora-effect";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const aboutCards = [
  {
    id: 1,
    title: "Our Vision and Mission",
    description: "Learn about our vision to foster an inclusive society",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    href: "/about/mission-vision",
    icon: "📋"
  },
  {
    id: 2,
    title: "Who We Are",
    description: "Discover the team and values behind Student Square",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    href: "/about/who-we-are",
    icon: "👥"
  },
  {
    id: 3,
    title: "Where We Work",
    description: "Explore our global presence and impact across countries",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    href: "/about/where-we-work",
    icon: "🌍"
  },
  {
    id: 4,
    title: "Reports & Financials",
    description: "Access our annual reports and financial transparency",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    href: "/about/reports",
    icon: "📊"
  },
  {
    id: 5,
    title: "Press",
    description: "Media coverage and news about Student Square",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    href: "/about/press",
    icon: "📰"
  },
  {
    id: 6,
    title: "Archive",
    description: "Browse past initiatives and historical content",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    href: "/about/archive",
    icon: "📚"
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen relative">
      {/* Aurora Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <Aurora 
          colorStops={["#10B981", "#030712", "#10B981"]}
          amplitude={1.2}
          blend={0.6}
          speed={0.5}
        />
        <div className="absolute inset-0 bg-background/60 dark:bg-background/70" />
      </div>

      <div className="relative z-10">
        <Header />

        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl font-bold tracking-tight text-foreground mb-6">
                About Student Square
              </h1>
              <p className="mx-auto max-w-3xl text-base sm:text-lg lg:text-xl 2xl:text-2xl text-muted-foreground">
                Student Square is a non-profit organization dedicated to counselling and community support. We empower individuals through education and skill development, creating a society free from discrimination and equipped to tackle global challenges.
              </p>
              <Link href="/about/mission-vision">
                <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white hover:bg-emerald-700 transition-colors">
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Main Feature Card */}
        <section className="relative py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/about/mission-vision">
                <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50/50 to-background/50 dark:from-emerald-950/30 dark:to-background/50 border border-emerald-500/20 cursor-pointer hover:border-emerald-500/50 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row items-center gap-8 p-8 sm:p-10">
                    <div className="flex-1">
                      <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                        Our Vision and Mission
                      </h2>
                      <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 leading-relaxed">
                        Discover the foundational vision and mission that drives Student Square to empower every individual and build an inclusive society.
                      </p>
                      <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold group-hover:gap-4 transition-all">
                        Explore <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="w-full lg:w-64 h-48 lg:h-64 relative rounded-2xl overflow-hidden flex-shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop" 
                        alt="Our Vision and Mission"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Card Grid */}
        <section className="relative py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {aboutCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Link href={card.href}>
                    <div className="group relative overflow-hidden rounded-2xl bg-background border border-border/40 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer h-full">
                      <div className="aspect-video overflow-hidden bg-gradient-to-br from-emerald-100/50 to-background relative">
                        <img 
                          src={card.image || "/placeholder.svg"} 
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-emerald-600 transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {card.description}
                        </p>
                        <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm group-hover:gap-3 transition-all">
                          Learn More <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
