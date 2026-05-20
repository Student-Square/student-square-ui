export type Partner = {
  slug: string;
  title: string;
  image: string;
  description: string;
  keyPoints: { bold: string; text: string }[];
  campaigns: { bold: string; text: string }[];
  stats: { value: string; label: string }[];
};

const STATS = [
  { value: "7.1m",    label: "people in need of humanitarian assistance" },
  { value: "1.3m",    label: "people do not have enough to eat" },
  { value: "350,000", label: "people displaced inside of Mali" },
];

export const partners: Partner[] = [
  {
    slug: "campaign-partner",
    title: "Become A Campaign Partner",
    image: "/images/pexels-sabbir-bhuiyan-1747552532-32221017.jpg",
    description:
      "The divorce rate has increased significantly, and many divorced women find themselves without the skills or education needed to reintegrate into society with dignity. They face challenges in securing jobs or finding well-paid self-employment opportunities due to their lack of abilities.\n\nWe are dedicated to addressing this issue by building safe homes for divorced women. These homes will provide shelter and offer comprehensive training programs to help these women acquire the skills needed for employment or entrepreneurship. Fundraise for this to help us create a safe and supportive environment where divorced women can rebuild their lives with confidence and dignity.",
    keyPoints: [
      { bold: "Shelter and Security:", text: " Providing a safe and supportive environment for divorced women to live." },
      { bold: "Skill Development:", text: " Offering training programs to equip women with the skills necessary for employment or self-employment." },
      { bold: "Empowerment and Dignity:", text: " Helping women regain their confidence and reintegrate into society with dignity." },
    ],
    campaigns: [
      { bold: "Shelter and Security:", text: " Providing a safe and supportive environment for divorced women to live." },
      { bold: "Skill Development:", text: " Offering training programs to equip women with the skills necessary for employment or self-employment." },
      { bold: "Empowerment and Dignity:", text: " Helping women regain their confidence and reintegrate into society with dignity." },
    ],
    stats: STATS,
  },
  {
    slug: "project-partner",
    title: "Become A Project Partner",
    image: "/images/student-square-school-session.jpg",
    description:
      "We collaborate with project partners to design, fund, and deliver impactful programmes that reach underserved students across our regions. As a project partner, you bring resources, expertise, or networks that help us scale our work and deepen our impact.\n\nProject partnerships are built on shared values and mutual accountability. Whether you are a foundation, a corporate body, or a community organisation, we will work with you to co-create projects that deliver measurable, lasting change.",
    keyPoints: [
      { bold: "Co-design:", text: " Collaborate with our team to design programmes that reflect both your goals and community needs." },
      { bold: "Shared accountability:", text: " Joint reporting frameworks and regular check-ins to track progress together." },
      { bold: "Visibility:", text: " Recognition across our communications, events, and publications." },
    ],
    campaigns: [
      { bold: "Education Access:", text: " Expanding access to quality education in underserved communities." },
      { bold: "Skills Training:", text: " Delivering vocational and life-skills programmes for young people." },
      { bold: "Community Resilience:", text: " Building long-term capacity within local communities." },
    ],
    stats: STATS,
  },
  {
    slug: "institution-partner",
    title: "Become An Institution Partner",
    image: "/images/student-square-introduction-presention-by-Humayra-Nasrin.jpg",
    description:
      "Institutional partnerships allow universities, schools, government bodies, and NGOs to align with Student Square's mission at a structural level. Together we create systemic change by embedding our approaches into institutional frameworks and curricula.\n\nWe work with institutions that share our commitment to equity, inclusion, and student wellbeing. An institutional partnership can take many forms — from research collaboration to curriculum integration, from staff training to policy advocacy.",
    keyPoints: [
      { bold: "Research Collaboration:", text: " Joint studies and publications on youth development and counselling outcomes." },
      { bold: "Curriculum Integration:", text: " Embedding our frameworks into institutional learning programmes." },
      { bold: "Policy Influence:", text: " Working together to advocate for student-centred policies." },
    ],
    campaigns: [
      { bold: "Academic Partnerships:", text: " Co-developing modules and resources with higher education institutions." },
      { bold: "School Programmes:", text: " Integrating wellbeing curricula into school timetables." },
      { bold: "Government Initiatives:", text: " Supporting policy development at local and national levels." },
    ],
    stats: STATS,
  },
  {
    slug: "career-partner",
    title: "Become A Career Partner",
    image: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
    description:
      "Career partners help us connect students with real-world opportunities — internships, mentorships, job placements, and professional development experiences that open doors and build futures.\n\nBy becoming a career partner, your organisation gains access to motivated, talented young people from diverse backgrounds while directly contributing to the economic empowerment of the communities we serve.",
    keyPoints: [
      { bold: "Internship Placements:", text: " Hosting students in paid or supported internship roles within your organisation." },
      { bold: "Mentorship:", text: " Connecting your professionals with students for one-to-one career guidance." },
      { bold: "Job Pathways:", text: " Creating clear recruitment pathways for Student Square graduates." },
    ],
    campaigns: [
      { bold: "Graduate Recruitment:", text: " Early-access pipelines to our students and graduates." },
      { bold: "Skills Workshops:", text: " Delivering industry-relevant workshops at our centres." },
      { bold: "Diversity Goals:", text: " Supporting your organisation's diversity and inclusion commitments." },
    ],
    stats: STATS,
  },
];

export function getPartnerBySlug(slug: string): Partner | undefined {
  return partners.find((p) => p.slug === slug);
}
