export interface Project {
  id: number
  title: string
  description: string
  category: string
  image: string
}

export const projectsData: Project[] = [
  {
    id: 1,
    title: "Counselling Excellence Programs",
    description: "Comprehensive mental health initiatives supporting student wellbeing through workshops and one-on-one sessions",
    category: "Wellness",
    image: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
  },
  {
    id: 2,
    title: "Community Advocacy & Support",
    description: "Empowering students to voice concerns and drive positive change in their institutions and communities",
    category: "Advocacy",
    image: "/images/brain-battle-prize-ceremony.jpg",
  },
  {
    id: 3,
    title: "Environmental & Relief Initiatives",
    description: "Student-led community service projects focused on environmental protection and emergency relief efforts",
    category: "Education",
    image: "/images/emergency-tran-bitoron-activities-2.jpg",
  },
]
