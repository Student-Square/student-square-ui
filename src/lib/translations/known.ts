/**
 * Bangla for content the API serves without a `*Bn` column, keyed by its exact
 * English. `pick()` and `tr()` in LanguageProvider fall back to this table, so
 * a seeded string shows in Bangla without the page knowing where it came from.
 *
 * Keys must match the stored text character for character (dashes and
 * apostrophes included). If an admin rewords one, that text shows in English
 * until the new wording is added here. Content that does have a `*Bn` column
 * (blog posts, stories, projects, events…) belongs in that column, not here.
 */
export const KNOWN: Record<string, string> = {
  // ── Home: hero cards (FeatureCard) ─────────────────────────────────────
  "Career & Education": "শিক্ষা ও ক্যারিয়ার",
  Health: "স্বাস্থ্য",
  "Emergency Relief": "জরুরি সহায়তা",
  "Community Relief": "কমিউনিটি সহায়তা",
  Environment: "পরিবেশ",
  Blog: "ব্লগ",
  Magazine: "ম্যাগাজিন",
  Stories: "গল্প",
  "Inspiring education, confidence, and future opportunities":
    "শিক্ষা, আত্মবিশ্বাস ও ভবিষ্যৎ সম্ভাবনায় অনুপ্রেরণা",
  "Engaging with students through awareness sessions and guidance to inspire education, confidence, and future opportunities.":
    "সচেতনতা সেশন ও পরামর্শের মাধ্যমে শিক্ষার্থীদের শিক্ষা, আত্মবিশ্বাস ও ভবিষ্যৎ সম্ভাবনায় অনুপ্রাণিত করা।",
  "Free medical consultation for underserved communities":
    "সুবিধাবঞ্চিত মানুষের জন্য বিনামূল্যে চিকিৎসা পরামর্শ",
  "Providing free medical consultation and basic healthcare services to underserved communities, ensuring better health and well-being for all.":
    "সুবিধাবঞ্চিত মানুষের জন্য বিনামূল্যে চিকিৎসা পরামর্শ ও প্রাথমিক স্বাস্থ্যসেবা দিয়ে সবার জন্য ভালো স্বাস্থ্য ও কল্যাণ নিশ্চিত করা।",
  "Student Square volunteers became Feni's lifeline":
    "ফেনীর মানুষের পাশে প্রাণরেখা হয়ে দাঁড়ায় স্টুডেন্ট স্কয়ারের স্বেচ্ছাসেবীরা",
  "Student Square volunteers became Feni's lifeline in Sindurpur-Rajapur village.":
    "সিন্দুরপুর-রাজাপুর গ্রামে ফেনীর মানুষের প্রাণরেখা হয়ে দাঁড়িয়েছিলেন স্টুডেন্ট স্কয়ারের স্বেচ্ছাসেবীরা।",
  "What I eat on Eid, my brother should eat too": "ঈদে আমি যা খাব, আমার ভাইও তা খাবে",
  "Student Square made it happen for 215 families — beef, rice, oil, and love. Eid Mubarak.":
    "২১৫টি পরিবারের জন্য গরুর মাংস, চাল, তেল আর ভালোবাসা পৌঁছে দিয়েছে স্টুডেন্ট স্কয়ার। ঈদ মোবারক।",
  "A greener future, planted together": "সবুজ ভবিষ্যৎ, একসঙ্গে রোপিত",
  "Promoting environmental sustainability through tree plantation and encouraging community participation for a greener future.":
    "বৃক্ষরোপণ ও কমিউনিটি অংশগ্রহণের মাধ্যমে সবুজ ভবিষ্যতের জন্য পরিবেশগত স্থায়িত্বকে এগিয়ে নেওয়া।",
  "Education and Career Blog": "শিক্ষা ও ক্যারিয়ার ব্লগ",
  "Real Life Stories": "বাস্তব জীবনের গল্প",

  // ── Home: impact stats (also on What We Do, locations, partners, donate) ─
  "Families Supported": "পরিবার সহায়তা পেয়েছে",
  "through Eid Gift Project": "ঈদ উপহার প্রকল্পের মাধ্যমে",
  "Students Reached": "শিক্ষার্থীর কাছে পৌঁছেছি",
  "across 5 Districts": "৫টি জেলায়",
  "Saplings Planted": "চারা রোপণ করা হয়েছে",
  "for a Greener Bangladesh": "সবুজ বাংলাদেশের জন্য",
  "Rural Patients": "গ্রামীণ রোগী সেবা পেয়েছে",
  "reached through free health camps": "বিনামূল্যের স্বাস্থ্য ক্যাম্পের মাধ্যমে",
  "STUDENT SQUARE TRUST Documentary 2022": "স্টুডেন্ট স্কয়ার ট্রাস্ট ডকুমেন্টারি ২০২২",

  // ── About: editable pages (PageSection) ────────────────────────────────
  // Headings follow the nav, which calls this page "লক্ষ্য ও উদ্দেশ্য".
  "Our Vision & Mission": "আমাদের লক্ষ্য ও উদ্দেশ্য",
  Vision: "লক্ষ্য",
  Mission: "উদ্দেশ্য",
  "Legal Status": "আইনগত মর্যাদা",
  "Our vision is to foster an inclusive society where every individual's potential is nurtured and developed, free from any form of discrimination.":
    "আমাদের লক্ষ্য এমন একটি অন্তর্ভুক্তিমূলক সমাজ গড়ে তোলা, যেখানে সব ধরনের বৈষম্য থেকে মুক্ত থেকে প্রত্যেক মানুষের সম্ভাবনা লালিত ও বিকশিত হয়।",
  "Our mission is to empower individuals through education and skill development, creating a society free from discrimination and equipped to tackle global challenges collectively such as poverty, climate change, inequality, and health crises.":
    "আমাদের উদ্দেশ্য শিক্ষা ও দক্ষতা উন্নয়নের মাধ্যমে মানুষকে ক্ষমতায়িত করা এবং এমন একটি বৈষম্যহীন সমাজ গড়ে তোলা, যা দারিদ্র্য, জলবায়ু পরিবর্তন, অসমতা ও স্বাস্থ্য সংকটের মতো বৈশ্বিক চ্যালেঞ্জ সম্মিলিতভাবে মোকাবিলা করতে সক্ষম।",
  "Registered under the Societies Registration Act, 1860, Bangladesh.":
    "সোসাইটিজ রেজিস্ট্রেশন অ্যাক্ট, ১৮৬০ (বাংলাদেশ) অনুযায়ী নিবন্ধিত।",
  "Who We Are": "আমরা কে",
  "Our People": "আমাদের মানুষেরা",
  "We're a bunch of student ninjas ready to unleash our superpowers and help our fellow mates reach their goals by boosting their brain muscles and making better decisions. We feel and breathe the same as we have faced the same difficulty. We wholeheartedly assess the students' goals and the challenges they are looking to overcome. We are from the future, working effortlessly reminiscing our past experience.":
    "আমরা একদল উদ্যমী শিক্ষার্থী, যারা নিজেদের সবটুকু সামর্থ্য দিয়ে সহপাঠীদের লক্ষ্যে পৌঁছাতে সাহায্য করতে প্রস্তুত—তাদের চিন্তার শক্তি বাড়িয়ে এবং আরও ভালো সিদ্ধান্ত নিতে পাশে থেকে। আমরাও একই কঠিন পথ পেরিয়ে এসেছি, তাই তাদের অনুভূতি আমরা নিজেদের মতো করেই বুঝি। শিক্ষার্থীদের লক্ষ্য আর যে বাধাগুলো তারা পেরোতে চায়, আমরা আন্তরিকভাবে সেগুলো বুঝে নিই। নিজেদের অতীত অভিজ্ঞতা মনে রেখে আমরা ভবিষ্যতের দিকে তাকিয়ে নিরলস কাজ করে যাচ্ছি।",
  // Bundled fallback for the same section.
  "We’re a bunch of student ninjas ready to unleash our superpowers and help our fellow mates reach their goals by boosting their brain muscles and making better decisions.":
    "আমরা একদল উদ্যমী শিক্ষার্থী, যারা নিজেদের সবটুকু সামর্থ্য দিয়ে সহপাঠীদের লক্ষ্যে পৌঁছাতে সাহায্য করতে প্রস্তুত—তাদের চিন্তার শক্তি বাড়িয়ে এবং আরও ভালো সিদ্ধান্ত নিতে পাশে থেকে।",

  // ── About: board role labels (roleLabelBn is empty) ────────────────────
  "Executive Chair": "নির্বাহী চেয়ার",
  "President & CEO": "প্রেসিডেন্ট ও প্রধান নির্বাহী",
  Treasurer: "কোষাধ্যক্ষ",
  "Vice Chair": "ভাইস চেয়ার",
  "Education Advisor": "শিক্ষা উপদেষ্টা",
  "Senior Advisor": "জ্যেষ্ঠ উপদেষ্টা",
  "Career Guidance Lead": "ক্যারিয়ার নির্দেশনা প্রধান",
  "Community Coordinator": "কমিউনিটি সমন্বয়ক",
  "Advocacy Manager": "অ্যাডভোকেসি ব্যবস্থাপক",
  "Environmental Lead": "পরিবেশ বিষয়ক প্রধান",

  // ── Places (static locations, map legends) ─────────────────────────────
  Bangladesh: "বাংলাদেশ",
  UK: "যুক্তরাজ্য",
  "United Kingdom": "যুক্তরাজ্য",
  Rajshahi: "রাজশাহী",
  Joypurhat: "জয়পুরহাট",
  Chapainawabganj: "চাঁপাইনবাবগঞ্জ",
  Chapai: "চাঁপাই",
  Kushtia: "কুষ্টিয়া",
  Khulna: "খুলনা",
  Chittagong: "চট্টগ্রাম",
  Feni: "ফেনী",
  Hampshire: "হ্যাম্পশায়ার",
  "Barind region": "বরেন্দ্র অঞ্চল",
  "Palmyra Palm Plantation Drive — Barind Region": "তালগাছ রোপণ কর্মসূচি — বরেন্দ্র অঞ্চল",
  Dhaka: "ঢাকা",
  "South Asia": "দক্ষিণ এশিয়া",
  Europe: "ইউরোপ",

  // ── Reports: document languages (report.language defaults to "English") ─
  English: "ইংরেজি",
  Bangla: "বাংলা",
  Bengali: "বাংলা",
  "English, Bangla": "ইংরেজি, বাংলা",

  // ── Blog categories and tags (nameBn is empty) ─────────────────────────
  Community: "কমিউনিটি",
  Education: "শিক্ষা",
  Scholarships: "বৃত্তি",
  Counselling: "কাউন্সেলিং",
  "Mental Health": "মানসিক স্বাস্থ্য",
  Parenting: "অভিভাবকত্ব",
  "Self-Development": "আত্মোন্নয়ন",
  Career: "ক্যারিয়ার",
  "Social Issues": "সামাজিক সমস্যা",
  "Higher Study": "উচ্চশিক্ষা",
  "Scholarship Opportunities": "বৃত্তির সুযোগ",
  Competitions: "প্রতিযোগিতা",
  Olympiads: "অলিম্পিয়াড",
  News: "সংবাদ",
  Impact: "প্রভাব",
  Resilience: "সহনশীলতা",
  Workshops: "কর্মশালা",
  Equity: "সমতা",
  Relief: "ত্রাণ",
  Initiative: "উদ্যোগ",
  Sustainability: "টেকসই উন্নয়ন",
  Awareness: "সচেতনতা",
  Wellness: "সুস্থতা",
  Opportunities: "সুযোগ",
  "Education & Career": "শিক্ষা ও ক্যারিয়ার",

  // ── Donate page (PageSection donate/content) ───────────────────────────
  "STUDENT SQUARE FOUNDATION": "স্টুডেন্ট স্কয়ার ফাউন্ডেশন",
  "Student Square Foundation": "স্টুডেন্ট স্কয়ার ফাউন্ডেশন",
  "In a world where collective action holds immense power, individual efforts remain invaluable. Your single donation can create ripples of change, transforming lives and building a brighter future. Every penny counts, and your generosity can significantly impact our collective mission at Student Square.":
    "যে পৃথিবীতে সম্মিলিত উদ্যোগের শক্তি অপরিসীম, সেখানে প্রতিটি ব্যক্তিগত প্রচেষ্টাও অমূল্য। আপনার একটি অনুদান পরিবর্তনের ঢেউ তুলতে পারে—বদলে দিতে পারে জীবন, গড়ে তুলতে পারে উজ্জ্বল ভবিষ্যৎ। প্রতিটি পয়সাই গুরুত্বপূর্ণ, আর আপনার উদারতা স্টুডেন্ট স্কয়ারের সম্মিলিত লক্ষ্যে বড় ভূমিকা রাখতে পারে।",
  "Join Us Today": "আজই আমাদের সঙ্গে যুক্ত হন",
  "Be a part of this transformative journey. Your single penny can spark a chain reaction of positive change. Donate now and help us make a difference in the lives of countless individuals.":
    "পরিবর্তনের এই যাত্রার অংশ হোন। আপনার একটি পয়সাও ইতিবাচক পরিবর্তনের ধারাবাহিক প্রতিক্রিয়া শুরু করতে পারে। এখনই অনুদান দিন এবং অগণিত মানুষের জীবনে পরিবর্তন আনতে আমাদের সহায়তা করুন।",
  TRANSPARENCY: "স্বচ্ছতা",
  "How Your Donations Are Utilized": "আপনার অনুদান যেভাবে ব্যবহৃত হয়",
  "We are dedicated to using your contributions to foster positive change across various essential areas:":
    "আপনার অবদান দিয়ে আমরা নিচের গুরুত্বপূর্ণ ক্ষেত্রগুলোতে ইতিবাচক পরিবর্তন আনতে নিবেদিত:",
  "Education Awareness": "শিক্ষা বিষয়ে সচেতনতা",
  "Your donations help us spread awareness about the importance of education, reaching out to communities and encouraging a culture of learning and growth.":
    "আপনার অনুদানে আমরা শিক্ষার গুরুত্ব নিয়ে সচেতনতা ছড়িয়ে দিই, বিভিন্ন কমিউনিটির কাছে পৌঁছাই এবং শেখা ও বিকাশের সংস্কৃতি গড়ে তুলতে উৎসাহ দিই।",
  "Grants for Underprivileged Students": "সুবিধাবঞ্চিত শিক্ষার্থীদের জন্য অনুদান",
  "We provide grants to students from underprivileged backgrounds, ensuring they have access to quality education and opportunities to thrive.":
    "সুবিধাবঞ্চিত পরিবারের শিক্ষার্থীদের আমরা অনুদান দিই, যাতে তারা মানসম্মত শিক্ষা ও এগিয়ে যাওয়ার সুযোগ পায়।",
  "Mentoring and Counselling": "মেন্টরিং ও কাউন্সেলিং",
  "Our programs offer personalized mentoring and counseling to students, guiding them through their educational journey and helping them overcome challenges.":
    "আমাদের কার্যক্রম শিক্ষার্থীদের ব্যক্তিগত মেন্টরিং ও কাউন্সেলিং দেয়—শিক্ষাজীবনের পথে দিকনির্দেশনা দেয় এবং বাধা পেরোতে সাহায্য করে।",
  "Tree Plantation for Decarbonization": "কার্বন নিঃসরণ কমাতে বৃক্ষরোপণ",
  "We are committed to environmental sustainability. Your donations support tree plantation initiatives aimed at reducing carbon footprints and promoting a healthier planet.":
    "আমরা পরিবেশগত স্থায়িত্বে প্রতিশ্রুতিবদ্ধ। আপনার অনুদান কার্বন নিঃসরণ কমানো ও একটি সুস্থ পৃথিবী গড়ার লক্ষ্যে বৃক্ষরোপণ উদ্যোগে ব্যয় হয়।",
  "Skill Enhancement Workshops & Seminars": "দক্ষতা উন্নয়ন কর্মশালা ও সেমিনার",
  "We organize seminars and workshops to help students enhance their skills, preparing them for future opportunities and empowering them to achieve their dreams.":
    "শিক্ষার্থীদের দক্ষতা বাড়াতে আমরা সেমিনার ও কর্মশালার আয়োজন করি, যা তাদের ভবিষ্যতের সুযোগের জন্য প্রস্তুত করে এবং স্বপ্ন পূরণে সক্ষম করে তোলে।",
  "Support for Santal Community Well-being": "সাঁওতাল সম্প্রদায়ের কল্যাণে সহায়তা",
  "We focus on the welfare of the minor Santal community, emphasizing women's education, raising awareness against addiction, and providing family advocacy services.":
    "আমরা ক্ষুদ্র নৃগোষ্ঠী সাঁওতাল সম্প্রদায়ের কল্যাণে কাজ করি—নারীশিক্ষায় গুরুত্ব দিই, মাদকাসক্তির বিরুদ্ধে সচেতনতা গড়ি এবং পারিবারিক অ্যাডভোকেসি সেবা দিই।",
  "Free Educational and Career Magazines": "বিনামূল্যে শিক্ষা ও ক্যারিয়ার ম্যাগাজিন",
  "We publish and distribute educational and career magazines for free, ensuring everyone has access to valuable information and resources.":
    "আমরা বিনামূল্যে শিক্ষা ও ক্যারিয়ার বিষয়ক ম্যাগাজিন প্রকাশ ও বিতরণ করি, যাতে সবাই প্রয়োজনীয় তথ্য ও রিসোর্স হাতে পায়।",
  "Festival Food Distribution": "উৎসবে খাদ্য বিতরণ",
  "We provide food during festivals to ensure that everyone can celebrate joyfully and contribute cheerfully to the community.":
    "উৎসবের সময় আমরা খাবার পৌঁছে দিই, যাতে সবাই আনন্দের সঙ্গে উৎসব উদ্‌যাপন করতে পারে এবং হাসিমুখে সমাজে অংশ নিতে পারে।",
  "Relocation Assistance for Divorced Women": "তালাকপ্রাপ্ত নারীদের পুনর্বাসন সহায়তা",
  "Funds are allocated to assist divorced women in relocating and integrating into society with dignity, offering support for job placements and skills development.":
    "তালাকপ্রাপ্ত নারীরা যেন মর্যাদার সঙ্গে নতুন জায়গায় থিতু হয়ে সমাজে ফিরতে পারেন, সে জন্য তহবিল বরাদ্দ করা হয়—চাকরি পাওয়া ও দক্ষতা উন্নয়নে সহায়তাসহ।",
  "Safe Homes for Dropout Students Due to Poverty": "দারিদ্র্যের কারণে ঝরে পড়া শিক্ষার্থীদের নিরাপদ আবাস",
  "We provide safe homes and educational support for students forced to drop out due to poverty, ensuring they have a nurturing environment to continue their education and pursue their dreams.":
    "দারিদ্র্যের কারণে পড়াশোনা ছাড়তে বাধ্য হওয়া শিক্ষার্থীদের আমরা নিরাপদ আবাস ও শিক্ষা সহায়তা দিই, যাতে তারা যত্নশীল পরিবেশে পড়াশোনা চালিয়ে স্বপ্নের পথে এগোতে পারে।",
  "Transform Lives with Your Support": "আপনার সহায়তায় বদলে দিন জীবন",
  "Your donation, no matter the size, has the power to change someone's life. By contributing to Student Square, you become a vital part of a movement dedicated to education, environmental sustainability, community well-being, and skill development. Together, we can create a lasting impact and build a better tomorrow. We aim to create a chain effect for sustainable development in society.":
    "আপনার অনুদান যত ছোটই হোক, তা কারও জীবন বদলে দিতে পারে। স্টুডেন্ট স্কয়ারে অবদান রেখে আপনি শিক্ষা, পরিবেশগত স্থায়িত্ব, কমিউনিটির কল্যাণ ও দক্ষতা উন্নয়নে নিবেদিত একটি আন্দোলনের গুরুত্বপূর্ণ অংশ হয়ে ওঠেন। একসঙ্গে আমরা দীর্ঘস্থায়ী প্রভাব তৈরি করতে এবং একটি সুন্দর আগামী গড়তে পারি। সমাজে টেকসই উন্নয়নের একটি ধারাবাহিক প্রভাব তৈরি করাই আমাদের লক্ষ্য।",
  "Together, we can create a lasting impact and build a better tomorrow. We aim to create a chain effect for sustainable development in society.":
    "একসঙ্গে আমরা দীর্ঘস্থায়ী প্রভাব তৈরি করতে এবং একটি সুন্দর আগামী গড়তে পারি। সমাজে টেকসই উন্নয়নের একটি ধারাবাহিক প্রভাব তৈরি করাই আমাদের লক্ষ্য।",
  "Targeted Impact": "লক্ষ্যভিত্তিক প্রভাব",
  "Every donation is directed to specific programs with measurable, transparent outcomes reported to our donors.":
    "প্রতিটি অনুদান নির্দিষ্ট কার্যক্রমে ব্যয় হয়, আর তার পরিমাপযোগ্য ও স্বচ্ছ ফলাফল দাতাদের জানানো হয়।",
  "Chain Effect Model": "ধারাবাহিক প্রভাবের মডেল",
  "We design programs that create self-sustaining cycles — one beneficiary empowers the next, multiplying your impact.":
    "আমরা এমন কার্যক্রম সাজাই যা নিজে থেকেই চলতে থাকে—একজন উপকারভোগী পরের জনকে এগিয়ে নেয়, ফলে আপনার অবদানের প্রভাব বহুগুণ হয়।",
  "Community-Led Change": "কমিউনিটির নেতৃত্বে পরিবর্তন",
  "We work with local communities across 5 districts, ensuring programs are culturally rooted and community-owned.":
    "আমরা ৫টি জেলার স্থানীয় কমিউনিটির সঙ্গে কাজ করি, যাতে কার্যক্রমগুলো স্থানীয় সংস্কৃতির সঙ্গে মানানসই হয় এবং কমিউনিটি নিজেই তার মালিকানা নেয়।",
  "Full Accountability": "পূর্ণ জবাবদিহি",
  "Shariah-compliant donation management with transparent fund allocation, regular reporting, and open governance.":
    "শরিয়াহসম্মত অনুদান ব্যবস্থাপনা—স্বচ্ছ তহবিল বরাদ্দ, নিয়মিত প্রতিবেদন ও উন্মুক্ত পরিচালনা।",
  "MAKE AN IMPACT": "প্রভাব তৈরি করুন",
  "Make a Difference with Your Donation": "আপনার অনুদানে পরিবর্তন আনুন",
  "Every penny counts. Select your donation amount below and help us continue our mission across Bangladesh.":
    "প্রতিটি পয়সাই গুরুত্বপূর্ণ। নিচে থেকে অনুদানের পরিমাণ বেছে নিন এবং সারা বাংলাদেশে আমাদের কাজ চালিয়ে যেতে সহায়তা করুন।",
  "Can provide books and stationery to a student in need.":
    "একজন অসচ্ছল শিক্ষার্থীকে বই ও শিক্ষা উপকরণ দিতে পারে।",
  "Plants 5 trees, contributing to a greener Bangladesh.": "৫টি গাছ লাগায়, সবুজ বাংলাদেশ গড়তে ভূমিকা রাখে।",
  "Supports a family with an Eid food package.": "একটি পরিবারকে ঈদের খাদ্যসামগ্রী দিয়ে সহায়তা করে।",
  "Funds a free medical camp for an entire rural community.":
    "একটি গ্রামীণ জনপদের জন্য বিনামূল্যের মেডিকেল ক্যাম্পের খরচ জোগায়।",

  // ── Donate: site settings (donation details) ───────────────────────────
  'For Zakat donations, please write "যাকাত" in the reference. Shariah-compliant Zakat is accepted.':
    'যাকাত পাঠালে রেফারেন্সে "যাকাত" লিখুন। শরিয়াহসম্মত যাকাত গ্রহণ করা হয়।',
  Personal: "পার্সোনাল",
  "Student Square": "স্টুডেন্ট স্কয়ার",
  "Islami Bank Bangladesh LTD, Godagari branch": "ইসলামী ব্যাংক বাংলাদেশ লিমিটেড, গোদাগাড়ী শাখা",
  bKash: "বিকাশ",
  Nagad: "নগদ",
  Rocket: "রকেট",

  // ── Donate: bundled fallbacks (shown until the donate section loads) ────
  "Make an Impact": "প্রভাব তৈরি করুন",
  "Your donation, no matter the size, has the power to change someone's life. By contributing to Student Square, you become a vital part of a movement dedicated to education, environmental sustainability, community well-being, and skill development.":
    "আপনার অনুদান যত ছোটই হোক, তা কারও জীবন বদলে দিতে পারে। স্টুডেন্ট স্কয়ারে অবদান রেখে আপনি শিক্ষা, পরিবেশগত স্থায়িত্ব, কমিউনিটির কল্যাণ ও দক্ষতা উন্নয়নে নিবেদিত একটি আন্দোলনের গুরুত্বপূর্ণ অংশ হয়ে ওঠেন।",
  "Your donations help us spread awareness about the importance of education, reaching out to communities and encouraging a culture of learning and growth across rural and underserved areas.":
    "আপনার অনুদানে আমরা শিক্ষার গুরুত্ব নিয়ে সচেতনতা ছড়িয়ে দিই, বিভিন্ন কমিউনিটির কাছে পৌঁছাই এবং গ্রামীণ ও সুবিধাবঞ্চিত এলাকায় শেখা ও বিকাশের সংস্কৃতি গড়ে তুলতে উৎসাহ দিই।",
  "We provide grants to students from underprivileged backgrounds, ensuring they have access to quality education and opportunities to thrive — regardless of their financial circumstances.":
    "সুবিধাবঞ্চিত পরিবারের শিক্ষার্থীদের আমরা অনুদান দিই, যাতে আর্থিক অবস্থা যেমনই হোক, তারা মানসম্মত শিক্ষা ও এগিয়ে যাওয়ার সুযোগ পায়।",
  "Our programs offer personalized mentoring and counseling to students, guiding them through their educational journey and helping them overcome academic, social, and personal challenges.":
    "আমাদের কার্যক্রম শিক্ষার্থীদের ব্যক্তিগত মেন্টরিং ও কাউন্সেলিং দেয়—শিক্ষাজীবনের পথে দিকনির্দেশনা দেয় এবং পড়াশোনা, সামাজিক ও ব্যক্তিগত বাধা পেরোতে সাহায্য করে।",
  "We are committed to environmental sustainability. Your donations support tree plantation initiatives aimed at reducing carbon footprints, combating climate change, and promoting a healthier planet for future generations.":
    "আমরা পরিবেশগত স্থায়িত্বে প্রতিশ্রুতিবদ্ধ। আপনার অনুদান কার্বন নিঃসরণ কমানো, জলবায়ু পরিবর্তন মোকাবিলা এবং ভবিষ্যৎ প্রজন্মের জন্য একটি সুস্থ পৃথিবী গড়ার লক্ষ্যে বৃক্ষরোপণ উদ্যোগে ব্যয় হয়।",
  "We organize seminars and workshops to help students enhance their skills, preparing them for future opportunities and empowering them to achieve their dreams in a competitive world.":
    "শিক্ষার্থীদের দক্ষতা বাড়াতে আমরা সেমিনার ও কর্মশালার আয়োজন করি, যা তাদের ভবিষ্যতের সুযোগের জন্য প্রস্তুত করে এবং প্রতিযোগিতামূলক পৃথিবীতে স্বপ্ন পূরণে সক্ষম করে তোলে।",
  "We focus on the welfare of the minor Santal community, emphasizing women's education, raising awareness against addiction, and providing family advocacy and integration services.":
    "আমরা ক্ষুদ্র নৃগোষ্ঠী সাঁওতাল সম্প্রদায়ের কল্যাণে কাজ করি—নারীশিক্ষায় গুরুত্ব দিই, মাদকাসক্তির বিরুদ্ধে সচেতনতা গড়ি এবং পারিবারিক অ্যাডভোকেসি ও সমাজে একীভূত হওয়ার সেবা দিই।",
  "Free Educational & Career Magazines": "বিনামূল্যে শিক্ষা ও ক্যারিয়ার ম্যাগাজিন",
  "We publish and distribute educational and career magazines for free, ensuring everyone has access to valuable information and resources that can shape their futures.":
    "আমরা বিনামূল্যে শিক্ষা ও ক্যারিয়ার বিষয়ক ম্যাগাজিন প্রকাশ ও বিতরণ করি, যাতে ভবিষ্যৎ গড়তে সহায়ক প্রয়োজনীয় তথ্য ও রিসোর্স সবাই হাতে পায়।",
  "We provide food during festivals to ensure that everyone can celebrate joyfully and contribute cheerfully to the community — no family left behind during times of celebration.":
    "উৎসবের সময় আমরা খাবার পৌঁছে দিই, যাতে সবাই আনন্দের সঙ্গে উৎসব উদ্‌যাপন করতে পারে এবং হাসিমুখে সমাজে অংশ নিতে পারে—উৎসবের দিনে কোনো পরিবার যেন পিছিয়ে না থাকে।",
  "Funds are allocated to assist divorced women in relocating and integrating into society with dignity, offering support for job placements and skills development to ensure financial independence.":
    "তালাকপ্রাপ্ত নারীরা যেন মর্যাদার সঙ্গে নতুন জায়গায় থিতু হয়ে সমাজে ফিরতে পারেন, সে জন্য তহবিল বরাদ্দ করা হয়—আর্থিক স্বাধীনতা নিশ্চিত করতে চাকরি পাওয়া ও দক্ষতা উন্নয়নে সহায়তাসহ।",
  "Safe Homes for Dropout Students": "ঝরে পড়া শিক্ষার্থীদের জন্য নিরাপদ আবাস",
  "We provide safe homes and educational support for students forced to drop out due to poverty, ensuring they have a nurturing environment to continue their education and pursue their dreams without fear.":
    "দারিদ্র্যের কারণে পড়াশোনা ছাড়তে বাধ্য হওয়া শিক্ষার্থীদের আমরা নিরাপদ আবাস ও শিক্ষা সহায়তা দিই, যাতে তারা যত্নশীল পরিবেশে পড়াশোনা চালিয়ে নির্ভয়ে স্বপ্নের পথে এগোতে পারে।",
  // Project cards, matching seed-data/projects.ts (titleBn / summaryBn).
  "Beyond The Journey Project": "প্রজেক্টের পেছনের গল্প",
  "A special initiative that presents accurate career information, ongoing research and prospective fields of work for the various departments of the country's public universities, in the light of the experience of faculty members, specialists and professionals.":
    "একটি বিশেষ উদ্যোগ, যা দেশের পাবলিক বিশ্ববিদ্যালয়গুলোর বিভিন্ন ডিপার্টমেন্টের ক্যারিয়ার–সংক্রান্ত সঠিক তথ্য, চলমান গবেষণা এবং সম্ভাব্য কর্মক্ষেত্রগুলো সংশ্লিষ্ট ফ্যাকাল্টি সদস্য, বিশেষজ্ঞ ও পেশাজীবীদের অভিজ্ঞতার আলোকে তুলে ধরা হয়।",
  "Project Health Care for All": "প্রজেক্ট হেলথ কেয়ার ফর অল",
  "Health camps are held at fixed intervals every year to bring healthcare within reach of people in marginal areas, with particular emphasis on the char lands and the Barind region.":
    "প্রান্তিক অঞ্চলের মানুষের নাগালের মধ্যে স্বাস্থ্যসেবা নিয়ে যেতে প্রতিবছর নির্দিষ্ট সময় পরপর হেলথ ক্যাম্প আয়োজন করা হয়। এক্ষেত্রে চরাঞ্চল ও বরেন্দ্র অঞ্চলকে বিশেষ গুরুত্ব প্রদান করা হয়।",
  "Amar Bhai Er Eid Project": "আমার ভাইয়ের ইদ প্রজেক্ট",
  "Every Eid-ul-Fitr, Eid food supplies including beef are gifted to families in need so they can share in the joy of the festival. The project also takes part in relief and rehabilitation during emergencies such as floods and COVID-19.":
    "প্রতি ঈদুল ফিতরে কিছু অসহায় অসচ্ছল পরিবারে ঈদের আনন্দ ভাগাভাগি করে নিতে গরুর মাংসসহ ঈদের খাদ্যসামগ্রী উপহার দেয়া হয়। এছাড়াও বিভিন্ন জরুরী পরিস্থিতিতে(বন্যা/কোভিড ১৯) ত্রাণ ও পুনর্বাসনে অংশগ্রহণ করা হয়।",
  "One Minute Investment Project": "ওয়ান মিনিট ইনভেস্টমেন্ট প্রোজেক্ট",
  "Ensuring sustainable human development through students' education, mental wellbeing, career development and social empowerment.":
    "শিক্ষার্থীদের শিক্ষা, মানসিক সুস্থতা, ক্যারিয়ার উন্নয়ন এবং সামাজিক ক্ষমতায়নের মাধ্যমে টেকসই মানব উন্নয়ন নিশ্চিত করা।",
  "Counter Climate Change Project": "কাউন্টার ক্লাইমেট চেঞ্জ প্রজেক্ট",
  "An initiative to plant one hundred thousand palmyra palm trees to cool extreme weather and halt the falling water table. 500 saplings have already been planted.":
    "পরিবর্তিত পরিবেশে চরমভাবাপন্ন আবহাওয়ার উষ্ণতা কমাতে, পানির স্তর নেমে যাওয়া ঠেকাতে একলক্ষ তালগাছ রোপনের উদ্যোগ নেওয়া হয়েছে। ইতিমধ্যে ৫০০ তালগাছের চারা রোপন সম্পন্ন হয়েছে।",

  // ── Report details: authors, publisher, region, topics, keywords, rights ─
  "Finance Committee": "অর্থ কমিটি",
  "Care Unit": "কেয়ার ইউনিট",
  "Communications Team": "কমিউনিকেশনস টিম",
  "Student Square Editorial Board": "স্টুডেন্ট স্কয়ার সম্পাদনা পর্ষদ",
  "Programme Team": "কার্যক্রম টিম",
  "Student Square Care Unit": "স্টুডেন্ট স্কয়ার কেয়ার ইউনিট",
  National: "জাতীয়",
  Transparency: "স্বচ্ছতা",
  Finance: "আর্থিক বিষয়",
  Youth: "তরুণ প্রজন্ম",
  Competition: "প্রতিযোগিতা",
  Skills: "দক্ষতা",
  Volunteering: "স্বেচ্ছাসেবা",
  audit: "অডিট",
  financials: "আর্থিক বিবরণী",
  programme: "কার্যক্রম",
  counselling: "কাউন্সেলিং",
  highlights: "হাইলাইটস",
  annual: "বার্ষিক",
  impact: "প্রভাব",
  "brain battle": "ব্রেইন ব্যাটল",
  "© Student Square Foundation. All rights reserved.": "© স্টুডেন্ট স্কয়ার ফাউন্ডেশন। সর্বস্বত্ব সংরক্ষিত।",

  // ── Real life stories: the fields the Story model has no `*Bn` column for ─
  // (quote, summary and body live in quoteBn/summaryBn/bodyBn instead). Keys
  // are the seeded text exactly, curly apostrophes and typos included.
  "Md. Sakhowatul Islam": "মো. সাখাওয়াতুল ইসলাম",
  "Md. Shahadatul Islam Rizon": "মো. শাহাদাতুল ইসলাম রিজন",
  "Mohammad Ali": "মোহাম্মদ আলী",
  "Apsari Wasim": "আপসারি ওয়াসিম",
  "Md. Abul Asad": "মো. আবুল আসাদ",
  "Md. Saroar Jaman": "মো. সরোয়ার জামান",
  "Farzana Maria": "ফারজানা মারিয়া",
  "Md. Sahadat Hossain": "মো. সাহাদাত হোসেন",
  "Sabina Yeasmin Shila": "সাবিনা ইয়াসমিন শিলা",
  "Shahadat Ali": "শাহাদাত আলী",
  "Mostafizur Rahman": "মোস্তাফিজুর রহমান",
  "Sajnin Sultana": "সাজনীন সুলতানা",

  "MBBS graduate": "এমবিবিএস গ্র্যাজুয়েট",
  "MBBS Student": "এমবিবিএস শিক্ষার্থী",
  "Computer Science & Engineering Student": "কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং বিভাগের শিক্ষার্থী",
  "Faculty of Agriculture's Student": "কৃষি অনুষদের শিক্ষার্থী",
  "Bachelor of Education's Student": "ব্যাচেলর অব এডুকেশনের শিক্ষার্থী",
  "Building Engineering & Construction Management Student":
    "বিল্ডিং ইঞ্জিনিয়ারিং অ্যান্ড কনস্ট্রাকশন ম্যানেজমেন্ট বিভাগের শিক্ষার্থী",
  "Institute of Education and Research's Student": "শিক্ষা ও গবেষণা ইনস্টিটিউটের শিক্ষার্থী",
  "Department of Geography & Environmental Studies' Student": "ভূগোল ও পরিবেশবিদ্যা বিভাগের শিক্ষার্থী",
  "Department of Mass Communication and Journalism's Student": "গণযোগাযোগ ও সাংবাদিকতা বিভাগের শিক্ষার্থী",
  "Dept. of Civil Engineering's Student": "পুরকৌশল বিভাগের শিক্ষার্থী",

  "Kushtia Medical College": "কুষ্টিয়া মেডিকেল কলেজ",
  "Kushtia Medical College & Hospital": "কুষ্টিয়া মেডিকেল কলেজ ও হাসপাতাল",
  "Rajshahi University of Engineering & Technology": "রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়",
  "Bangladesh Agricultural University": "বাংলাদেশ কৃষি বিশ্ববিদ্যালয়",
  "Rajshahi Medical College": "রাজশাহী মেডিকেল কলেজ",
  "Govt. Teachers' Training College, Rajshahi": "সরকারি টিচার্স ট্রেনিং কলেজ, রাজশাহী",
  "University of Rajshahi": "রাজশাহী বিশ্ববিদ্যালয়",
  "Bangladesh University of Engineering and Technology": "বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয় (বুয়েট)",
  "Pabna University of Science and Technology": "পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়",

  "Medical admission success": "মেডিকেল ভর্তিতে সাফল্য",
  "Medical college admission": "মেডিকেল কলেজে ভর্তি",
  "Rajshahi Medical admission": "রাজশাহী মেডিকেলে ভর্তি",
  "RUET engineering admission": "রুয়েটে ইঞ্জিনিয়ারিংয়ে ভর্তি",
  "BUET engineering admission": "বুয়েটে ইঞ্জিনিয়ারিংয়ে ভর্তি",
  "PUST engineering admission": "পাবিপ্রবিতে ইঞ্জিনিয়ারিংয়ে ভর্তি",
  "BAU admission success": "বাকৃবিতে ভর্তিতে সাফল্য",
  "Teachers' Training admission": "টিচার্স ট্রেনিং কলেজে ভর্তি",
  "Rajshahi University admission": "রাজশাহী বিশ্ববিদ্যালয়ে ভর্তি",
  "RU Journalism admission": "রাবির সাংবাদিকতা বিভাগে ভর্তি",

  "School: Godagari Model School and College": "স্কুল: গোদাগাড়ী মডেল স্কুল অ্যান্ড কলেজ",
  "School: Godagari Model School and College, Rajshahi.": "স্কুল: গোদাগাড়ী মডেল স্কুল অ্যান্ড কলেজ, রাজশাহী।",
  "School: Godagari Govt. High School and College.": "স্কুল: গোদাগাড়ী সরকারি উচ্চ বিদ্যালয় ও কলেজ।",
  "School: Shah Garibullah Girls' High School, Lalmonirhat": "স্কুল: শাহ গরীবুল্লাহ বালিকা উচ্চ বিদ্যালয়, লালমনিরহাট",
  "School: Kakon Hat High School": "স্কুল: কাঁকনহাট উচ্চ বিদ্যালয়",
  "School: Mohishalbari Secondary Girls’ School": "স্কুল: মহিষালবাড়ী মাধ্যমিক বালিকা বিদ্যালয়",
  "School: Mahishal Bari Al Islah Academy": "স্কুল: মহিষালবাড়ী আল ইসলাহ একাডেমি",
  "School: Narendra Pur High School": "স্কুল: নরেন্দ্রপুর উচ্চ বিদ্যালয়",
  "School: A.F.Z Pilot Girls’ High School in 2018": "স্কুল: এ.এফ.জেড পাইলট বালিকা উচ্চ বিদ্যালয় (২০১৮)",
  "School: A.F.Z Pilot Girls High School.": "স্কুল: এ.এফ.জেড পাইলট বালিকা উচ্চ বিদ্যালয়।",

  "College: New Gov. Degree College, Rajshahi": "কলেজ: নিউ গভর্নমেন্ট ডিগ্রি কলেজ, রাজশাহী",
  "College: New Government Degree College, Rajshahi": "কলেজ: নিউ গভর্নমেন্ট ডিগ্রি কলেজ, রাজশাহী",
  "College: New Govt. Degree College": "কলেজ: নিউ গভর্নমেন্ট ডিগ্রি কলেজ",
  "College: Rajshahi College": "কলেজ: রাজশাহী কলেজ",
  "College: Godagari Government College, Rajshahi.": "কলেজ: গোদাগাড়ী সরকারি কলেজ, রাজশাহী।",
  "College: Godagri Govt. College, Godagari, Rajshahi.": "কলেজ: গোদাগাড়ী সরকারি কলেজ, গোদাগাড়ী, রাজশাহী।",
  "College: Collectorate School and College, Rangpur": "কলেজ: কালেক্টরেট স্কুল অ্যান্ড কলেজ, রংপুর",
  "College: Shohid A H M Kamruzzaman Government Degree College, Rajshahi":
    "কলেজ: শহীদ এ এইচ এম কামারুজ্জামান সরকারি ডিগ্রি কলেজ, রাজশাহী",
  "College: HSC from Rajshahi Govt. Women’s College.": "কলেজ: রাজশাহী সরকারি মহিলা কলেজ থেকে এইচএসসি।",
  "College: Nawabganj Government College in 2020.": "কলেজ: নবাবগঞ্জ সরকারি কলেজ (২০২০)।",
  "College: Notre Dame College": "কলেজ: নটর ডেম কলেজ",

  "Now at: Kushtia Medical College, Kushtia": "বর্তমানে: কুষ্টিয়া মেডিকেল কলেজ, কুষ্টিয়া",
  "Now at: Kushtia Medical College and Hospital.": "বর্তমানে: কুষ্টিয়া মেডিকেল কলেজ ও হাসপাতাল।",
  "Now at: Rajshahi University of Engineering and Technology": "বর্তমানে: রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়",
  "Now at: Rajshahi University of Engineering and Technology, Rajshahi":
    "বর্তমানে: রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়, রাজশাহী",
  "Now at: Bangladesh Agricultural University, Mymensingh": "বর্তমানে: বাংলাদেশ কৃষি বিশ্ববিদ্যালয়, ময়মনসিংহ",
  "Now at: Rajshahi Medical College": "বর্তমানে: রাজশাহী মেডিকেল কলেজ",
  "Now at: Govt. Teachers’ Training College, Rajshahi.": "বর্তমানে: সরকারি টিচার্স ট্রেনিং কলেজ, রাজশাহী।",
  "Now at: University of Rajshahi": "বর্তমানে: রাজশাহী বিশ্ববিদ্যালয়",
  "Now at: Rajshahi University.": "বর্তমানে: রাজশাহী বিশ্ববিদ্যালয়।",
  "Now at: Bangladesh University of Engineering and Technology.": "বর্তমানে: বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয় (বুয়েট)।",
  "Now at: Pabna University of Science and Technology.": "বর্তমানে: পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়।",
};
