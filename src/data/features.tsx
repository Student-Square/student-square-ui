import { Leaf, Gift, Stethoscope, GraduationCap } from "lucide-react"
import { ReactNode } from "react"

export type Feature = {
  id: number
  slug: string
  title: string
  paragraph: string
  icon: ReactNode
  image: string
  body: string[]
  stats: { value: string; label: string }[]
}

export const featuresData: Feature[] = [
  {
    id: 1,
    slug: "counter-climate-change",
    title: "Counter Climate Change Project",
    paragraph:
      "To reduce extreme heat and prevent falling water tables in a changing environment, we have launched an initiative to plant one lakh palm trees. 500 palm saplings have already been planted.",
    icon: <Leaf className="w-5 h-5" />,
    image: "/images/tree-plantation-by-student-square.jpg",
    body: [
      "Climate change is reshaping life in Bangladesh in ways that are impossible to ignore. Temperatures are rising, groundwater levels are falling, and increasingly erratic rainfall is disrupting the agricultural rhythms that communities depend on. Student Square's Counter Climate Change Project responds to this reality with a practical, community-rooted intervention: planting one lakh palm trees across the country's most vulnerable districts.",
      "Palm trees are not chosen arbitrarily. Their deep root systems anchor soil and help prevent the erosion that strips farmland and clogs waterways after heavy rains. Over time they contribute to groundwater recharge, slowing the decline of water tables in the Barendra region and other areas facing serious water stress. And because palm fruit, leaves, and stems have direct economic value, each tree planted is also an asset for the family or community that cares for it.",
      "Every planting event is led by student volunteers who have been trained in environmental science and who serve as local ambassadors for conservation in their communities. We aim to make each volunteer feel personally responsible for a sapling's survival — not just for the immediate event but for the months and years that follow. This sense of stewardship is the seed of a longer-term environmental culture.",
      "We have already planted 500 saplings and are building the partnerships, volunteer networks, and logistical capacity to scale significantly. Schools, colleges, local government bodies, and individual donors are all part of this growing coalition for a cooler, greener Bangladesh.",
    ],
    stats: [
      { value: "500+", label: "palm saplings planted" },
      { value: "1 lakh", label: "target trees to plant" },
      { value: "6", label: "districts involved" },
    ],
  },
  {
    id: 2,
    slug: "amar-vaiyer-eid",
    title: "আমার ভাইয়ের ঈদ Project",
    paragraph:
      "Every Eid-ul-Fitr, we share the joy of Eid with underprivileged families by gifting beef and other Eid essentials. We also participate in relief and rehabilitation during emergencies such as floods and COVID-19.",
    icon: <Gift className="w-5 h-5" />,
    image: "/images/amar-vai-eid-project.jpg",
    body: [
      "Eid-ul-Fitr is one of the most joyful occasions in the Bangladeshi calendar — a time of celebration, family, and generous sharing. But for many families living in poverty, the festival brings anxiety rather than joy: the pressure to provide good food, new clothes, and gifts for children without the resources to do so. The আমার ভাইয়ের ঈদ Project was created to change that, ensuring that every family in our network can celebrate Eid with dignity.",
      "Each year, in the weeks before Eid-ul-Fitr, Student Square volunteers collect donations of money and goods and use them to purchase beef and essential Eid provisions for underprivileged families. Distribution is organised through community committees who know their neighbours — identifying the families most in need and ensuring that nothing is wasted and no one is forgotten. The act of sharing food is deeply meaningful in Bangladeshi culture, and the project is designed to honour that meaning.",
      "The project has expanded beyond Eid to include emergency relief during floods, cyclones, and other crises. During the COVID-19 pandemic, when many daily-wage workers lost their income overnight, our network mobilised to distribute food and hygiene essentials to hundreds of families across multiple districts. The relationships built through the Eid project gave us an existing infrastructure of trust and local knowledge to draw on.",
      "At its heart, আমার ভাইয়ের ঈদ is about the simple belief that no one should feel forgotten during a time of celebration. Every donation, however small, contributes to that shared humanity.",
    ],
    stats: [
      { value: "800+", label: "families supported annually" },
      { value: "5+", label: "years running" },
      { value: "1,200+", label: "emergency families assisted" },
    ],
  },
  {
    id: 3,
    slug: "healthcare-for-all",
    title: "Healthcare for All",
    paragraph:
      "To bring healthcare within reach of marginalised communities, we organise health camps at regular intervals every year — with special focus on char regions and the Barendra area.",
    icon: <Stethoscope className="w-5 h-5" />,
    image: "/images/medical-camp.jpg",
    body: [
      "Access to healthcare in Bangladesh is deeply unequal. While urban residents can reach a clinic or hospital relatively easily, families living in char areas — the river islands that form and dissolve with the floods — and in remote rural districts can be hours from the nearest medical facility. For these communities, even a basic health check or a supply of essential medicines can mean the difference between a manageable condition and a serious, preventable illness.",
      "Student Square's Healthcare for All programme organises regular health camps in partnership with doctors, nurses, and community health workers. Each camp provides free consultations, basic diagnostics, and a supply of essential medicines. Special attention is given to maternal and child health, non-communicable diseases, and the eye and skin conditions that are particularly prevalent in agricultural communities.",
      "Beyond the camps, we work to build local health literacy. Community health education sessions — run by our trained volunteers alongside the medical teams — cover topics such as hygiene, nutrition, the importance of antenatal care, and how to recognise the warning signs of common illnesses in children. Knowledge is as important as medicine: a community that understands health can advocate for itself and make better decisions long after the camp has left.",
      "We are also piloting a health referral system that connects patients who need specialist care with hospitals and NGO clinics that can provide it, breaking down the information barriers that prevent many rural families from accessing treatment they are theoretically entitled to.",
    ],
    stats: [
      { value: "15+", label: "health camps held" },
      { value: "3,000+", label: "patients served" },
      { value: "4", label: "focus regions" },
    ],
  },
  {
    id: 4,
    slug: "beyond-the-journey",
    title: "Beyond The Journey Project",
    paragraph:
      "A special initiative that presents accurate career information, ongoing research, and potential career paths for various departments of public universities — drawn from the experiences of faculty members, experts, and professionals.",
    icon: <GraduationCap className="w-5 h-5" />,
    image: "/images/student-square-introduction-presention-by-Humayra-Nasrin.jpg",
    body: [
      "One of the most common anxieties among students in Bangladesh is uncertainty about the future. Which university department should I choose? What jobs does this subject actually lead to? Will my parents approve? Is this a realistic path for someone from my background? These questions are asked by millions of students every year, but clear, accurate, and personalised answers are hard to find. Beyond The Journey was created to change that.",
      "The project brings together career guides — carefully researched documents that map the real-world pathways available from each major university department. Rather than generic overviews, these guides draw directly from conversations with faculty members, working professionals, and graduates who have taken different paths from the same starting point. They present honest accounts: the opportunities, the challenges, the typical career progression, and the skills that make a real difference.",
      "Beyond the written guides, the project hosts interactive sessions — both online and in person — where students can ask questions directly to professionals from a wide range of fields. An engineer, a diplomat, a teacher, an entrepreneur — all sharing their journeys in plain language that students can learn from and relate to. These conversations break down the mystique around careers that students from non-professional family backgrounds often face.",
      "We believe that career guidance is inseparable from counselling and personal development. Knowing what options exist is only valuable if a student has the confidence and self-awareness to pursue them. Beyond The Journey integrates career information with the broader counselling support that Student Square provides, so that students leave not just better-informed but genuinely empowered to take the next step.",
    ],
    stats: [
      { value: "20+", label: "career guides published" },
      { value: "50+", label: "expert contributors" },
      { value: "10,000+", label: "students reached" },
    ],
  },
]

export default featuresData
