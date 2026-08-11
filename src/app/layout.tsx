import React from "react"
import type { Metadata, Viewport } from "next";
import { Saira, JetBrains_Mono, Space_Grotesk, DM_Sans, Pacifico, Oswald } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/common/theme-provider";
import { Providers } from "@/components/common/Providers";
import { Toaster } from "@/components/ui/sonner";
import AnalyticsTracker from "@/components/common/AnalyticsTracker";
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
  title: "Student Square | Empowering Students & Communities",
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
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Square | Empowering Students & Communities",
    description:
      "Youth-led platform connecting students, volunteers, and communities through counselling, projects, and real-life opportunities.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Student Square",
  url: siteUrl,
  logo: "/favicon.ico",
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
      <body className={`${saira.variable} ${oswald.variable} ${jetBrainsMono.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
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
