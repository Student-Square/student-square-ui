import { pageMetadata } from "@/lib/seo";
import WhatWeDoContent from "./_components/WhatWeDoContent";

export const metadata = pageMetadata({
  title: "What We Do: Student Counselling, Advocacy & Scholarships",
  description:
    "Student counselling, parent advocacy, youth wellbeing, climate action, research and scholarships: the six programmes Student Square runs in Bangladesh.",
  path: "/what-we-do",
});

export default function WhatWeDoPage() {
  return <WhatWeDoContent />;
}
