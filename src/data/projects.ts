export interface Project {
  id: number
  slug: string
  title: string
  summary: string
  videoSrc: string
  vimeoVideoId?: number
  poster: string
}

export const projectsData: Project[] = [
  {
    id: 1,
    slug: "counter-climate-change",
    title: "Counter Climate Change Project",
    summary:
      "To reduce extreme heat and prevent falling water tables, we have launched an initiative to plant one lakh palm trees. 500 palm saplings have already been planted.",
      videoSrc:
      "https://delivery-p136806-e1377844.adobeaemcloud.com/adobe/assets/urn:aaid:aem:05ed4ce9-3854-474a-a49e-1110981f340e/original/as/Agri%20Loop%20v01%201032x503.webm",
    
    poster: "/images/rimon.jpg",
  },
  {
    id: 2,
    slug: "amar-bhaier-eid",
    title: "আমার ভাইয়ের ঈদ প্রজেক্ট",
    summary:
      "Every Eid-ul-Fitr, we share the joy of Eid with underprivileged families by gifting beef and Eid essentials. We also join relief and rehabilitation during emergencies like floods and COVID-19.",
    videoSrc: "",
    vimeoVideoId: 1173216844,
    poster: "/images/emergency-tran-bitoron-activities-2.jpg",
  },
  {
    id: 3,
    slug: "healthcare-for-all",
    title: "Healthcare for All",
    summary:
      "We organise health camps at regular intervals to bring healthcare within reach of marginalised communities — with special focus on char regions and the Barendra area.",
    videoSrc: "",
    vimeoVideoId: 1173218131,
    poster: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
  },
  {
    id: 4,
    slug: "beyond-the-journey",
    title: "Beyond The Journey Project",
    summary:
      "A special initiative presenting accurate career information, ongoing research, and potential career paths for university departments — through the lens of faculty members, experts, and professionals.",
    videoSrc: "",
    vimeoVideoId: 1173218490,
    poster: "/images/brain-battle-prize-ceremony.jpg",
  },
]

export const getProjectBySlug = (slug: string) =>
  projectsData.find((project) => project.slug === slug)
