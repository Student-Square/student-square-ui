export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  image: string;
  heroImage: string;
  description: string;
  body: string[];
  stats: { value: string; label: string }[];
};

const BIO =
  "Our vision is to foster an inclusive society where every individual's potential is nurtured and developed, free from any form of discrimination. Our mission is to empower individuals through education and skill development, creating a society free from discrimination and equipped to tackle global challenges collectively such as poverty, climate change, inequality, and health crises.";

export const services: Service[] = [
  {
    slug: "student-counselling",
    title: "Student Counselling",
    shortTitle: "Student Counselling",
    image: "/images/student-square-school-session.jpg",
    heroImage: "/images/student-square-school-session.jpg",
    description:
      "We provide one-to-one counselling to students to empower them with decision-making skills in academic and career paths, helping them build confidence and clarity about their futures.",
    body: [
      "Student Square's counselling programme is built around the belief that every student deserves personalised guidance. Our trained counsellors work with students across Bangladesh and the UK to identify strengths, address anxieties, and map out realistic, inspiring futures.",
      BIO,
    ],
    stats: [
      { value: "350,000", label: "students reached through our programmes" },
      { value: "7+", label: "years of counselling experience" },
      { value: "98%", label: "student satisfaction rate" },
    ],
  },
  {
    slug: "parent-advocacy",
    title: "Parent Advocacy",
    shortTitle: "Parent Advocacy",
    image: "/images/student-square-introduction-presention-by-Humayra-Nasrin.jpg",
    heroImage: "/images/student-square-introduction-presention-by-Humayra-Nasrin.jpg",
    description:
      "We bridge the understanding gap between students and parents through counselling on both ends, creating a supportive home environment for academic growth.",
    body: [
      "Parents play a crucial role in a student's journey. Student Square runs dedicated parent advocacy sessions that help families understand the pressures their children face, the opportunities available, and how to communicate more effectively across generational and cultural divides.",
      BIO,
    ],
    stats: [
      { value: "12,000+", label: "parents engaged in workshops" },
      { value: "85%", label: "reported improved family communication" },
      { value: "40+", label: "parent sessions held annually" },
    ],
  },
  {
    slug: "community-wellbeing",
    title: "Minor Community Wellbeing",
    shortTitle: "Community Wellbeing",
    image: "/images/relation-will-be-cooperative-for-social-building.jpg",
    heroImage: "/images/relation-will-be-cooperative-for-social-building.jpg",
    description:
      "We promote social cohesion and wellbeing among youth communities, creating safe, inclusive spaces where young people can thrive together.",
    body: [
      "Beyond individual counselling, Student Square works at the community level to build networks of support for young people. Our community wellbeing initiatives tackle isolation, discrimination, and lack of opportunity head-on through peer mentoring, group activities, and community events.",
      BIO,
    ],
    stats: [
      { value: "200+", label: "community events organised" },
      { value: "50+", label: "active peer mentor networks" },
      { value: "1.3m", label: "people reached in our communities" },
    ],
  },
  {
    slug: "climate-action",
    title: "Climate Action and Environmental Stewardship",
    shortTitle: "Climate Action",
    image: "/images/tree-plantation-by-student-square.jpg",
    heroImage: "/images/tree-plantation-by-student-square.jpg",
    description:
      "We engage young people in environmental action, equipping the next generation with the knowledge and motivation to address climate challenges in their communities.",
    body: [
      "Student Square believes that environmental responsibility is inseparable from social progress. Our climate action programmes teach students about sustainability, run tree-planting drives, and connect youth activists across our regions to share ideas and drive change.",
      BIO,
    ],
    stats: [
      { value: "10,000+", label: "trees planted by student volunteers" },
      { value: "60+", label: "schools engaged in climate curriculum" },
      { value: "25+", label: "environmental campaigns led" },
    ],
  },
  {
    slug: "research-publications",
    title: "Research & Publications",
    shortTitle: "Research & Publications",
    image: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
    heroImage: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
    description:
      "We produce evidence-based research on youth development, counselling outcomes, and educational access to inform policy and best practice across our regions.",
    body: [
      "Our research and publications arm ensures that Student Square's work is grounded in data and contributes to the wider field of youth development. We publish annual impact reports, collaborate with universities, and share our findings freely with practitioners and policymakers.",
      BIO,
    ],
    stats: [
      { value: "15+", label: "published research papers" },
      { value: "8", label: "university partnerships" },
      { value: "5", label: "annual impact reports published" },
    ],
  },
  {
    slug: "scholarships-grants",
    title: "Scholarships & Grants",
    shortTitle: "Scholarships & Grants",
    image: "/images/brain-battle-prize-ceremony.jpg",
    heroImage: "/images/brain-battle-prize-ceremony.jpg",
    description:
      "We administer scholarships and grants to help talented students from underserved backgrounds access higher education and fulfil their potential.",
    body: [
      "Financial barriers should never stand between a student and their future. Student Square's scholarships and grants programme identifies high-potential students who lack resources and connects them with funding opportunities — from local grants to international scholarship pathways.",
      BIO,
    ],
    stats: [
      { value: "500+", label: "scholarships awarded to date" },
      { value: "£250k+", label: "in grants distributed annually" },
      { value: "92%", label: "scholarship recipients complete higher education" },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
