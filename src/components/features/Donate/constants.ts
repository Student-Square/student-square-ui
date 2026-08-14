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

export const projectCards: ProjectCard[] = [
  {
    icon: "🌿",
    title: "Counter Climate Project",
    description:
      "625+ Palmyra saplings planted in partnership with the Ministry of Environment, Forest and Climate Change. Combating climate change one tree at a time with 40+ community volunteers.",
    tags: ["625+ Saplings", "40+ Volunteers"],
  },
  {
    icon: "🕌",
    title: "Amar Bhai Er Eid Project",
    description:
      "Providing complete food packages — beef (1–1.5 kg), oil (450 gm), polao rice (1.5 kg) — to underprivileged families every Eid. Spreading joy and dignity to those who need it most.",
    tags: ["850+ Families", "Annual"],
  },
  {
    icon: "📚",
    title: "One Minute Investment Project",
    description:
      "Career guidance, mental health awareness, and skill development sessions in 20+ schools and colleges across 5 districts — empowering the next generation of Bangladeshi leaders.",
    tags: ["2,500+ Students", "5 Districts"],
  },
  {
    icon: "🏥",
    title: "Health For All",
    description:
      "Free medical camps in rural areas offering consultations in Medicine, Surgery, Diabetes Testing, and Gynecology — delivered by 40+ volunteer doctors to those without access to healthcare.",
    tags: ["250+ Patients", "3 Camps"],
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
