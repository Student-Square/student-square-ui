export type Service = {
  slug: string;
  title: string;
  titleBn: string;
  shortTitle: string;
  shortTitleBn: string;
  image: string;
  heroImage: string;
  description: string;
  descriptionBn: string;
  body: string[];
  bodyBn: string[];
};

const BIO =
  "Our vision is to foster an inclusive society where every individual's potential is nurtured and developed, free from any form of discrimination. Our mission is to empower individuals through education and skill development, creating a society free from discrimination and equipped to tackle global challenges collectively such as poverty, climate change, inequality, and health crises.";

const BIO_BN =
  "আমাদের লক্ষ্য এমন একটি অন্তর্ভুক্তিমূলক সমাজ গড়ে তোলা, যেখানে সব ধরনের বৈষম্য থেকে মুক্ত থেকে প্রত্যেক মানুষের সম্ভাবনা লালিত ও বিকশিত হয়। আমাদের উদ্দেশ্য শিক্ষা ও দক্ষতা উন্নয়নের মাধ্যমে মানুষকে ক্ষমতায়িত করা এবং এমন একটি বৈষম্যহীন সমাজ গড়ে তোলা, যা দারিদ্র্য, জলবায়ু পরিবর্তন, অসমতা ও স্বাস্থ্য সংকটের মতো বৈশ্বিক চ্যালেঞ্জ সম্মিলিতভাবে মোকাবিলা করতে সক্ষম।";

