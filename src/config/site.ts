/**
 * Organisation contact details and social profiles — the one place they live.
 * The footer, contact section and partner page all read from here, so a
 * number or handle is never updated in one place and left stale in another.
 *
 * Social URLs are the canonical profile links, with the share-tracking query
 * strings the apps add (?mibextid, ?si, ?igsh) removed.
 */
export const siteConfig = {
  name: "Student Square",
  description:
    "A youth-led platform that provides counselling, advocacy, and community programs to help students and families thrive.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://studentsquare.org",
  ogImage: "/og-image.png",
  contact: {
    // Displayed with the country code, dialled in E.164 — a number without
    // +880 cannot be click-to-called from outside Bangladesh.
    // Same number as the server's site settings (seed-data/site.ts).
    phoneDisplay: "+880 1784-655856",
    phoneTel: "tel:+8801784655856",
    email: "studentsquarebd@gmail.com",
    whatsappDisplay: "+880 1768-810658",
    whatsappUrl: "https://wa.me/8801768810658",
  },
  social: {
    facebook: "https://www.facebook.com/share/1DVcvP6HqT/",
    linkedin: "https://www.linkedin.com/company/student-square-bd/",
    twitter: "https://x.com/StudentsquareBD",
    youtube: "https://youtube.com/@studentsquare-fi3ez",
    instagram: "https://www.instagram.com/studentsquarebd",
  },
  legal: {
    registration: "Registered under the Societies Registration Act, 1860, Bangladesh",
  },
} as const;

export type SiteConfig = typeof siteConfig;
