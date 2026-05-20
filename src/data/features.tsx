import { Leaf, Gift, Stethoscope, GraduationCap } from "lucide-react"

export const featuresData = [
  {
    id: 1,
    title: "Counter Climate Change Project",
    paragraph:
      "To reduce extreme heat and prevent falling water tables in a changing environment, we have launched an initiative to plant one lakh palm trees. 500 palm saplings have already been planted.",
    icon: <Leaf className="w-5 h-5" />,
  },
  {
    id: 2,
    title: "আমার ভাইয়ের ঈদ Project",
    paragraph:
      "Every Eid-ul-Fitr, we share the joy of Eid with underprivileged families by gifting beef and other Eid essentials. We also participate in relief and rehabilitation during emergencies such as floods and COVID-19.",
    icon: <Gift className="w-5 h-5" />,
  },
  {
    id: 3,
    title: "Healthcare for All",
    paragraph:
      "To bring healthcare within reach of marginalised communities, we organise health camps at regular intervals every year — with special focus on char regions and the Barendra area.",
    icon: <Stethoscope className="w-5 h-5" />,
  },
  {
    id: 4,
    title: "Beyond The Journey Project",
    paragraph:
      "A special initiative that presents accurate career information, ongoing research, and potential career paths for various departments of public universities — drawn from the experiences of faculty members, experts, and professionals.",
    icon: <GraduationCap className="w-5 h-5" />,
  },
]

export default featuresData
