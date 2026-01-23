import { Heart, Users, BookOpen, Zap } from "lucide-react"

export const featuresData = [
  {
    id: 1,
    title: "Mental Health Support",
    paragraph:
      "Access professional counselling and peer support programs designed to help you navigate academic stress, personal challenges, and mental wellbeing with confidential guidance.",
    icon: <Heart className="w-5 h-5" />,
  },
  {
    id: 2,
    title: "Student Advocacy",
    paragraph:
      "Your voice matters. We amplify student concerns, fight for your rights, and work with institutions to create positive change in education policies and campus life.",
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: 3,
    title: "Educational Programs",
    paragraph:
      "From skill-building workshops to mentorship initiatives, we offer comprehensive learning experiences that prepare you for academic success and career growth.",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    id: 4,
    title: "Community Engagement",
    paragraph:
      "Join a vibrant community of like-minded students. Participate in events, networking opportunities, and collaborative projects that make real-world impact.",
    icon: <Zap className="w-5 h-5" />,
  },
]

export default featuresData
