/**
 * Lightweight bilingual layer (tracker #5).
 *
 * This is deliberately NOT a full i18n framework. Three things switch when a
 * visitor picks বাংলা:
 *   1. Content — pages prefer the `*Bn` fields the API already returns
 *      (title/titleBn, summary/summaryBn, …) via `pick()` in LanguageProvider.
 *   2. Known content — API text that has no `*Bn` column (impact stats, the
 *      editable About pages, donate copy, role labels…) is looked up by its
 *      exact English in KNOWN_BN. Reword it in admin and it shows in English
 *      until the new wording is added there too.
 *   3. Chrome — every label on the public site, translated by hand in the UI
 *      table below plus the per-area tables in ./translations. Deep
 *      admin/dashboard UI is intentionally left English.
 *
 * To translate another label: add its key to the matching table and read it
 * with `t("key")`, or `t("key", { count: 3 })` for a `{count}` placeholder.
 */

import { ABOUT } from "./translations/about";
import { AUTH } from "./translations/auth";
import { BLOG } from "./translations/blog";
import { COMMON } from "./translations/common";
import { DONATE } from "./translations/donate";
import { KNOWN } from "./translations/known";
import { PARTNER } from "./translations/partner";
import { PROGRAMMES } from "./translations/programmes";
import { REPORTS } from "./translations/reports";

export type Language = "EN" | "BN";

export type Dict = Record<string, { EN: string; BN: string }>;

export const LANGUAGE_STORAGE_KEY = "ss_language";

/** Header/mobile nav labels, keyed by their route path. Missing path → English. */
export const NAV_BN: Record<string, string> = {
  "/about": "আমাদের সম্পর্কে",
  "/about/mission-vision": "আমাদের লক্ষ্য ও উদ্দেশ্য",
  "/about/who-we-are": "আমরা কে",
  "/about/where-we-work": "আমাদের কর্মক্ষেত্র",
  "/about/reports": "বার্ষিক প্রতিবেদন ও আর্থিক তথ্য",
  "/news": "সংবাদ ও গণমাধ্যম",
  "/about/archive": "আর্কাইভ",
  "/what-we-do": "কার্যক্রমসমূহ",
  "/projects": "আমাদের প্রকল্পসমূহ",
  "/what-we-do/student-counselling": "শিক্ষার্থী পরামর্শসেবা",
  "/what-we-do/parent-advocacy": "অভিভাবক সহায়তা",
  "/what-we-do/community-wellbeing": "শিশু-কিশোর কল্যাণ",
  "/what-we-do/climate-action": "জলবায়ু কার্যক্রম",
  "/what-we-do/research-publications": "গবেষণা ও প্রকাশনা",
  "/what-we-do/scholarships-grants": "বৃত্তি ও অনুদান",
  "/blog": "ব্লগ",
  "/blog/magazine": "ম্যাগাজিন",
  "/blog/education-career": "শিক্ষা ও ক্যারিয়ার ব্লগ",
  "/blog/education-career/career": "ক্যারিয়ার",
  "/blog/education-career/higher-study": "উচ্চশিক্ষা",
  "/blog/education-career/self-development": "আত্মোন্নয়ন",
  "/blog/education-career/parenting": "অভিভাবকত্ব",
  "/blog/education-career/social-issues": "সামাজিক সমস্যা",
  "/blog/education-career/scholarship-opportunities": "বৃত্তির সুযোগসমূহ",
  "/blog/education-career/competitions": "প্রতিযোগিতাসমূহ",
  "/blog/education-career/olympiads": "অলিম্পিয়াড",
  "/blog/real-life-stories": "বাস্তব জীবনের গল্প",
  "/blog/events": "ইভেন্ট",
  "/get-involved/donate": "অনুদান দিন",
  "/get-involved/partner": "আমাদের অংশীদার হন",
  "/contact": "যোগাযোগ করুন",
};

/** Nav group labels that have no path of their own (e.g. "Get Involved"). */
export const NAV_GROUP_BN: Record<string, string> = {
  "Get Involved": "অংশগ্রহণ করুন",
};

