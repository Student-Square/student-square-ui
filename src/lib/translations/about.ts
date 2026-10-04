import type { Dict } from "../i18n";

/** About Us, Archive, Who We Are, member profiles, Where We Work. */
export const ABOUT: Dict = {
  // /about
  "about.title": { EN: "About Us", BN: "আমাদের সম্পর্কে" },
  "about.badge": { EN: "About Us", BN: "আমাদের সম্পর্কে" },
  "about.headingLead": { EN: "The people and work behind", BN: "পিছনের মানুষ ও কাজ" },
  "about.headingAccent": { EN: "Student Square.", BN: "স্টুডেন্ট স্কয়ারের।" },
  "about.intro": {
    EN: "Student Square is a non-profit organization devoted to building an inclusive society where every individual's potential is nurtured and developed, free from discrimination.",
    BN: "স্টুডেন্ট স্কয়ার একটি অলাভজনক সংগঠন, যা এমন একটি অন্তর্ভুক্তিমূলক সমাজ গড়তে নিবেদিত, যেখানে বৈষম্যহীনভাবে প্রত্যেক মানুষের সম্ভাবনা লালিত ও বিকশিত হয়।",
  },
  "about.visionMission": { EN: "Our Vision and Mission", BN: "আমাদের লক্ষ্য ও উদ্দেশ্য" },
  "about.visionMissionDesc": {
    EN: "The purpose that guides every programme and partnership.",
    BN: "প্রতিটি কার্যক্রম ও অংশীদারিত্বের পেছনের উদ্দেশ্য।",
  },
  "about.explore": { EN: "Explore", BN: "দেখুন" },
  "about.seeWork": { EN: "See what we do", BN: "আমরা যা করি" },
  "about.searchPlaceholder": { EN: "Search this page...", BN: "এই পাতায় খুঁজুন..." },
  "about.showing": { EN: "Showing {shown} of {total}", BN: "{total}টির মধ্যে {shown}টি দেখানো হচ্ছে" },
  "about.noMatch": { EN: "Nothing matches your search.", BN: "আপনার অনুসন্ধানের সঙ্গে কিছু মেলেনি।" },
  "about.tryKeyword": { EN: "Try a different keyword.", BN: "অন্য কোনো শব্দ দিয়ে খুঁজে দেখুন।" },
  "about.sectionNumber": { EN: "Section {n}", BN: "অংশ {n}" },
  "about.sectionsLabel": { EN: "sections", BN: "টি অংশ" },
  "about.card.whoWeAre": { EN: "Who We Are", BN: "আমরা কে" },
  "about.card.whoWeAreDesc": {
    EN: "Discover the team and values behind Student Square",
    BN: "স্টুডেন্ট স্কয়ারের পেছনের মানুষ ও মূল্যবোধের সঙ্গে পরিচিত হোন",
  },
  "about.card.whereWeWork": { EN: "Where We Work", BN: "আমাদের কর্মক্ষেত্র" },
  "about.card.whereWeWorkDesc": { EN: "Explore our global presence and impact", BN: "দেশে-বিদেশে আমাদের উপস্থিতি ও প্রভাব দেখুন" },
  "about.card.reports": { EN: "Annual Reports & Financials", BN: "বার্ষিক প্রতিবেদন ও আর্থিক তথ্য" },
  "about.card.reportsDesc": {
    EN: "Access our annual reports and financial transparency",
    BN: "আমাদের বার্ষিক প্রতিবেদন ও আর্থিক স্বচ্ছতার তথ্য দেখুন",
  },
  "about.card.news": { EN: "News & Press", BN: "সংবাদ ও গণমাধ্যম" },
  "about.card.newsDesc": { EN: "Media coverage and news about Student Square", BN: "স্টুডেন্ট স্কয়ারকে নিয়ে গণমাধ্যমের প্রতিবেদন ও সংবাদ" },
  "about.card.archive": { EN: "Archive", BN: "আর্কাইভ" },
  "about.card.archiveDesc": { EN: "Browse past initiatives and historical content", BN: "অতীতের উদ্যোগ ও পুরোনো তথ্য দেখুন" },

  // /about/archive
  "archive.intro": {
    EN: "Past initiatives and records will appear here once they are added.",
    BN: "পুরোনো উদ্যোগ ও নথি যোগ করা হলে সেগুলো এখানে দেখা যাবে।",
  },
  "archive.empty": {
    EN: "Nothing has been archived yet.",
    BN: "এখনো আর্কাইভে কিছু যোগ করা হয়নি।",
  },

  // /about/who-we-are
  "team.board": { EN: "Board of Trustees", BN: "ট্রাস্টি বোর্ড" },
  "team.advisory": { EN: "Advisory Board", BN: "উপদেষ্টা পরিষদ" },
  "team.leadership": { EN: "Leadership Team", BN: "নেতৃত্ব দল" },
  "team.management": { EN: "Management Team", BN: "ব্যবস্থাপনা দল" },
  "team.loadFailed": { EN: "Failed to load team data.", BN: "টিমের তথ্য লোড করা যায়নি।" },
  "team.empty": { EN: "No team members have been added yet.", BN: "এখনো কোনো টিম সদস্য যোগ করা হয়নি।" },
  "team.ourTeam": { EN: "Our Team", BN: "আমাদের টিম" },
  "team.ourPeople": { EN: "Our People", BN: "আমাদের মানুষেরা" },

  // /about/who-we-are/[slug]
  "member.loading": { EN: "Loading profile…", BN: "প্রোফাইল লোড হচ্ছে…" },
  "member.notFound": { EN: "Member not found", BN: "সদস্য পাওয়া যায়নি" },
  "member.notFoundBody": { EN: "We couldn't find this team member.", BN: "এই টিম সদস্যকে খুঁজে পাওয়া যায়নি।" },
  "member.backToTeam": { EN: "Back to Our Team", BN: "আমাদের টিমে ফিরে যান" },
  "member.noBio": { EN: "No biography available yet.", BN: "এখনো কোনো জীবনী যোগ করা হয়নি।" },
  "member.moreFrom": { EN: "More from {group}", BN: "{group} থেকে আরও" },
  "member.news": { EN: "{name}'s News", BN: "{name}-এর সংবাদ" },
  "member.allNews": { EN: "All {name}'s News", BN: "{name}-এর সব সংবাদ" },

  // /about/where-we-work
  "where.title": { EN: "Where We Work", BN: "আমাদের কর্মক্ষেত্র" },
  "where.p1": {
    EN: "Our 5,600+ team members live and work in over 40+ countries around the world. 84% of them are from the countries where they work.",
    BN: "আমাদের ৫,৬০০+ টিম সদস্য বিশ্বের ৪০টিরও বেশি দেশে বসবাস ও কাজ করেন। তাদের ৮৪% যে দেশে কাজ করেন, সেই দেশেরই মানুষ।",
  },
  "where.p2": {
    EN: "The work we do in each country is informed by our partners there: local community members, government officials, and other changemakers who are invested in transforming their communities for good.",
    BN: "প্রতিটি দেশে আমাদের কাজের দিকনির্দেশনা আসে সেখানকার অংশীদারদের কাছ থেকে—স্থানীয় কমিউনিটির সদস্য, সরকারি কর্মকর্তা এবং আরও অনেক পরিবর্তনের কারিগর, যারা নিজেদের কমিউনিটিকে ভালোর দিকে বদলে দিতে কাজ করছেন।",
  },
  "where.p3": {
    EN: "Note: This list is regularly updated, and does not represent all of our country operations. We add pages as we ramp up programs and shift from emergency response to longer-term development efforts.",
    BN: "দ্রষ্টব্য: এই তালিকা নিয়মিত হালনাগাদ করা হয় এবং এতে আমাদের সব দেশের কার্যক্রম অন্তর্ভুক্ত নয়। কার্যক্রম বাড়ার সঙ্গে সঙ্গে এবং জরুরি সাড়াদান থেকে দীর্ঘমেয়াদি উন্নয়নে যাওয়ার পর আমরা নতুন পৃষ্ঠা যোগ করি।",
  },
};
