export interface StudentStory {
  id: number
  name: string
  role: string
  university: string
  image: string
  story: string
  achievement: string
  quote: string
}

export const storiesData: StudentStory[] = [
  {
    id: 1,
    name: "Fatima Rahman",
    role: "Computer Science Student",
    university: "University of Dhaka",
    image: "/images/emergency-tran-bitoron-activities-3.jpg",
    story: "Student Square helped me develop leadership skills through their community programs. I learned how to organize events and work with diverse teams.",
    achievement: "Led 3 successful community projects",
    quote: "Student Square transformed me from a shy student into a confident leader."
  },
  {
    id: 2,
    name: "Ahmed Hassan",
    role: "Engineering Student",
    university: "BUET",
    image: "/images/emergency-tran-bitoron-activities.jpg",
    story: "Through Student Square's emergency training programs, I gained practical skills that helped me assist during natural disasters in my community.",
    achievement: "Certified Emergency Response Volunteer",
    quote: "The training I received here saved lives during the recent flood."
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    role: "Environmental Science Student",
    university: "Jahangirnagar University",
    image: "/images/relation-will-be-cooperative-for-social-building.jpg",
    story: "Student Square's environmental initiatives inspired me to start my own tree plantation project. I've planted over 500 trees in my district.",
    achievement: "Environmental Conservation Award Winner",
    quote: "Student Square showed me that one person can make a real difference."
  },
  {
    id: 4,
    name: "Karim Uddin",
    role: "Psychology Student",
    university: "University of Chittagong",
    image: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
    story: "The counseling workshops at Student Square helped me understand mental health better. Now I volunteer to help other students with their struggles.",
    achievement: "Mental Health Advocate",
    quote: "Student Square taught me the importance of supporting others' mental wellbeing."
  },
  {
    id: 5,
    name: "Rashida Begum",
    role: "Education Student",
    university: "Rajshahi University",
    image: "/images/brain-battle-prize-ceremony.jpg",
    story: "Student Square's educational programs helped me develop teaching skills. I now volunteer at local schools and help underprivileged children learn.",
    achievement: "Community Education Volunteer",
    quote: "Student Square helped me discover my passion for teaching and community service."
  },
  {
    id: 6,
    name: "Mohammad Ali",
    role: "Business Administration Student",
    university: "North South University",
    image: "/images/student-square-one-minute-investment-project-2.jpg",
    story: "Through Student Square's entrepreneurship programs, I learned business skills and started my own small business. I now employ 5 local people.",
    achievement: "Young Entrepreneur Award",
    quote: "Student Square gave me the confidence and skills to become an entrepreneur."
  },
]