/** Header, footer, search, home page and contact form. */
const CHROME: Dict = {
  login: { EN: "Login", BN: "লগইন" },
  logout: { EN: "Sign out", BN: "সাইন আউট" },
  register: { EN: "Register", BN: "নিবন্ধন করুন" },
  donate: { EN: "Donate", BN: "অনুদান দিন" },
  dashboard: { EN: "Dashboard", BN: "ড্যাশবোর্ড" },
  profile: { EN: "Profile", BN: "প্রোফাইল" },
  search: { EN: "Search", BN: "খুঁজুন" },
  searchPlaceholder: { EN: "Search the site…", BN: "সাইটে অনুসন্ধান করুন…" },
  searchNoResults: { EN: "No results found", BN: "কোনো ফলাফল পাওয়া যায়নি" },
  searchPrompt: { EN: "Type at least 2 characters to search.", BN: "অনুসন্ধানের জন্য অন্তত ২টি অক্ষর লিখুন।" },
  resultsFor: { EN: "Results for", BN: "ফলাফল" },
  readMore: { EN: "Read more", BN: "আরও পড়ুন" },
  read: { EN: "Read", BN: "পড়ুন" },
  viewAll: { EN: "View all", BN: "সবগুলো দেখুন" },
  language: { EN: "Language", BN: "ভাষা" },
  // Header menus
  menu: { EN: "Menu", BN: "মেনু" },
  toggleMenu: { EN: "Toggle menu", BN: "মেনু খুলুন বা বন্ধ করুন" },
  closeMenu: { EN: "Close menu", BN: "মেনু বন্ধ করুন" },
  profileMenu: { EN: "Profile menu", BN: "প্রোফাইল মেনু" },
  myProfile: { EN: "My Profile", BN: "আমার প্রোফাইল" },
  viewProfile: { EN: "View profile", BN: "প্রোফাইল দেখুন" },
  myDashboard: { EN: "My Dashboard", BN: "আমার ড্যাশবোর্ড" },
  adminDashboard: { EN: "Admin Dashboard", BN: "অ্যাডমিন ড্যাশবোর্ড" },
  settings: { EN: "Settings", BN: "সেটিংস" },
  switchToLight: { EN: "Switch to light mode", BN: "লাইট মোডে যান" },
  switchToDark: { EN: "Switch to dark mode", BN: "ডার্ক মোডে যান" },
  // Search result group headings
  articles: { EN: "Articles", BN: "প্রবন্ধ" },
  stories: { EN: "Real Life Stories", BN: "বাস্তব জীবনের গল্প" },
  projects: { EN: "Projects", BN: "প্রকল্পসমূহ" },
  events: { EN: "Events", BN: "ইভেন্টসমূহ" },
  // Footer section headings
  quickLinks: { EN: "Quick Links", BN: "গুরুত্বপূর্ণ লিংক" },
  resources: { EN: "Resources", BN: "রিসোর্সসমূহ" },
  contact: { EN: "Contact", BN: "যোগাযোগ" },
  followUs: { EN: "Follow Us", BN: "আমাদের সাথে থাকুন" },
  // Footer link labels
  "footer.about": { EN: "About Us", BN: "আমাদের সম্পর্কে" },
  "footer.whatWeDo": { EN: "What We Do", BN: "কার্যক্রমসমূহ" },
  "footer.join": { EN: "Join Us", BN: "যুক্ত হন" },
  "footer.contact": { EN: "Contact", BN: "যোগাযোগ" },
  "footer.blog": { EN: "Blog", BN: "ব্লগ" },
  "footer.stories": { EN: "Real Life Stories", BN: "বাস্তব জীবনের গল্প" },
  "footer.events": { EN: "Events", BN: "ইভেন্ট" },
  "footer.news": { EN: "News & Press", BN: "সংবাদ ও গণমাধ্যম" },
  "footer.privacy": { EN: "Privacy Policy", BN: "গোপনীয়তা নীতি" },
  "footer.terms": { EN: "Terms of Use", BN: "ব্যবহারের শর্তাবলী" },
  "footer.refund": { EN: "Return and Refund Policy", BN: "রিটার্ন ও রিফান্ড নীতি" },
  "footer.team": { EN: "Management", BN: "ব্যবস্থাপনা" },
  "footer.sitemap": { EN: "Sitemap", BN: "সাইটম্যাপ" },
  "footer.tagline": { EN: "Empowering students through counselling, career development, and community service.", BN: "কাউন্সেলিং, ক্যারিয়ার উন্নয়ন ও কমিউনিটি সেবার মাধ্যমে শিক্ষার্থীদের এগিয়ে নিচ্ছি।" },
  "footer.rights": { EN: "Student Square. All rights reserved.", BN: "স্টুডেন্ট স্কয়ার। সর্বস্বত্ব সংরক্ষিত।" },
  "footer.registration": {
    EN: "Registered under the Societies Registration Act, 1860, Bangladesh. Registration No. RAJS-589/2026",
    BN: "সোসাইটিজ রেজিস্ট্রেশন অ্যাক্ট, ১৮৬০ (বাংলাদেশ) অনুযায়ী নিবন্ধিত। নিবন্ধন নম্বর: RAJS-589/2026",
  },
  "footer.email": { EN: "Email", BN: "ইমেইল" },
  // Home page
  "home.heroUnavailableTitle": { EN: "Featured content will be back shortly.", BN: "ফিচার করা কনটেন্ট শিগগিরই ফিরে আসবে।" },
  "home.heroUnavailableSubtitle": { EN: "We're refreshing what's on display. Check back in a moment.", BN: "আমরা প্রদর্শিত কনটেন্ট নতুন করে সাজাচ্ছি। কিছুক্ষণ পর আবার দেখুন।" },
  "home.statsHeadingLead": { EN: "A Strong Community of", BN: "আমাদের শক্তিশালী কমিউনিটিতে" },
  "home.statsHeadingAccent": { EN: "5000+ Students", BN: "৫০০০+ শিক্ষার্থী" },
  "home.statsSubheading": { EN: "Making a difference across the globe with measurable impact", BN: "পরিমাপযোগ্য প্রভাবের মাধ্যমে দেশে-বিদেশে পরিবর্তন তৈরি করছি" },
  "home.whatWeDoBadge": { EN: "Student Square - What We Do", BN: "স্টুডেন্ট স্কয়ার - আমরা যা করি" },
  "home.whatWeDoLead": { EN: "Your Changes", BN: "আপনার পরিবর্তন" },
  "home.whatWeDoAccent": { EN: "Start Here", BN: "শুরু এখানেই" },
  "home.whatWeDoSubheading": { EN: "All you need is real-time data and real-life stories to shape your career.", BN: "ক্যারিয়ার গড়তে আপনার প্রয়োজন বাস্তব তথ্য ও বাস্তব জীবনের গল্প।" },
  "home.magazine": { EN: "Magazine", BN: "ম্যাগাজিন" },
  "home.educationCareerBlog": { EN: "Education & Career Blog", BN: "শিক্ষা ও ক্যারিয়ার ব্লগ" },
  "home.realLifeStories": { EN: "Real Life Stories", BN: "বাস্তব জীবনের গল্প" },
  "home.viewAllChanges": { EN: "View All Changes", BN: "সব পরিবর্তন দেখুন" },
  "home.projectsTitle": { EN: "Our Visionary Projects", BN: "আমাদের দূরদর্শী প্রকল্প" },
  "home.projectsDescription": { EN: "Explore our portfolio of initiatives that showcase our commitment to student support, advocacy, and community engagement.", BN: "শিক্ষার্থী সহায়তা, সচেতনতা ও কমিউনিটি সম্পৃক্ততায় আমাদের অঙ্গীকার তুলে ধরা উদ্যোগগুলো দেখুন।" },
  "home.learnMore": { EN: "Learn More", BN: "আরও জানুন" },
  "home.learnMoreEllipsis": { EN: "Learn More...", BN: "আরও জানুন..." },
  "home.previousProject": { EN: "Previous project", BN: "আগের প্রকল্প" },
  "home.nextProject": { EN: "Next project", BN: "পরের প্রকল্প" },
  "home.expand": { EN: "Expand", BN: "বিস্তারিত দেখুন" },
  "home.playVideo": { EN: "Play video", BN: "ভিডিও চালান" },
  "home.pauseVideo": { EN: "Pause video", BN: "ভিডিও থামান" },
  "home.muteVideo": { EN: "Mute active video", BN: "চলতি ভিডিওর শব্দ বন্ধ করুন" },
  "home.unmuteVideo": { EN: "Unmute active video", BN: "চলতি ভিডিওর শব্দ চালু করুন" },
  "home.videoTitle": { EN: "See How You're Bringing Change", BN: "দেখুন, আপনি কীভাবে পরিবর্তন আনছেন" },
  "home.videoDescription": { EN: "Discover how Student Square's comprehensive approach can support your journey toward success and wellbeing.", BN: "সাফল্য ও ভালো থাকার পথে স্টুডেন্ট স্কয়ারের সমন্বিত উদ্যোগ কীভাবে সহায়তা করে তা জানুন।" },
  "home.documentaryAlt": { EN: "Student Square documentary", BN: "স্টুডেন্ট স্কয়ার ডকুমেন্টারি" },
  "home.playImpactVideo": { EN: "Play impact video", BN: "প্রভাবের ভিডিও চালান" },
  "home.storiesHeadingLead": { EN: "Hundreds of", BN: "শত শত" },
  "home.storiesDescription": { EN: "Transformative journeys from students across Bangladesh shaped by Student Square's programs.", BN: "স্টুডেন্ট স্কয়ারের কার্যক্রমে গড়ে ওঠা বাংলাদেশের শিক্ষার্থীদের পরিবর্তনের গল্প।" },
  "home.viewMoreStories": { EN: "View More Stories", BN: "আরও গল্প দেখুন" },
  "home.press": { EN: "Press", BN: "প্রেস" },
  "home.newsTitleBrand": { EN: "Student Square", BN: "স্টুডেন্ট স্কয়ার" },
  "home.newsTitleAccent": { EN: "in the News", BN: "সংবাদে" },
  "home.viewAllNews": { EN: "View All News & Updates", BN: "সব সংবাদ ও আপডেট দেখুন" },
  "home.successStories": { EN: "Success Stories", BN: "সাফল্যের গল্প" },
  "home.testimonialsLead": { EN: "The students we", BN: "যে শিক্ষার্থীদের আমরা" },
  "home.testimonialsAccent": { EN: "empower", BN: "ক্ষমতায়ন করি" },
  "home.testimonialsDescription": { EN: "Students across Bangladesh on what changed for them through our counselling, advocacy, and wellbeing programmes", BN: "কাউন্সেলিং, সহায়তা ও কল্যাণমূলক কার্যক্রমে বাংলাদেশের শিক্ষার্থীদের জীবনে কী পরিবর্তন এসেছে" },
  "contact.getInTouch": { EN: "Get in Touch", BN: "যোগাযোগ করুন" },
  "contact.intro": { EN: "Whether you want counselling support, are looking to volunteer, or would like to partner with us, send us a message and our team will get back to you.", BN: "আপনি কাউন্সেলিং সহায়তা চান, স্বেচ্ছাসেবক হতে চান, অথবা আমাদের সঙ্গে কাজ করতে চান - আমাদের বার্তা পাঠান, আমাদের টিম যোগাযোগ করবে।" },
  "contact.headOffice": { EN: "Head Office", BN: "প্রধান কার্যালয়" },
  "contact.addressLine1": { EN: "2nd Floor, Jalal Super Market, Thana Road", BN: "২য় তলা, জালাল সুপার মার্কেট, থানা রোড" },
  "contact.addressLine2": { EN: "Godagari-6290, Rajshahi, Bangladesh", BN: "গোদাগাড়ী-৬২৯০, রাজশাহী, বাংলাদেশ" },
  "contact.officeMapTitle": { EN: "Student Square Office", BN: "স্টুডেন্ট স্কয়ার অফিস" },
  "contact.phoneEmail": { EN: "Phone / Email", BN: "ফোন / ইমেইল" },
  "contact.whatsapp": { EN: "WhatsApp", BN: "হোয়াটসঅ্যাপ" },
  "contact.openMaps": { EN: "Open in Google Maps", BN: "গুগল ম্যাপে দেখুন" },
  "contact.messageSent": { EN: "Message Sent", BN: "বার্তা পাঠানো হয়েছে" },
  "contact.thankYou": { EN: "Thank you for reaching out. Our team will contact you shortly.", BN: "যোগাযোগ করার জন্য ধন্যবাদ। আমাদের টিম শিগগিরই আপনার সঙ্গে যোগাযোগ করবে।" },
  "contact.sendAnother": { EN: "Send another message", BN: "আরেকটি বার্তা পাঠান" },
  "contact.fullName": { EN: "Full Name", BN: "পূর্ণ নাম" },
  "contact.namePlaceholder": { EN: "Enter your name", BN: "আপনার নাম লিখুন" },
  "contact.emailAddress": { EN: "Email Address", BN: "ইমেইল ঠিকানা" },
  "contact.phoneNumber": { EN: "Phone Number (preferably WhatsApp)", BN: "ফোন নম্বর (হোয়াটসঅ্যাপ হলে ভালো)" },
  "contact.subject": { EN: "Subject", BN: "বিষয়" },
  "contact.subjectPlaceholder": { EN: "Counselling support / Volunteering / Partnership", BN: "কাউন্সেলিং সহায়তা / স্বেচ্ছাসেবা / অংশীদারত্ব" },
  "contact.message": { EN: "Message", BN: "বার্তা" },
  "contact.messagePlaceholder": { EN: "How can we help you?", BN: "আমরা কীভাবে সাহায্য করতে পারি?" },
  "contact.messageHint": { EN: "At least 10 characters.", BN: "অন্তত ১০টি অক্ষর লিখুন।" },
  "contact.terms": { EN: "I have read and accept the terms and conditions", BN: "আমি শর্তাবলী পড়েছি এবং গ্রহণ করছি" },
  "contact.updates": { EN: "I would like to receive updates from Student Square", BN: "আমি স্টুডেন্ট স্কয়ারের আপডেট পেতে চাই" },
  "contact.sending": { EN: "Sending...", BN: "পাঠানো হচ্ছে..." },
  "contact.submitInquiry": { EN: "Submit Inquiry", BN: "বার্তা পাঠান" },
  "contact.submittingAria": { EN: "Submitting your inquiry", BN: "আপনার বার্তা পাঠানো হচ্ছে" },
  "contact.submitAria": { EN: "Submit contact form inquiry", BN: "যোগাযোগ ফর্মের বার্তা পাঠান" },
  "contact.errorName": { EN: "Please enter your name.", BN: "অনুগ্রহ করে আপনার নাম লিখুন।" },
  "contact.errorEmail": { EN: "Please enter a full email address, e.g. name@example.com.", BN: "অনুগ্রহ করে একটি পূর্ণ ইমেইল ঠিকানা লিখুন, যেমন name@example.com।" },
  "contact.errorPhone": { EN: "Please shorten the phone number.", BN: "অনুগ্রহ করে ফোন নম্বরটি ছোট করুন।" },
  "contact.errorSubject": { EN: "Please enter a subject.", BN: "অনুগ্রহ করে বিষয় লিখুন।" },
  "contact.errorMessage": { EN: "Please tell us a little more.", BN: "অনুগ্রহ করে আরও কিছু লিখুন।" },
  "contact.errorCheckFields": { EN: "Please check the highlighted fields and try again.", BN: "চিহ্নিত ঘরগুলো দেখে আবার চেষ্টা করুন।" },
  "contact.errorRateLimit": { EN: "You have sent several messages in the last hour. Please try again later, or email us directly.", BN: "গত এক ঘণ্টায় আপনি কয়েকটি বার্তা পাঠিয়েছেন। অনুগ্রহ করে পরে চেষ্টা করুন, অথবা সরাসরি ইমেইল করুন।" },
  "contact.errorGeneric": { EN: "Sorry, your message could not be sent. Please try again, or email us directly.", BN: "দুঃখিত, আপনার বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন, অথবা সরাসরি ইমেইল করুন।" },
};

