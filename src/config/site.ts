export const siteConfig = {
  name: "Student Square",
  description:
    "A youth-led platform that provides counselling, advocacy, and community programs to help students and families thrive.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://studentsquare.org",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/studentsquare",
    github: "https://github.com/studentsquare",
  },
} as const;

export type SiteConfig = typeof siteConfig;
