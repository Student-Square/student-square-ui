import type { Frequency, ImpactEntry, ProjectCard, StatItem, TransformCard, UtilizationItem } from "./types";

export const amountOptions = [100, 500, 1000, 5000] as const;
export type DonationPresetAmount = (typeof amountOptions)[number];

export const impacts: Record<Frequency, Record<DonationPresetAmount, ImpactEntry>> = {
  monthly: {
    100: { icon: "📖", text: "৳100/month keeps a student stocked with stationery all year." },
    500: { icon: "🌱", text: "৳500/month provides school supplies for a full semester." },
    1000: { icon: "🤝", text: "৳1,000/month sponsors 3 months of student mentoring sessions." },
    5000: { icon: "🎓", text: "৳5,000/month fully funds a scholarship for an underprivileged student." },
  },
  onetime: {
    100: { icon: "📚", text: "৳100 can provide books and stationery to a student in need." },
    500: { icon: "🌿", text: "৳500 plants 5 trees, contributing to a greener Bangladesh." },
    1000: { icon: "🍱", text: "৳1,000 supports an entire family with an Eid food package." },
    5000: { icon: "🏥", text: "৳5,000 funds a free medical camp for a rural community." },
  },
};

export const oneTimeInlineImpacts: Record<DonationPresetAmount, string> = {
  100: "৳100 can provide books and stationery to a student in need.",
  500: "৳500 plants 5 trees, contributing to a greener Bangladesh.",
  1000: "৳1,000 supports an entire family with an Eid food package.",
  5000: "৳5,000 funds a free medical camp for a rural community.",
};

/**
 * Shown only until the live project list loads (and in server-rendered HTML,
 * which is all crawlers and link previews see). It mirrors the five seeded
 * projects — same order, same summaries as seed-data/projects.ts — so the
 * fallback never shows a different list from the real one.
 */
export const projectCards: ProjectCard[] = [
  {
    slug: "beyond-the-journey",
    icon: "🎯",
    title: "Beyond The Journey Project",
    description:
      "A special initiative that presents accurate career information, ongoing research and prospective fields of work for the various departments of the country's public universities, in the light of the experience of faculty members, specialists and professionals.",
  },
  {
    slug: "health-care-for-all",
    icon: "🏥",
    title: "Project Health Care for All",
    description:
      "Health camps are held at fixed intervals every year to bring healthcare within reach of people in marginal areas, with particular emphasis on the char lands and the Barind region.",
  },
  {
    slug: "amar-bhai-er-eid",
    icon: "🕌",
    title: "Amar Bhai Er Eid Project",
    description:
      "Every Eid-ul-Fitr, Eid food supplies including beef are gifted to families in need so they can share in the joy of the festival. The project also takes part in relief and rehabilitation during emergencies such as floods and COVID-19.",
  },
  {
    slug: "one-minute-investment",
    icon: "📚",
    title: "One Minute Investment Project",
    description:
      "Ensuring sustainable human development through students' education, mental wellbeing, career development and social empowerment.",
  },
  {
    slug: "counter-climate-change",
    icon: "🌿",
    title: "Counter Climate Change Project",
    description:
      "An initiative to plant one hundred thousand palmyra palm trees to cool extreme weather and halt the falling water table. 500 saplings have already been planted.",
  },
];

export const utilizationItems: UtilizationItem[] = [
  {
    icon: "📚",
    label: "Education Awareness",
    content:
      "Your donations help us spread awareness about the importance of education, reaching out to communities and encouraging a culture of learning and growth across rural and underserved areas.",
  },
  {
    icon: "🎓",
    label: "Grants for Underprivileged Students",
    content:
      "We provide grants to students from underprivileged backgrounds, ensuring they have access to quality education and opportunities to thrive — regardless of their financial circumstances.",
  },
  {
    icon: "🤝",
    label: "Mentoring and Counselling",
    content:
      "Our programs offer personalized mentoring and counseling to students, guiding them through their educational journey and helping them overcome academic, social, and personal challenges.",
  },
  {
    icon: "🌿",
    label: "Tree Plantation for Decarbonization",
    content:
      "We are committed to environmental sustainability. Your donations support tree plantation initiatives aimed at reducing carbon footprints, combating climate change, and promoting a healthier planet for future generations.",
  },
  {
    icon: "⚡",
    label: "Skill Enhancement Workshops & Seminars",
    content:
      "We organize seminars and workshops to help students enhance their skills, preparing them for future opportunities and empowering them to achieve their dreams in a competitive world.",
  },
  {
    icon: "👩‍👧",
    label: "Support for Santal Community Well-being",
    content:
      "We focus on the welfare of the minor Santal community, emphasizing women's education, raising awareness against addiction, and providing family advocacy and integration services.",
  },
  {
    icon: "📰",
    label: "Free Educational & Career Magazines",
    content:
      "We publish and distribute educational and career magazines for free, ensuring everyone has access to valuable information and resources that can shape their futures.",
  },
  {
    icon: "🍱",
    label: "Festival Food Distribution",
    content:
      "We provide food during festivals to ensure that everyone can celebrate joyfully and contribute cheerfully to the community — no family left behind during times of celebration.",
  },
  {
    icon: "🏠",
    label: "Relocation Assistance for Divorced Women",
    content:
      "Funds are allocated to assist divorced women in relocating and integrating into society with dignity, offering support for job placements and skills development to ensure financial independence.",
  },
  {
    icon: "🛡️",
    label: "Safe Homes for Dropout Students",
    content:
      "We provide safe homes and educational support for students forced to drop out due to poverty, ensuring they have a nurturing environment to continue their education and pursue their dreams without fear.",
  },
];

export const transformCards: TransformCard[] = [
  {
    icon: "🎯",
    title: "Targeted Impact",
    description:
      "Every donation is directed to specific programs with measurable, transparent outcomes reported to our donors.",
  },
  {
    icon: "🔁",
    title: "Chain Effect Model",
    description:
      "We design programs that create self-sustaining cycles — one beneficiary empowers the next, multiplying your impact.",
  },
  {
    icon: "🌍",
    title: "Community-Led Change",
    description:
      "We work with local communities across 5 districts, ensuring programs are culturally rooted and community-owned.",
  },
  {
    icon: "📊",
    title: "Full Accountability",
    description:
      "Shariah-compliant donation management with transparent fund allocation, regular reporting, and open governance.",
  },
];

/** Fallback only — the live figures come from the seeded impact stats. */
export const heroStats: StatItem[] = [
  { number: "850+", label: "Families Supported" },
  { number: "5,000+", label: "Students Reached" },
  { number: "625+", label: "Saplings Planted" },
  { number: "250+", label: "Rural Patients" },
];

export const closestAmountKey = (amount: number): DonationPresetAmount =>
  amountOptions.reduce((prev, current) => (Math.abs(current - amount) < Math.abs(prev - amount) ? current : prev));
