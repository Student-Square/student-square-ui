type Point = { bold: string; boldBn: string; text: string; textBn: string };

export type Partner = {
  slug: string;
  title: string;
  titleBn: string;
  /** The partnership type on its own, for "Key Points of {type} Partnership". */
  type: string;
  typeBn: string;
  image: string;
  description: string;
  descriptionBn: string;
  keyPoints: Point[];
  campaigns: Point[];
};

// These entries carry no figures. The partner pages render the foundation's
// real, organisation-wide totals via <ImpactStats /> instead; the numbers that
// used to live here described the humanitarian situation in Mali.
export const partners: Partner[] = [
  {
    slug: "campaign-partner",
    title: "Become A Campaign Partner",
    titleBn: "প্রচারাভিযান অংশীদার হন",
    type: "Campaign",
    typeBn: "প্রচারাভিযান",
    image: "/images/pexels-sabbir-bhuiyan-1747552532-32221017.jpg",
    description:
      "The divorce rate has increased significantly, and many divorced women find themselves without the skills or education needed to reintegrate into society with dignity. They face challenges in securing jobs or finding well-paid self-employment opportunities due to their lack of abilities.\n\nWe are dedicated to addressing this issue by building safe homes for divorced women. These homes will provide shelter and offer comprehensive training programs to help these women acquire the skills needed for employment or entrepreneurship. Fundraise for this to help us create a safe and supportive environment where divorced women can rebuild their lives with confidence and dignity.",
    descriptionBn:
      "বিবাহবিচ্ছেদের হার উল্লেখযোগ্যভাবে বেড়েছে, এবং অনেক বিবাহবিচ্ছিন্ন নারীর মর্যাদার সঙ্গে সমাজে ফিরে আসার মতো দক্ষতা বা শিক্ষা নেই। প্রয়োজনীয় সামর্থ্যের অভাবে চাকরি পাওয়া কিংবা ভালো আয়ের স্বনির্ভর কাজ খুঁজে পাওয়া তাদের জন্য কঠিন হয়ে পড়ে।\n\nবিবাহবিচ্ছিন্ন নারীদের জন্য নিরাপদ আবাস গড়ে তুলে আমরা এই সমস্যার সমাধানে কাজ করছি। এই আবাসগুলো আশ্রয় দেবে এবং চাকরি বা উদ্যোক্তা হওয়ার দক্ষতা অর্জনে সমন্বিত প্রশিক্ষণ দেবে। এর জন্য তহবিল সংগ্রহ করে আমাদের এমন একটি নিরাপদ ও সহায়ক পরিবেশ গড়তে সাহায্য করুন, যেখানে বিবাহবিচ্ছিন্ন নারীরা আত্মবিশ্বাস ও মর্যাদার সঙ্গে নতুন করে জীবন গড়তে পারেন।",
    keyPoints: [
      { bold: "Shelter and Security:", boldBn: "আশ্রয় ও নিরাপত্তা:", text: " Providing a safe and supportive environment for divorced women to live.", textBn: " বিবাহবিচ্ছিন্ন নারীদের বসবাসের জন্য নিরাপদ ও সহায়ক পরিবেশ নিশ্চিত করা।" },
      { bold: "Skill Development:", boldBn: "দক্ষতা উন্নয়ন:", text: " Offering training programs to equip women with the skills necessary for employment or self-employment.", textBn: " চাকরি বা স্বনির্ভর কাজের জন্য প্রয়োজনীয় দক্ষতা অর্জনে নারীদের প্রশিক্ষণ দেওয়া।" },
      { bold: "Empowerment and Dignity:", boldBn: "ক্ষমতায়ন ও মর্যাদা:", text: " Helping women regain their confidence and reintegrate into society with dignity.", textBn: " নারীদের আত্মবিশ্বাস ফিরে পেতে এবং মর্যাদার সঙ্গে সমাজে ফিরে আসতে সহায়তা করা।" },
    ],
    campaigns: [
      { bold: "Shelter and Security:", boldBn: "আশ্রয় ও নিরাপত্তা:", text: " Providing a safe and supportive environment for divorced women to live.", textBn: " বিবাহবিচ্ছিন্ন নারীদের বসবাসের জন্য নিরাপদ ও সহায়ক পরিবেশ নিশ্চিত করা।" },
      { bold: "Skill Development:", boldBn: "দক্ষতা উন্নয়ন:", text: " Offering training programs to equip women with the skills necessary for employment or self-employment.", textBn: " চাকরি বা স্বনির্ভর কাজের জন্য প্রয়োজনীয় দক্ষতা অর্জনে নারীদের প্রশিক্ষণ দেওয়া।" },
      { bold: "Empowerment and Dignity:", boldBn: "ক্ষমতায়ন ও মর্যাদা:", text: " Helping women regain their confidence and reintegrate into society with dignity.", textBn: " নারীদের আত্মবিশ্বাস ফিরে পেতে এবং মর্যাদার সঙ্গে সমাজে ফিরে আসতে সহায়তা করা।" },
    ],
  },
  {
    slug: "project-partner",
    title: "Become A Project Partner",
    titleBn: "প্রকল্প অংশীদার হন",
    type: "Project",
    typeBn: "প্রকল্প",
    image: "/images/student-square-school-session.jpg",
    description:
      "We collaborate with project partners to design, fund, and deliver impactful programmes that reach underserved students across our regions. As a project partner, you bring resources, expertise, or networks that help us scale our work and deepen our impact.\n\nProject partnerships are built on shared values and mutual accountability. Whether you are a foundation, a corporate body, or a community organisation, we will work with you to co-create projects that deliver measurable, lasting change.",
    descriptionBn:
      "আমাদের কর্মএলাকার সুবিধাবঞ্চিত শিক্ষার্থীদের কাছে পৌঁছানোর মতো কার্যকর কার্যক্রম পরিকল্পনা, অর্থায়ন ও বাস্তবায়নে আমরা প্রকল্প অংশীদারদের সঙ্গে কাজ করি। প্রকল্প অংশীদার হিসেবে আপনি এমন সম্পদ, দক্ষতা বা নেটওয়ার্ক যুক্ত করেন, যা আমাদের কাজের পরিসর বাড়াতে ও প্রভাব গভীর করতে সাহায্য করে।\n\nপ্রকল্প অংশীদারত্ব গড়ে ওঠে অভিন্ন মূল্যবোধ ও পারস্পরিক জবাবদিহির ভিত্তিতে। আপনি কোনো ফাউন্ডেশন, করপোরেট প্রতিষ্ঠান বা কমিউনিটি সংগঠন—যা-ই হোন না কেন, পরিমাপযোগ্য ও দীর্ঘস্থায়ী পরিবর্তন আনে এমন প্রকল্প আমরা আপনার সঙ্গে মিলে গড়ে তুলব।",
    keyPoints: [
      { bold: "Co-design:", boldBn: "যৌথ পরিকল্পনা:", text: " Collaborate with our team to design programmes that reflect both your goals and community needs.", textBn: " আপনার লক্ষ্য ও কমিউনিটির চাহিদা—দুটোই প্রতিফলিত করে এমন কার্যক্রম সাজাতে আমাদের টিমের সঙ্গে কাজ করুন।" },
      { bold: "Shared accountability:", boldBn: "যৌথ জবাবদিহি:", text: " Joint reporting frameworks and regular check-ins to track progress together.", textBn: " একসঙ্গে অগ্রগতি পর্যবেক্ষণে যৌথ প্রতিবেদন কাঠামো ও নিয়মিত পর্যালোচনা।" },
      { bold: "Visibility:", boldBn: "পরিচিতি:", text: " Recognition across our communications, events, and publications.", textBn: " আমাদের প্রচার, ইভেন্ট ও প্রকাশনায় আপনার অবদানের স্বীকৃতি।" },
    ],
    campaigns: [
      { bold: "Education Access:", boldBn: "শিক্ষায় প্রবেশাধিকার:", text: " Expanding access to quality education in underserved communities.", textBn: " সুবিধাবঞ্চিত কমিউনিটিতে মানসম্মত শিক্ষার সুযোগ বাড়ানো।" },
      { bold: "Skills Training:", boldBn: "দক্ষতা প্রশিক্ষণ:", text: " Delivering vocational and life-skills programmes for young people.", textBn: " তরুণদের জন্য বৃত্তিমূলক ও জীবন-দক্ষতা কার্যক্রম পরিচালনা।" },
      { bold: "Community Resilience:", boldBn: "কমিউনিটির সহনশীলতা:", text: " Building long-term capacity within local communities.", textBn: " স্থানীয় কমিউনিটির দীর্ঘমেয়াদি সক্ষমতা গড়ে তোলা।" },
    ],
  },
  {
    slug: "institution-partner",
    title: "Become An Institution Partner",
    titleBn: "প্রাতিষ্ঠানিক অংশীদার হন",
    type: "Institution",
    typeBn: "প্রাতিষ্ঠানিক",
    image: "/images/student-square-introduction-presention-by-Humayra-Nasrin.jpg",
    description:
      "Institutional partnerships allow universities, schools, government bodies, and NGOs to align with Student Square's mission at a structural level. Together we create systemic change by embedding our approaches into institutional frameworks and curricula.\n\nWe work with institutions that share our commitment to equity, inclusion, and student wellbeing. An institutional partnership can take many forms — from research collaboration to curriculum integration, from staff training to policy advocacy.",
    descriptionBn:
      "প্রাতিষ্ঠানিক অংশীদারত্বের মাধ্যমে বিশ্ববিদ্যালয়, স্কুল, সরকারি সংস্থা ও এনজিও কাঠামোগত পর্যায়ে স্টুডেন্ট স্কয়ারের লক্ষ্যের সঙ্গে যুক্ত হতে পারে। প্রাতিষ্ঠানিক কাঠামো ও পাঠ্যক্রমে আমাদের পদ্ধতি যুক্ত করে আমরা একসঙ্গে ব্যবস্থাগত পরিবর্তন আনি।\n\nসমতা, অন্তর্ভুক্তি ও শিক্ষার্থীদের কল্যাণে আমাদের মতোই অঙ্গীকারবদ্ধ প্রতিষ্ঠানের সঙ্গে আমরা কাজ করি। প্রাতিষ্ঠানিক অংশীদারত্ব নানা রূপ নিতে পারে—গবেষণা সহযোগিতা থেকে পাঠ্যক্রমে অন্তর্ভুক্তি, কর্মী প্রশিক্ষণ থেকে নীতি-অ্যাডভোকেসি পর্যন্ত।",
    keyPoints: [
      { bold: "Research Collaboration:", boldBn: "গবেষণা সহযোগিতা:", text: " Joint studies and publications on youth development and counselling outcomes.", textBn: " যুব উন্নয়ন ও কাউন্সেলিংয়ের ফলাফল নিয়ে যৌথ গবেষণা ও প্রকাশনা।" },
      { bold: "Curriculum Integration:", boldBn: "পাঠ্যক্রমে অন্তর্ভুক্তি:", text: " Embedding our frameworks into institutional learning programmes.", textBn: " প্রতিষ্ঠানের শিক্ষা কার্যক্রমে আমাদের কাঠামো যুক্ত করা।" },
      { bold: "Policy Influence:", boldBn: "নীতিতে প্রভাব:", text: " Working together to advocate for student-centred policies.", textBn: " শিক্ষার্থীকেন্দ্রিক নীতির পক্ষে একসঙ্গে কাজ করা।" },
    ],
    campaigns: [
      { bold: "Academic Partnerships:", boldBn: "একাডেমিক অংশীদারত্ব:", text: " Co-developing modules and resources with higher education institutions.", textBn: " উচ্চশিক্ষা প্রতিষ্ঠানের সঙ্গে যৌথভাবে মডিউল ও শিক্ষা উপকরণ তৈরি।" },
      { bold: "School Programmes:", boldBn: "স্কুল কার্যক্রম:", text: " Integrating wellbeing curricula into school timetables.", textBn: " স্কুলের রুটিনে কল্যাণমূলক পাঠ্যক্রম যুক্ত করা।" },
      { bold: "Government Initiatives:", boldBn: "সরকারি উদ্যোগ:", text: " Supporting policy development at local and national levels.", textBn: " স্থানীয় ও জাতীয় পর্যায়ে নীতি প্রণয়নে সহায়তা।" },
    ],
  },
  {
    slug: "career-partner",
    title: "Become A Career Partner",
    titleBn: "ক্যারিয়ার অংশীদার হন",
    type: "Career",
    typeBn: "ক্যারিয়ার",
    image: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
    description:
      "Career partners help us connect students with real-world opportunities — internships, mentorships, job placements, and professional development experiences that open doors and build futures.\n\nBy becoming a career partner, your organisation gains access to motivated, talented young people from diverse backgrounds while directly contributing to the economic empowerment of the communities we serve.",
    descriptionBn:
      "ক্যারিয়ার অংশীদাররা শিক্ষার্থীদের বাস্তব সুযোগের সঙ্গে যুক্ত করতে আমাদের সাহায্য করেন—ইন্টার্নশিপ, মেন্টরশিপ, চাকরি এবং পেশাগত উন্নয়নের অভিজ্ঞতা, যা নতুন দরজা খুলে দেয় ও ভবিষ্যৎ গড়ে।\n\nক্যারিয়ার অংশীদার হলে আপনার প্রতিষ্ঠান বৈচিত্র্যময় প্রেক্ষাপটের উদ্যমী ও মেধাবী তরুণদের কাছে পৌঁছাতে পারবে, আর একই সঙ্গে আমরা যে কমিউনিটির জন্য কাজ করি তাদের অর্থনৈতিক ক্ষমতায়নে সরাসরি অবদান রাখবে।",
    keyPoints: [
      { bold: "Internship Placements:", boldBn: "ইন্টার্নশিপের সুযোগ:", text: " Hosting students in paid or supported internship roles within your organisation.", textBn: " আপনার প্রতিষ্ঠানে শিক্ষার্থীদের বেতনভুক্ত বা সহায়তাপ্রাপ্ত ইন্টার্নশিপের সুযোগ দেওয়া।" },
      { bold: "Mentorship:", boldBn: "মেন্টরশিপ:", text: " Connecting your professionals with students for one-to-one career guidance.", textBn: " একান্ত ক্যারিয়ার পরামর্শের জন্য আপনার পেশাজীবীদের শিক্ষার্থীদের সঙ্গে যুক্ত করা।" },
      { bold: "Job Pathways:", boldBn: "চাকরির পথ:", text: " Creating clear recruitment pathways for Student Square graduates.", textBn: " স্টুডেন্ট স্কয়ারের গ্র্যাজুয়েটদের জন্য নিয়োগের সুস্পষ্ট পথ তৈরি করা।" },
    ],
    campaigns: [
      { bold: "Graduate Recruitment:", boldBn: "গ্র্যাজুয়েট নিয়োগ:", text: " Early-access pipelines to our students and graduates.", textBn: " আমাদের শিক্ষার্থী ও গ্র্যাজুয়েটদের কাছে আগেভাগে পৌঁছানোর সুযোগ।" },
      { bold: "Skills Workshops:", boldBn: "দক্ষতা কর্মশালা:", text: " Delivering industry-relevant workshops at our centres.", textBn: " আমাদের কেন্দ্রগুলোতে শিল্পখাতের উপযোগী কর্মশালা পরিচালনা।" },
      { bold: "Diversity Goals:", boldBn: "বৈচিত্র্যের লক্ষ্য:", text: " Supporting your organisation's diversity and inclusion commitments.", textBn: " আপনার প্রতিষ্ঠানের বৈচিত্র্য ও অন্তর্ভুক্তির অঙ্গীকার পূরণে সহায়তা।" },
    ],
  },
];

export function getPartnerBySlug(slug: string): Partner | undefined {
  return partners.find((p) => p.slug === slug);
}