/** Every label on the public site. */
export const UI: Dict = {
  ...CHROME,
  ...COMMON,
  ...ABOUT,
  ...PROGRAMMES,
  ...REPORTS,
  ...BLOG,
  ...PARTNER,
  ...DONATE,
  ...AUTH,
};

export const KNOWN_BN: Record<string, string> = KNOWN;

export type TranslateVars = Record<string, string | number>;

export const localeFor = (lang: Language) => (lang === "BN" ? "bn-BD" : "en-GB");

/**
 * Numbers in Bangla mode use Bangla digits. Pass `grouping: false` for years
 * and issue numbers, so 2024 stays "২০২৪" rather than "২,০২৪".
 */
export const formatNumber = (lang: Language, value: number, grouping = true): string =>
  value.toLocaleString(lang === "BN" ? "bn-BD" : "en-US", { useGrouping: grouping });

export const translate = (lang: Language, key: string, vars?: TranslateVars): string => {
  const entry = UI[key];
  if (!entry) return key;
  let text = entry[lang] || entry.EN;
  if (vars) {
    for (const name of Object.keys(vars)) {
      const value = vars[name];
      const shown = typeof value === "number" ? formatNumber(lang, value) : value;
      text = text.split(`{${name}}`).join(shown);
    }
  }
  return text;
};

/** Bangla for API text with no `*Bn` column, when its exact English is known. */
export const knownBangla = (text: string | null | undefined): string | undefined =>
  text ? KNOWN_BN[text.trim()] : undefined;

export const navLabel = (lang: Language, path: string | undefined, fallback: string): string => {
  if (lang === "EN") return fallback;
  if (path && NAV_BN[path]) return NAV_BN[path];
  if (NAV_GROUP_BN[fallback]) return NAV_GROUP_BN[fallback];
  return fallback;
};