// No per-programme figures here. The ones that used to be were invented, and
// some contradicted the foundation's own reporting — the climate entry claimed
// "10,000+ trees planted" against a real total of 625 saplings. These pages now
// show the seeded organisation-wide totals instead.
//
// Bangla titles match the header menu's names for these pages.
export const services: Service[] = [
  {
    slug: "student-counselling",
    title: "Student Counselling",
    titleBn: "শিক্ষার্থী পরামর্শসেবা",
    shortTitle: "Student Counselling",
    shortTitleBn: "শিক্ষার্থী পরামর্শসেবা",
    image: "/images/student-square-school-session.jpg",
    heroImage: "/images/student-square-school-session.jpg",
    description:
      "We provide one-to-one counselling to students to empower them with decision-making skills in academic and career paths, helping them build confidence and clarity about their futures.",
    descriptionBn:
      "শিক্ষাজীবন ও ক্যারিয়ারের পথে সিদ্ধান্ত নেওয়ার দক্ষতা গড়ে তুলতে আমরা শিক্ষার্থীদের একান্ত কাউন্সেলিং দিই, যা তাদের ভবিষ্যৎ নিয়ে আত্মবিশ্বাস ও স্পষ্ট ধারণা তৈরি করে।",
    body: [
      "Student Square's counselling programme is built around the belief that every student deserves personalised guidance. Our trained counsellors work with students across Bangladesh and the UK to identify strengths, address anxieties, and map out realistic, inspiring futures.",
      BIO,
    ],
    bodyBn: [
      "স্টুডেন্ট স্কয়ারের কাউন্সেলিং কার্যক্রম এই বিশ্বাসের ওপর দাঁড়িয়ে যে প্রত্যেক শিক্ষার্থী ব্যক্তিগত দিকনির্দেশনা পাওয়ার যোগ্য। আমাদের প্রশিক্ষিত কাউন্সেলররা বাংলাদেশ ও যুক্তরাজ্যের শিক্ষার্থীদের সঙ্গে কাজ করেন—তাদের শক্তির জায়গা খুঁজে বের করেন, দুশ্চিন্তা কাটাতে সাহায্য করেন এবং বাস্তবসম্মত ও অনুপ্রেরণাদায়ী ভবিষ্যতের পরিকল্পনা সাজান।",
      BIO_BN,
    ],
  },
  {
    slug: "parent-advocacy",
    title: "Parent Advocacy",
    titleBn: "অভিভাবক সহায়তা",
    shortTitle: "Parent Advocacy",
    shortTitleBn: "অভিভাবক সহায়তা",
    image: "/images/student-square-introduction-presention-by-Humayra-Nasrin.jpg",
    heroImage: "/images/student-square-introduction-presention-by-Humayra-Nasrin.jpg",
    description:
      "We bridge the understanding gap between students and parents through counselling on both ends, creating a supportive home environment for academic growth.",
    descriptionBn:
      "দুই পক্ষকেই কাউন্সেলিং দিয়ে আমরা শিক্ষার্থী ও অভিভাবকের মধ্যে বোঝাপড়ার দূরত্ব কমাই, যাতে পড়াশোনার জন্য ঘরে সহায়ক পরিবেশ তৈরি হয়।",
    body: [
      "Parents play a crucial role in a student's journey. Student Square runs dedicated parent advocacy sessions that help families understand the pressures their children face, the opportunities available, and how to communicate more effectively across generational and cultural divides.",
      BIO,
    ],
    bodyBn: [
      "শিক্ষার্থীর পথচলায় অভিভাবকদের ভূমিকা অত্যন্ত গুরুত্বপূর্ণ। স্টুডেন্ট স্কয়ার অভিভাবকদের জন্য বিশেষ সেশন আয়োজন করে, যা পরিবারগুলোকে বুঝতে সাহায্য করে সন্তানেরা কী ধরনের চাপের মুখোমুখি হয়, সামনে কী কী সুযোগ রয়েছে, আর প্রজন্ম ও সংস্কৃতির ব্যবধান পেরিয়ে কীভাবে আরও কার্যকরভাবে কথা বলা যায়।",
      BIO_BN,
    ],
  },
  {
    slug: "community-wellbeing",
    title: "Minor Community Wellbeing",
    titleBn: "শিশু-কিশোর কল্যাণ",
    shortTitle: "Community Wellbeing",
    shortTitleBn: "শিশু-কিশোর কল্যাণ",
    image: "/images/relation-will-be-cooperative-for-social-building.jpg",
    heroImage: "/images/relation-will-be-cooperative-for-social-building.jpg",
    description:
      "We promote social cohesion and wellbeing among youth communities, creating safe, inclusive spaces where young people can thrive together.",
    descriptionBn:
      "আমরা তরুণ জনগোষ্ঠীর মধ্যে সামাজিক সম্প্রীতি ও কল্যাণ এগিয়ে নিই এবং এমন নিরাপদ ও অন্তর্ভুক্তিমূলক পরিসর গড়ে তুলি, যেখানে তরুণেরা একসঙ্গে বেড়ে উঠতে পারে।",
    body: [
      "Beyond individual counselling, Student Square works at the community level to build networks of support for young people. Our community wellbeing initiatives tackle isolation, discrimination, and lack of opportunity head-on through peer mentoring, group activities, and community events.",
      BIO,
    ],
    bodyBn: [
      "ব্যক্তিগত কাউন্সেলিংয়ের বাইরেও স্টুডেন্ট স্কয়ার কমিউনিটি পর্যায়ে তরুণদের জন্য সহায়তার নেটওয়ার্ক গড়ে তোলে। সহপাঠী মেন্টরিং, দলগত কার্যক্রম ও কমিউনিটি ইভেন্টের মাধ্যমে আমাদের কল্যাণমূলক উদ্যোগগুলো একাকীত্ব, বৈষম্য ও সুযোগের অভাব সরাসরি মোকাবিলা করে।",
      BIO_BN,
    ],
  },
  {
    slug: "climate-action",
    title: "Climate Action and Environmental Stewardship",
    titleBn: "জলবায়ু কার্যক্রম ও পরিবেশ সুরক্ষা",
    shortTitle: "Climate Action",
    shortTitleBn: "জলবায়ু কার্যক্রম",
    image: "/images/tree-plantation-by-student-square.jpg",
    heroImage: "/images/tree-plantation-by-student-square.jpg",
    description:
      "We engage young people in environmental action, equipping the next generation with the knowledge and motivation to address climate challenges in their communities.",
    descriptionBn:
      "আমরা তরুণদের পরিবেশ রক্ষার কাজে যুক্ত করি, যাতে পরের প্রজন্ম নিজেদের কমিউনিটির জলবায়ু চ্যালেঞ্জ মোকাবিলার জ্ঞান ও অনুপ্রেরণা পায়।",
    body: [
      "Student Square believes that environmental responsibility is inseparable from social progress. Our climate action programmes teach students about sustainability, run tree-planting drives, and connect youth activists across our regions to share ideas and drive change.",
      BIO,
    ],
    bodyBn: [
      "স্টুডেন্ট স্কয়ার বিশ্বাস করে, পরিবেশের প্রতি দায়িত্ব সামাজিক অগ্রগতি থেকে আলাদা নয়। আমাদের জলবায়ু কার্যক্রম শিক্ষার্থীদের টেকসই উন্নয়ন সম্পর্কে শেখায়, বৃক্ষরোপণ কর্মসূচি পরিচালনা করে এবং বিভিন্ন অঞ্চলের তরুণ কর্মীদের যুক্ত করে, যাতে তারা ভাবনা বিনিময় করে পরিবর্তন আনতে পারে।",
      BIO_BN,
    ],
  },
  {
    slug: "research-publications",
    title: "Research & Publications",
    titleBn: "গবেষণা ও প্রকাশনা",
    shortTitle: "Research & Publications",
    shortTitleBn: "গবেষণা ও প্রকাশনা",
    image: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
    heroImage: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
    description:
      "We produce evidence-based research on youth development, counselling outcomes, and educational access to inform policy and best practice across our regions.",
    descriptionBn:
      "নীতিনির্ধারণ ও সর্বোত্তম চর্চায় ভূমিকা রাখতে আমরা যুব উন্নয়ন, কাউন্সেলিংয়ের ফলাফল ও শিক্ষায় প্রবেশাধিকার নিয়ে প্রমাণভিত্তিক গবেষণা করি।",
    body: [
      "Our research and publications arm ensures that Student Square's work is grounded in data and contributes to the wider field of youth development. We publish annual impact reports, collaborate with universities, and share our findings freely with practitioners and policymakers.",
      BIO,
    ],
    bodyBn: [
      "আমাদের গবেষণা ও প্রকাশনা শাখা নিশ্চিত করে যে স্টুডেন্ট স্কয়ারের কাজ তথ্যনির্ভর এবং তা যুব উন্নয়নের বৃহত্তর ক্ষেত্রে অবদান রাখে। আমরা বার্ষিক প্রভাব প্রতিবেদন প্রকাশ করি, বিশ্ববিদ্যালয়ের সঙ্গে যৌথভাবে কাজ করি এবং গবেষণার ফলাফল অনুশীলনকারী ও নীতিনির্ধারকদের সঙ্গে বিনামূল্যে ভাগ করে নিই।",
      BIO_BN,
    ],
  },
  {
    slug: "scholarships-grants",
    title: "Scholarships & Grants",
    titleBn: "বৃত্তি ও অনুদান",
    shortTitle: "Scholarships & Grants",
    shortTitleBn: "বৃত্তি ও অনুদান",
    image: "/images/brain-battle-prize-ceremony.jpg",
    heroImage: "/images/brain-battle-prize-ceremony.jpg",
    description:
      "We administer scholarships and grants to help talented students from underserved backgrounds access higher education and fulfil their potential.",
    descriptionBn:
      "সুবিধাবঞ্চিত পরিবারের মেধাবী শিক্ষার্থীরা যেন উচ্চশিক্ষায় পৌঁছে নিজেদের সম্ভাবনা পূর্ণ করতে পারে, সে জন্য আমরা বৃত্তি ও অনুদান পরিচালনা করি।",
    body: [
      "Financial barriers should never stand between a student and their future. Student Square's scholarships and grants programme identifies high-potential students who lack resources and connects them with funding opportunities — from local grants to international scholarship pathways.",
      BIO,
    ],
    bodyBn: [
      "আর্থিক বাধা যেন কখনো কোনো শিক্ষার্থী ও তার ভবিষ্যতের মাঝে দেয়াল হয়ে না দাঁড়ায়। স্টুডেন্ট স্কয়ারের বৃত্তি ও অনুদান কার্যক্রম সম্ভাবনাময় কিন্তু সামর্থ্যহীন শিক্ষার্থীদের খুঁজে বের করে এবং তাদের অর্থায়নের সুযোগের সঙ্গে যুক্ত করে—স্থানীয় অনুদান থেকে আন্তর্জাতিক বৃত্তি পর্যন্ত।",
      BIO_BN,
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
