import type { Dict } from "../i18n";

/** Annual Reports & Financials: the library and each report's page. */
export const REPORTS: Dict = {
  "reports.title": { EN: "Annual Reports & Financials", BN: "বার্ষিক প্রতিবেদন ও আর্থিক তথ্য" },
  "reports.intro": {
    EN: "We believe in transparency. Access our annual reports, program reports and financial statements to understand how we allocate resources and measure our progress.",
    BN: "আমরা স্বচ্ছতায় বিশ্বাস করি। আমরা কীভাবে সম্পদ বরাদ্দ করি এবং অগ্রগতি পরিমাপ করি, তা জানতে আমাদের বার্ষিক প্রতিবেদন, কার্যক্রম প্রতিবেদন ও আর্থিক বিবরণী দেখুন।",
  },
  "reports.commitment": { EN: "Our Commitment to Transparency", BN: "স্বচ্ছতার প্রতি আমাদের অঙ্গীকার" },
  "reports.commitmentBody": {
    EN: "Student Square publishes regular reports and financial statements to demonstrate accountability to our donors, supporters, and the communities we serve. Our financial records are independently audited to ensure accuracy and compliance with international standards.",
    BN: "দাতা, সমর্থক ও যে কমিউনিটির জন্য আমরা কাজ করি—সবার কাছে জবাবদিহি নিশ্চিত করতে স্টুডেন্ট স্কয়ার নিয়মিত প্রতিবেদন ও আর্থিক বিবরণী প্রকাশ করে। নির্ভুলতা ও আন্তর্জাতিক মান মেনে চলা নিশ্চিত করতে আমাদের আর্থিক হিসাব স্বাধীনভাবে নিরীক্ষা করা হয়।",
  },

  // Section / document-type names, by ReportCategory
  "reports.cat.ANNUAL_REPORT": { EN: "Annual Reports", BN: "বার্ষিক প্রতিবেদন" },
  "reports.cat.ANNUAL_HIGHLIGHTS": { EN: "Annual Highlights", BN: "বার্ষিক হাইলাইটস" },
  "reports.cat.PROGRAM_REPORT": { EN: "SS Program Reports", BN: "এসএস কার্যক্রম প্রতিবেদন" },
  "reports.cat.FINANCIAL_STATEMENT": { EN: "Financial Statements", BN: "আর্থিক বিবরণী" },

  // Library
  "reports.viewAll": { EN: "View all documents", BN: "সব ডকুমেন্ট দেখুন" },
  "reports.search": { EN: "Search reports", BN: "প্রতিবেদন খুঁজুন" },
  "reports.filterBy": { EN: "Filter by:", BN: "ফিল্টার করুন:" },
  "reports.focusAreas": { EN: "Focus areas", BN: "কাজের ক্ষেত্র" },
  "reports.documentTypes": { EN: "Document types", BN: "ডকুমেন্টের ধরন" },
  "reports.regions": { EN: "Regions", BN: "অঞ্চল" },
  "reports.countries": { EN: "Countries", BN: "দেশ" },
  "reports.years": { EN: "Years", BN: "সাল" },
  "reports.loading": { EN: "Loading reports…", BN: "প্রতিবেদন লোড হচ্ছে…" },
  "reports.loadFailed": { EN: "We couldn't load the reports right now.", BN: "এই মুহূর্তে প্রতিবেদনগুলো লোড করা যাচ্ছে না।" },
  "reports.noMatch": { EN: "No reports match these filters.", BN: "এই ফিল্টারের সঙ্গে কোনো প্রতিবেদন মেলেনি।" },
  "reports.comingSoon": { EN: "Our reports will be published here soon.", BN: "আমাদের প্রতিবেদনগুলো শিগগিরই এখানে প্রকাশ করা হবে।" },
  "reports.foundOne": { EN: "{count} report found", BN: "{count}টি প্রতিবেদন পাওয়া গেছে" },
  "reports.foundMany": { EN: "{count} reports found", BN: "{count}টি প্রতিবেদন পাওয়া গেছে" },
  "reports.read": { EN: "Read", BN: "পড়ুন" },

  // Report page
  "reports.all": { EN: "All reports", BN: "সব প্রতিবেদন" },
  "reports.loadingOne": { EN: "Loading report…", BN: "প্রতিবেদন লোড হচ্ছে…" },
  "reports.unavailable": {
    EN: "This report isn't available. It may have been moved or unpublished.",
    BN: "প্রতিবেদনটি পাওয়া যাচ্ছে না। এটি সরিয়ে নেওয়া বা অপ্রকাশিত করা হয়ে থাকতে পারে।",
  },
  "reports.loadOneFailed": {
    EN: "We couldn't load this report right now. Please try again.",
    BN: "এই মুহূর্তে প্রতিবেদনটি লোড করা যাচ্ছে না। অনুগ্রহ করে আবার চেষ্টা করুন।",
  },
  "reports.publicationYear": { EN: "Publication year", BN: "প্রকাশের সাল" },
  "reports.language": { EN: "Language", BN: "ভাষা" },
  "reports.format": { EN: "Format", BN: "ফরম্যাট" },
  "reports.publisher": { EN: "Publisher", BN: "প্রকাশক" },
  "reports.viewDownload": { EN: "View & Download", BN: "দেখুন ও ডাউনলোড করুন" },
  "reports.authors": { EN: "Authors", BN: "লেখক" },
  "reports.openNewTab": { EN: "Open in a new tab", BN: "নতুন ট্যাবে খুলুন" },
  "reports.openNamedNewTab": { EN: "Open {title} in a new tab", BN: "{title} নতুন ট্যাবে খুলুন" },
  "reports.download": { EN: "Download", BN: "ডাউনলোড" },
  "reports.downloadNamed": { EN: "Download {title}", BN: "{title} ডাউনলোড করুন" },
  "reports.showLess": { EN: "Show less", BN: "কম দেখান" },
  "reports.readAbstract": { EN: "Read full abstract", BN: "পুরো সারসংক্ষেপ পড়ুন" },
  "reports.docInfo": { EN: "Document information", BN: "ডকুমেন্টের তথ্য" },
  "reports.contentType": { EN: "Content type", BN: "কনটেন্টের ধরন" },
  "reports.country": { EN: "Country", BN: "দেশ" },
  "reports.region": { EN: "Region", BN: "অঞ্চল" },
  "reports.topics": { EN: "Topics", BN: "বিষয়" },
  "reports.rights": { EN: "Rights", BN: "স্বত্ব" },
  "reports.keywords": { EN: "Keywords", BN: "কিওয়ার্ড" },
  "reports.copyLinkReport": { EN: "Copy link to this report", BN: "এই প্রতিবেদনের লিংক কপি করুন" },
  "reports.shareEmail": { EN: "Share by email", BN: "ইমেইলে শেয়ার করুন" },
  "reports.shareEmailReport": { EN: "Share this report by email", BN: "এই প্রতিবেদনটি ইমেইলে শেয়ার করুন" },
};
