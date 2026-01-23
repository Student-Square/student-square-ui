'use client';

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Aurora from "@/components/ui/aurora-effect";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const countries = [
  {
    name: "Bangladesh",
    cities: ["Rajshahi", "Joypurhat", "Chapainawabganj", "Kushtia"]
  },
  {
    name: "United Kingdom",
    cities: ["Hampshire"]
  },
  {
    name: "India",
    cities: ["Mumbai", "Delhi", "Bangalore"]
  },
  {
    name: "Pakistan",
    cities: ["Karachi", "Lahore"]
  },
  {
    name: "Nepal",
    cities: ["Kathmandu"]
  },
  {
    name: "Sri Lanka",
    cities: ["Colombo"]
  }
];

export default function WhereWeWorkPage() {
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

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/about">
                <button className="mb-6 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors font-semibold">
                  <ArrowLeft className="h-4 w-4" />
                  Back to About
                </button>
              </Link>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl font-bold tracking-tight text-foreground mb-6">
                Where We Work
              </h1>
              <p className="max-w-3xl text-lg text-muted-foreground">
                Our 5,600+ team members live and work in over 40 countries around the world. 84% of them are from the countries where they work.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Map Section */}
        <section className="relative py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20 bg-background/50 backdrop-blur-sm p-8 lg:p-12">
                {/* SVG World Map */}
                <svg 
                  viewBox="0 0 960 600" 
                  className="w-full h-auto"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Background */}
                  <rect width="960" height="600" fill="hsl(var(--muted-foreground) / 0.05)" />
                  
                  {/* Grid */}
                  <g stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3">
                    <line x1="0" y1="150" x2="960" y2="150" />
                    <line x1="0" y1="300" x2="960" y2="300" />
                    <line x1="0" y1="450" x2="960" y2="450" />
                    <line x1="240" y1="0" x2="240" y2="600" />
                    <line x1="480" y1="0" x2="480" y2="600" />
                    <line x1="720" y1="0" x2="720" y2="600" />
                  </g>

                  {/* Simplified continents as regions */}
                  {/* Americas */}
                  <path d="M 80 150 L 120 130 L 140 180 L 100 200 Z" fill="hsl(var(--muted-foreground) / 0.1)" stroke="hsl(var(--border))" strokeWidth="1" />
                  {/* Europe */}
                  <path d="M 400 120 L 450 110 L 460 150 L 420 160 Z" fill="hsl(var(--muted-foreground) / 0.1)" stroke="hsl(var(--border))" strokeWidth="1" />
                  {/* Africa */}
                  <path d="M 480 200 L 530 180 L 550 300 L 480 320 Z" fill="#10B98133" stroke="#10B981" strokeWidth="1.5" />
                  {/* Asia */}
                  <path d="M 550 150 L 700 140 L 730 200 L 580 220 Z" fill="#10B98133" stroke="#10B981" strokeWidth="1.5" />
                  {/* South Asia */}
                  <path d="M 650 240 L 680 235 L 690 280 L 660 285 Z" fill="#10B98133" stroke="#10B981" strokeWidth="1.5" />
                  {/* Australia */}
                  <path d="M 750 350 L 780 340 L 790 380 L 760 390 Z" fill="hsl(var(--muted-foreground) / 0.1)" stroke="hsl(var(--border))" strokeWidth="1" />

                  {/* Marker circles for presence */}
                  {[
                    { cx: "100", cy: "180" }, // Americas
                    { cx: "430", cy: "135" }, // Europe
                    { cx: "510", cy: "250" }, // Africa
                    { cx: "665", cy: "265" }, // South Asia (Bangladesh)
                    { cx: "420", cy: "125" }, // UK
                    { cx: "700", cy: "180" }, // East Asia
                  ].map((pos, i) => (
                    <g key={i}>
                      <circle 
                        cx={pos.cx} 
                        cy={pos.cy} 
                        r="8" 
                        fill="#10B981" 
                        opacity="0.8"
                      />
                      <circle 
                        cx={pos.cx} 
                        cy={pos.cy} 
                        r="8" 
                        fill="none" 
                        stroke="#10B981" 
                        strokeWidth="2"
                        opacity="0.4"
                      >
                        <animate attributeName="r" from="8" to="14" dur="2s" repeatCount="indefinite" opacity="0" />
                      </circle>
                    </g>
                  ))}

                  {/* Labels */}
                  <text x="100" y="220" fontSize="12" fill="currentColor" textAnchor="middle">Americas</text>
                  <text x="430" y="180" fontSize="12" fill="currentColor" textAnchor="middle">Europe</text>
                  <text x="510" y="340" fontSize="12" fill="currentColor" textAnchor="middle">Africa</text>
                  <text x="665" y="310" fontSize="12" fill="currentColor" textAnchor="middle">South Asia</text>
                  <text x="700" y="230" fontSize="12" fill="currentColor" textAnchor="middle">East Asia</text>
                </svg>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="relative py-12 lg:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 2xl:max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                The work we do in each country is informed by our partners there: local community members, government officials, and other changemakers who are committed to transforming their communities for good.
              </p>
              <p className="text-sm text-muted-foreground italic border-l-4 border-emerald-500 pl-4">
                Note: This list is regularly updated, and does not represent all of our country operations. We add pages as we ramp up programs and shift from emergency response to longer-term development efforts.
              </p>
            </motion.div>

            {/* Countries Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {countries.map((country, index) => (
                  <div 
                    key={index}
                    className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500/50 transition-all duration-300"
                  >
                    <h3 className="font-heading text-xl font-bold text-foreground mb-3">{country.name}</h3>
                    <ul className="space-y-2">
                      {country.cities.map((city, idx) => (
                        <li key={idx} className="text-muted-foreground">• {city}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
