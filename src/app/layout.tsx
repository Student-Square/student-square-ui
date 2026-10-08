import React from "react"
import type { Metadata, Viewport } from "next";
import { Saira, JetBrains_Mono, Space_Grotesk, DM_Sans, Pacifico, Oswald, Hind_Siliguri } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/common/theme-provider";
import { Providers } from "@/components/common/Providers";
import { Toaster } from "@/components/ui/sonner";
import AnalyticsTracker from "@/components/common/AnalyticsTracker";
import { serializeJsonLd } from "@/lib/jsonLd";
import { siteConfig } from "@/config/site";
import "./globals.css";

const saira = Saira({
  subsets: ["latin"],
  variable: "--font-saira",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
});

// Saira and Oswald have no Bengali glyphs. Only the bengali subset is loaded,
// and its unicode-range means English-only pages never download it.
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  variable: "--font-bangla",
  weight: ["300", "400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  variable: "--font-pacifico",
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://studentsquare.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Pages set only their own name; the brand is appended here. A page without
  // a title falls back to the default — which is exactly the duplicate-title
  // problem, so every public page should set one (see lib/seo.ts).
  title: {
    default: "Student Square | Empowering Students & Communities",
    template: "%s | Student Square",
  },
  description:
    "Student Square is a youth-led platform that provides counselling, advocacy, and community programs to help students and families thrive in their educational journey.",
  generator: "Student Square",
  keywords: [
    "student counselling",
    "education",
    "career guidance",
    "mental health",
    "advocacy",
    "scholarships",
    "community",
    "youth volunteers",
    "student support",
  ],
  authors: [{ name: "Student Square" }],
  openGraph: {
    title: "Student Square | Empowering Students & Communities",
    description:
      "Youth-led platform connecting students, volunteers, and communities through counselling, projects, and real-life opportunities.",
    url: "/",
    siteName: "Student Square",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Student Square — counselling, advocacy, and community programs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Square | Empowering Students & Communities",
    description:
      "Youth-led platform connecting students, volunteers, and communities through counselling, projects, and real-life opportunities.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

// The @id is what other pages' JSON-LD (Person.affiliation, BlogPosting.publisher)
// point at, so Google joins them into one entity. sameAs is how it learns the
// social profiles belong to this site rather than to another "StudentSquare".
const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NGO",
      "@id": `${siteUrl}/#organization`,
      name: "Student Square Foundation",
      alternateName: ["Student Square", "StudentSquare", "স্টুডেন্ট স্কয়ার"],
      url: siteUrl,
      logo: `${siteUrl}/images/ss-logo.png`,
      image: `${siteUrl}/opengraph-image`,
      description: siteConfig.description,
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phoneTel.replace("tel:", ""),
      address: {
        "@type": "PostalAddress",
        streetAddress: "Model Thana Road",
        addressLocality: "Godagari",
        addressRegion: "Rajshahi",
        addressCountry: "BD",
      },
      areaServed: { "@type": "Country", name: "Bangladesh" },
      sameAs: Object.values(siteConfig.social),
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Student Square",
      url: siteUrl,
      inLanguage: ["en", "bn"],
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/search?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
  width: "device-width",
  initialScale: 1,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Extensions such as Grammarly add attributes to <body> before React
          hydrates, which React reports as a mismatch we cannot fix. */}
      <body
        suppressHydrationWarning
        className={`${saira.variable} ${oswald.variable} ${hindSiliguri.variable} ${jetBrainsMono.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(orgJsonLd) }}
        />
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            {children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </Providers>
        <AnalyticsTracker />
        <Analytics />
      </body>
    </html>
  );
}
