export interface Story {
  id: number
  name: string
  title: string
  content: string
  image: string
  category?: string
  benefit?: string
  university?: string
}

export const storiesData: Story[] = [
  {
    id: 1,
    name: "Aisha Rahman",
    title: "Overcame Academic Anxiety Through Counselling",
    content: "I was struggling with severe exam anxiety and couldn't focus on my studies. Student Square's one-on-one counselling sessions helped me understand my triggers and develop coping strategies. Today, I'm not only performing better academically but also feel more confident in my abilities.",
    image: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
    category: "Counselling & Mental Health",
    benefit: "Guidance & Support",
    university: "Rajshahi University",
  },
  {
    id: 2,
    name: "Md. Karim Hassan",
    title: "Stood Up for Rights Through Advocacy",
    content: "When I faced unfair treatment from my institution, I didn't know how to respond. Student Square's advocacy team guided me through the entire process, helped document my concerns, and supported my case. They stood by me until justice was served. I learned that my voice matters.",
    image: "/images/brain-battle-prize-ceremony.jpg",
    category: "Advocacy & Rights",
    benefit: "Empowerment & Justice",
    university: "Dhaka College",
  },
  {
    id: 3,
    name: "Fatima Akhter",
    title: "Found Direction Through Career Counselling",
    content: "I had no idea what career path to choose. Through Student Square's career counselling workshops, I explored my interests, learned about different opportunities, and received guidance on skill development. Now I'm working towards a future that excites me.",
    image: "/images/emergency-tran-bitoron-activities-5.jpg",
    category: "Career Guidance",
    benefit: "Direction & Development",
    university: "Khulna University",
  },
  {
    id: 4,
    name: "Ahmed Reza",
    title: "Learned Leadership Through Community Work",
    content: "Participating in Student Square's community service programs transformed me from a shy student to a confident leader. The guidance I received helped me develop skills I never knew I had. Now I'm leading my own initiatives to help others.",
    image: "/images/emergency-tran-bitoron-activities-2.jpg",
    category: "Community Engagement",
    benefit: "Leadership & Confidence",
    university: "BUET",
  },
  {
    id: 5,
    name: "Nasrin Begum",
    title: "Recovered from Stress with Wellbeing Support",
    content: "During my difficult semester, stress took a toll on my health. Student Square's wellbeing programs, including meditation workshops and stress management counselling, gave me tools to manage my mental health. I'm now thriving academically and personally.",
    image: "/images/relation-will-be-cooperative-for-social-building2.jpg",
    category: "Wellbeing Programs",
    benefit: "Mental Health & Balance",
    university: "Chittagong University",
  },
  {
    id: 6,
    name: "Rajib Kumar",
    title: "Built Support Network Through Peer Mentoring",
    content: "As a first-year student, I felt lost and isolated. Student Square's peer mentoring program connected me with seniors who became my guides and friends. They helped me navigate academics, social challenges, and personal growth. I now mentor junior students too.",
    image: "/images/student-square-one-minute-investment-project-2.jpg",
    category: "Peer Mentorship",
    benefit: "Connection & Belonging",
    university: "Bangladesh National University",
  },
]
