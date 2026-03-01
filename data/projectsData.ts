export interface Project {
  id: number
  slug: string
  title: string
  summary: string
  videoSrc: string
  poster: string
}

export const projectsData: Project[] = [
  {
    id: 1,
    slug: "counselling-excellence",
    title: "Counselling Excellence",
    summary:
      "Structured counselling programs that strengthen student wellbeing, confidence, and academic continuity.",
    videoSrc:
      "https://delivery-p136806-e1377844.adobeaemcloud.com/adobe/assets/urn:aaid:aem:39f118fc-7720-4561-8625-3b0d4ff9b697/original/as/Jobs%20Loop%20v01%201032x503.webm",
    poster: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
  },
  {
    id: 2,
    slug: "community-advocacy",
    title: "Community Advocacy",
    summary:
      "Student-led advocacy initiatives that solve local challenges and amplify youth voices in institutions.",
    videoSrc:
      "https://delivery-p136806-e1377844.adobeaemcloud.com/adobe/assets/urn:aaid:aem:05ed4ce9-3854-474a-a49e-1110981f340e/original/as/Agri%20Loop%20v01%201032x503.webm",
    poster: "/images/brain-battle-prize-ceremony.jpg",
  },
  {
    id: 3,
    slug: "relief-and-resilience",
    title: "Relief & Resilience",
    summary:
      "Rapid response and preparedness projects supporting vulnerable families during emergencies.",
    videoSrc:
      "https://delivery-p136806-e1377844.adobeaemcloud.com/adobe/assets/urn:aaid:aem:c11393c1-2f5b-47c7-9156-d52632f3fb48/original/as/1_Energy%20Loop%2001%201032x503.webm",
    poster: "/images/emergency-tran-bitoron-activities-2.jpg",
  },
  {
    id: 4,
    slug: "real-life-stories",
    title: "Real Life Stories",
    summary:
      "Documented journeys from students and families showing real outcomes from Student Square programs.",
    videoSrc:
      "https://delivery-p136806-e1377844.adobeaemcloud.com/adobe/assets/urn:aaid:aem:e93b30cf-b3d2-45df-800e-dabc7d098152/original/as/Health%20Loop%20v01%201032x503_1.webm",
    poster: "/images/relation-will-be-cooperative-for-social-building.jpg",
  },
]

export const getProjectBySlug = (slug: string) =>
  projectsData.find((project) => project.slug === slug)
