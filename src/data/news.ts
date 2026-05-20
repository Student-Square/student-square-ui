export interface NewsItem {
  id: number
  title: string
  date: string
  image: string
  category?: string
}

export const newsData: NewsItem[] = [
  {
    id: 1,
    title: "Student Square Launches Counselling Excellence Program",
    date: "December 15, 2024",
    image: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
    category: "INITIATIVE",
  },
  {
    id: 2,
    title: "Emergency Relief & Community Service Initiative",
    date: "November 28, 2024",
    image: "/images/emergency-tran-bitoron-activities-4.jpg",
  },
  {
    id: 3,
    title: "Environmental Action: Tree Plantation & Community Growth",
    date: "November 10, 2024",
    image: "/images/student-square-one-minute-investment-project-2.jpg",
  },
]
