export interface NewsItem {
  id: number
  title: string
  date: string
  image: string
  category?: string
  body: string[]
}

export const newsData: NewsItem[] = [
  {
    id: 1,
    title: "Student Square Launches Counselling Excellence Program",
    date: "December 15, 2024",
    image: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
    category: "INITIATIVE",
    body: [
      "Student Square has officially launched its expanded Counselling Excellence Program, bringing structured one-to-one and group counselling services to schools and colleges across six new districts. The programme marks a significant step in the organisation's mission to make mental health and academic guidance accessible to every student, regardless of their location or economic background.",
      "The new programme builds on the success of Student Square's existing counselling workshops and introduces a certified training pathway for community volunteers who will serve as peer counsellors in areas where professional support is limited. Over 40 volunteers have completed the inaugural training cohort, equipped with skills in active listening, referral protocols, and basic wellbeing support.",
      "Feedback from the first cohort of schools to receive the programme has been overwhelmingly positive. Head teachers report that students are more willing to discuss academic and personal challenges with trusted adults, and that classroom behaviour has improved in schools where the programme has been running for more than one term.",
    ],
  },
  {
    id: 2,
    title: "Emergency Relief & Community Service Initiative",
    date: "November 28, 2024",
    image: "/images/emergency-tran-bitoron-activities-4.jpg",
    body: [
      "In response to severe flooding across several northern districts, Student Square mobilised its emergency response network to deliver essential relief supplies to over 1,200 affected families. The operation, coordinated within 48 hours of the floods reaching peak levels, distributed food packages, oral rehydration salts, hygiene kits, and temporary learning materials for children.",
      "The rapid response was made possible by Student Square's pre-positioned community volunteer network, trained earlier in the year through our resilience preparedness workshops. Local volunteers worked alongside the Student Square team to identify the most vulnerable households — including families with young children, elderly members, and people with disabilities — ensuring that relief reached those who needed it most.",
      "Beyond immediate material relief, Student Square's teams facilitated community meetings to help affected residents access government support services and understand their rights. Educational continuity kits were provided to over 300 children to support informal learning during displacement, reducing the risk of permanent school dropout following the emergency.",
    ],
  },
  {
    id: 3,
    title: "Environmental Action: Tree Plantation & Community Growth",
    date: "November 10, 2024",
    image: "/images/student-square-one-minute-investment-project-2.jpg",
    body: [
      "Student Square's Counter Climate Change Project reached a milestone this month, with the planting of the 500th palm sapling since the initiative launched. The event, held in partnership with local schools and community groups, brought together over 120 student volunteers who dedicated their weekend to preparing planting sites and learning about the role of native tree species in combating soil erosion and replenishing groundwater levels.",
      "The palm tree was specifically chosen for this initiative because of its deep root system, its long lifespan, and its practical value to families — palm fruit and leaves provide both nutrition and income for households in rural areas. Each sapling is matched with a student volunteer who takes responsibility for monitoring its growth over the following year, creating a sense of ownership and accountability that goes beyond a single planting day.",
      "The tree plantation effort is one component of a broader environmental education strategy that Student Square is developing in partnership with schools in the Barendra region. Plans are in place to reach the target of planting one lakh palm trees over the next five years, with each subsequent planting event designed to build awareness of climate science alongside the practical conservation work.",
    ],
  },
]
