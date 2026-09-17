import type { Dict } from "../i18n";

/**
 * The donate page, its bundled fallbacks, and the payment result pages. Copy
 * the admin can edit lives in the donate page section and is translated
 * through KNOWN instead.
 */
export const DONATE: Dict = {
  // Hero + form
  "donate.headingLead": { EN: "Make a", BN: "আপনার অনুদানে" },
  "donate.headingAccent": { EN: "Difference", BN: "পরিবর্তন" },
  "donate.headingTail": { EN: "with Your Donation", BN: "আনুন" },
  "donate.heroBodyFallback": {
    EN: "In a world where collective action holds immense power, individual efforts remain invaluable. Your single donation can create ripples of change, transforming lives and building a brighter future.",
    BN: "যে পৃথিবীতে সম্মিলিত উদ্যোগের শক্তি অপরিসীম, সেখানে প্রতিটি ব্যক্তিগত প্রচেষ্টাও অমূল্য। আপনার একটি অনুদান পরিবর্তনের ঢেউ তুলতে পারে—বদলে দিতে পারে জীবন, গড়ে তুলতে পারে উজ্জ্বল ভবিষ্যৎ।",
  },
  "donate.ourImpact": { EN: "Our Impact", BN: "আমাদের প্রভাব" },
  "donate.formTitle": { EN: "Your Donation Can Change a Life", BN: "আপনার অনুদান একটি জীবন বদলে দিতে পারে" },
  "donate.donateToProject": { EN: "Donate to this project", BN: "এই প্রকল্পে অনুদান দিন" },
  "donate.generalCta": { EN: "Give to the general fund", BN: "সাধারণ তহবিলে দান করুন" },
  "donate.selectedProject": { EN: "Selected", BN: "নির্বাচিত" },
  "donate.generalTitle": { EN: "General fund", BN: "সাধারণ তহবিল" },
  "donate.generalBody": {
    EN: "Zakat, Sadakah, or a gift that is not tied to one project.",
    BN: "যাকাত, সদকা, বা কোনো নির্দিষ্ট প্রকল্পের বাইরের অনুদান।",
  },
  "donate.changeProject": { EN: "Change project", BN: "প্রকল্প বদলান" },
  "donate.projectNotFound": { EN: "That project is not open for donations.", BN: "এই প্রকল্পে এখন অনুদান নেওয়া হচ্ছে না।" },
  "donate.backToProjects": { EN: "Back to projects", BN: "প্রকল্পে ফিরে যান" },
  "donate.whereGoes": { EN: "Where your gift goes", BN: "আপনার অনুদান কোথায় যাবে" },
  "donate.projectOrPurpose": { EN: "Project or purpose", BN: "প্রকল্প বা উদ্দেশ্য" },
  "donate.loadingProjects": { EN: "Loading projects…", BN: "প্রকল্প লোড হচ্ছে…" },
  "donate.otherPlaceholder": { EN: "e.g. Zakat, Sadakah, General fund", BN: "যেমন: যাকাত, সদকা, সাধারণ তহবিল" },
  "donate.selectAmount": { EN: "Select Amount (BDT)", BN: "পরিমাণ বেছে নিন (টাকা)" },
  "donate.currency": { EN: "BDT", BN: "৳" },
  "donate.amount": { EN: "BDT {amount}", BN: "৳{amount}" },
  "donate.otherAmount": { EN: "Enter other amount", BN: "অন্য পরিমাণ লিখুন" },
  "donate.anonymous": { EN: "Make my donation anonymous", BN: "আমার অনুদান বেনামে দিন" },
  "donate.anonymousNote": {
    EN: "Your name, phone, and email will not be collected or shown publicly. You can still download a receipt after payment using the link on the confirmation page.",
    BN: "আপনার নাম, ফোন ও ইমেইল সংগ্রহ করা বা প্রকাশ্যে দেখানো হবে না। পেমেন্টের পর নিশ্চিতকরণ পৃষ্ঠার লিংক থেকে আপনি রসিদ ডাউনলোড করতে পারবেন।",
  },
  "donate.name": { EN: "Your Name *", BN: "আপনার নাম *" },
  "donate.phone": { EN: "Phone Number *", BN: "ফোন নম্বর *" },
  "donate.email": { EN: "Email Address *", BN: "ইমেইল ঠিকানা *" },
  "donate.redirecting": { EN: "Redirecting to secure payment…", BN: "নিরাপদ পেমেন্টে নিয়ে যাওয়া হচ্ছে…" },
  "donate.donateAmount": { EN: "Donate BDT {amount}", BN: "৳{amount} অনুদান দিন" },
  "donate.sslNote": {
    EN: "You will be taken to SSLCommerz to complete your payment securely.",
    BN: "নিরাপদে পেমেন্ট সম্পন্ন করতে আপনাকে SSLCommerz-এ নিয়ে যাওয়া হবে।",
  },
  "donate.err.target": {
    EN: "The project could not be loaded. Please go back and choose it again.",
    BN: "প্রকল্পটি লোড করা যায়নি। অনুগ্রহ করে ফিরে গিয়ে আবার বেছে নিন।",
  },
  "donate.err.min": { EN: "Minimum donation is {min} BDT.", BN: "সর্বনিম্ন অনুদান {min} টাকা।" },
  "donate.err.name": { EN: "Please enter your name.", BN: "অনুগ্রহ করে আপনার নাম লিখুন।" },
  "donate.err.email": { EN: "Please enter your email.", BN: "অনুগ্রহ করে আপনার ইমেইল লিখুন।" },
  "donate.err.phone": { EN: "Please enter your phone number.", BN: "অনুগ্রহ করে আপনার ফোন নম্বর লিখুন।" },
  "donate.err.payment": { EN: "Could not start payment. Please try again.", BN: "পেমেন্ট শুরু করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।" },

  // Preset amounts: what each one funds (one-time, shown under the buttons)
  "donate.impact.100": { EN: "৳100 can provide books and stationery to a student in need.", BN: "৳১০০ দিয়ে একজন অসচ্ছল শিক্ষার্থীকে বই ও শিক্ষা উপকরণ দেওয়া যায়।" },
  "donate.impact.500": { EN: "৳500 plants 5 trees, contributing to a greener Bangladesh.", BN: "৳৫০০ দিয়ে ৫টি গাছ লাগানো যায়, যা সবুজ বাংলাদেশ গড়তে ভূমিকা রাখে।" },
  "donate.impact.1000": { EN: "৳1,000 supports an entire family with an Eid food package.", BN: "৳১,০০০ দিয়ে একটি পুরো পরিবারকে ঈদের খাদ্যসামগ্রী দেওয়া যায়।" },
  "donate.impact.5000": { EN: "৳5,000 funds a free medical camp for a rural community.", BN: "৳৫,০০০ দিয়ে একটি গ্রামীণ জনপদে বিনামূল্যের মেডিকেল ক্যাম্প আয়োজন করা যায়।" },

  // Join / projects / utilisation / transform / impact
  "donate.joinFallbackHeading": { EN: "Join Us Today", BN: "আজই আমাদের সঙ্গে যুক্ত হন" },
  "donate.donateNow": { EN: "Donate Now", BN: "এখনই অনুদান দিন" },
  "donate.projectsEyebrow": { EN: "Our Active Projects", BN: "আমাদের চলমান প্রকল্প" },
  "donate.projectsHeading": { EN: "Programs Your Donation Funds", BN: "আপনার অনুদানে যে কার্যক্রম চলে" },
  "donate.projectsBody": {
    EN: "Every contribution you make directly supports one of our flagship programs — each designed for maximum community impact.",
    BN: "আপনার প্রতিটি অবদান সরাসরি আমাদের কোনো একটি প্রধান কার্যক্রমে ব্যয় হয়—যার প্রতিটি কমিউনিটিতে সর্বোচ্চ প্রভাব ফেলার জন্য সাজানো।",
  },
  "donate.transparencyFallback": { EN: "Full Transparency", BN: "পূর্ণ স্বচ্ছতা" },
  "donate.ourMission": { EN: "Our Mission", BN: "আমাদের লক্ষ্য" },
  "donate.give": { EN: "Give ৳{amount}", BN: "৳{amount} দিন" },

  // Payment methods
  // Ways to give: online and direct, merged
  "donate.ways.eyebrow": { EN: "Ways to Give", BN: "অনুদানের উপায়" },
  "donate.ways.body": {
    EN: "Give online through the form above, or send your gift directly to our bank account or mobile banking number.",
    BN: "ওপরের ফর্মের মাধ্যমে অনলাইনে দিন, অথবা সরাসরি আমাদের ব্যাংক অ্যাকাউন্ট বা মোবাইল ব্যাংকিং নম্বরে অনুদান পাঠান।",
  },
  "donate.ways.online": { EN: "Online", BN: "অনলাইনে" },
  "donate.ways.onlineCta": { EN: "Donate online", BN: "অনলাইনে অনুদান দিন" },
  "donate.ways.directSub": { EN: "Without the payment gateway", BN: "পেমেন্ট গেটওয়ে ছাড়া" },
  "donate.paymentHeading": { EN: "Pay Securely via SSLCommerz", BN: "SSLCommerz-এর মাধ্যমে নিরাপদে পেমেন্ট করুন" },
  "donate.paymentBody": {
    EN: "Online donations are processed through SSLCommerz, Bangladesh's leading payment gateway. Your payment is encrypted and secure.",
    BN: "অনলাইন অনুদান বাংলাদেশের শীর্ষস্থানীয় পেমেন্ট গেটওয়ে SSLCommerz-এর মাধ্যমে প্রক্রিয়া করা হয়। আপনার পেমেন্ট এনক্রিপ্টেড ও নিরাপদ।",
  },
  "donate.card": { EN: "Debit / Credit Card", BN: "ডেবিট / ক্রেডিট কার্ড" },
  "donate.cardBody": {
    EN: "Pay using any Visa, Mastercard, or local bank debit card. Your card details are handled directly by SSLCommerz — we never see them.",
    BN: "যেকোনো ভিসা, মাস্টারকার্ড বা দেশীয় ব্যাংকের ডেবিট কার্ড দিয়ে পেমেন্ট করুন। আপনার কার্ডের তথ্য সরাসরি SSLCommerz প্রক্রিয়া করে—আমরা তা কখনো দেখি না।",
  },
  "donate.mobile": { EN: "Mobile Banking", BN: "মোবাইল ব্যাংকিং" },
  "donate.mobileBody": {
    EN: "Choose bKash, Nagad or Rocket on the SSLCommerz payment page and complete the payment with your own account.",
    BN: "SSLCommerz-এর পেমেন্ট পেজে বিকাশ, নগদ বা রকেট বেছে নিয়ে নিজের অ্যাকাউন্ট দিয়ে পেমেন্ট সম্পন্ন করুন।",
  },
  "donate.internet": { EN: "Internet Banking", BN: "ইন্টারনেট ব্যাংকিং" },
  "donate.internetBody": {
    EN: "Pay directly from your bank account via internet banking. Supported by all major Bangladeshi banks through the SSLCommerz gateway.",
    BN: "ইন্টারনেট ব্যাংকিংয়ের মাধ্যমে সরাসরি আপনার ব্যাংক অ্যাকাউন্ট থেকে পেমেন্ট করুন। SSLCommerz গেটওয়ের মাধ্যমে বাংলাদেশের সব প্রধান ব্যাংক সমর্থিত।",
  },
  "donate.zakatGatewayBody": {
    EN: "{link} and write \"যাকাত\" as the purpose.",
    BN: "{link} এবং উদ্দেশ্যের ঘরে \"যাকাত\" লিখুন।",
  },

  // Direct giving
  "donate.directEyebrow": { EN: "Direct Giving", BN: "সরাসরি অনুদান" },
  "donate.directHeading": { EN: "How to Donate", BN: "কীভাবে অনুদান দেবেন" },
  "donate.directBody": {
    EN: "Prefer to give without the gateway? Send your contribution straight to our bank account or mobile banking number.",
    BN: "গেটওয়ে ছাড়া দিতে চান? আমাদের ব্যাংক অ্যাকাউন্ট বা মোবাইল ব্যাংকিং নম্বরে সরাসরি আপনার অবদান পাঠান।",
  },
  "donate.bankTransfer": { EN: "Bank Transfer", BN: "ব্যাংক ট্রান্সফার" },
  "donate.accountName": { EN: "A/C Name", BN: "অ্যাকাউন্টের নাম" },
  "donate.accountNo": { EN: "A/C No", BN: "অ্যাকাউন্ট নম্বর" },
  "donate.bank": { EN: "Bank", BN: "ব্যাংক" },
  "donate.swift": { EN: "SWIFT", BN: "সুইফট" },
  "donate.routing": { EN: "Routing Number", BN: "রাউটিং নম্বর" },
  "donate.sendMoneyTo": { EN: "Send Money To", BN: "সেন্ড মানি করুন এই নম্বরে" },
  "donate.zakatSadaqah": { EN: "Zakat & Sadaqah", BN: "যাকাত ও সদকা" },

  // Result pages
  "donate.success.title": { EN: "Thank you for your donation!", BN: "আপনার অনুদানের জন্য ধন্যবাদ!" },
  "donate.success.body": { EN: "Your payment was successful", BN: "আপনার পেমেন্ট সফল হয়েছে" },
  "donate.success.reference": { EN: "reference", BN: "রেফারেন্স" },
  "donate.success.emailed": { EN: "A PDF receipt has been emailed to you.", BN: "PDF রসিদ আপনার ইমেইলে পাঠানো হয়েছে।" },
  "donate.success.viewReceipt": { EN: "View & download receipt", BN: "রসিদ দেখুন ও ডাউনলোড করুন" },
  "donate.success.myDonations": { EN: "My donations", BN: "আমার অনুদান" },
  "donate.failed.title": { EN: "Payment didn't go through", BN: "পেমেন্ট সম্পন্ন হয়নি" },
  "donate.failed.body": { EN: "We couldn't confirm your payment", BN: "আমরা আপনার পেমেন্ট নিশ্চিত করতে পারিনি" },
  "donate.failed.noCharge": { EN: "No charge has been recorded — please try again.", BN: "কোনো টাকা কাটা হয়নি—অনুগ্রহ করে আবার চেষ্টা করুন।" },
  "donate.cancelled.title": { EN: "Donation cancelled", BN: "অনুদান বাতিল করা হয়েছে" },
  "donate.cancelled.body": { EN: "You cancelled the payment", BN: "আপনি পেমেন্ট বাতিল করেছেন" },
  "donate.cancelled.comeBack": { EN: "You can come back any time.", BN: "যেকোনো সময় আবার ফিরে আসতে পারেন।" },
  "donate.fullStop": { EN: ".", BN: "।" },
  "donate.backToDonate": { EN: "Back to donate", BN: "অনুদান পৃষ্ঠায় ফিরে যান" },
  "donate.receipt.noToken": { EN: "No receipt token provided.", BN: "কোনো রসিদ টোকেন দেওয়া হয়নি।" },
  "donate.receipt.loading": { EN: "Loading receipt…", BN: "রসিদ লোড হচ্ছে…" },
  "donate.receipt.notFound": { EN: "Receipt not found.", BN: "রসিদ পাওয়া যায়নি।" },
  "donate.receipt.title": { EN: "Donation Receipt", BN: "অনুদানের রসিদ" },
  "donate.receipt.donor": { EN: "Donor", BN: "দাতা" },
  "donate.receipt.anonymous": { EN: "Anonymous", BN: "বেনামি" },
  "donate.receipt.supports": { EN: "Supports", BN: "যে খাতে" },
  "donate.receipt.generalFund": { EN: "General Fund", BN: "সাধারণ তহবিল" },
  "donate.receipt.amount": { EN: "Amount", BN: "পরিমাণ" },
  "donate.receipt.status": { EN: "Status", BN: "অবস্থা" },
  "donate.receipt.date": { EN: "Date", BN: "তারিখ" },
  "donate.receipt.download": { EN: "Download PDF invoice", BN: "PDF ইনভয়েস ডাউনলোড করুন" },
  "donate.receipt.pending": {
    EN: "Your invoice will be available here once payment is confirmed.",
    BN: "পেমেন্ট নিশ্চিত হলে আপনার ইনভয়েস এখানে পাওয়া যাবে।",
  },
  "donate.status.PAID": { EN: "PAID", BN: "পরিশোধিত" },
  "donate.status.PENDING": { EN: "PENDING", BN: "অপেক্ষমাণ" },
  "donate.status.FAILED": { EN: "FAILED", BN: "ব্যর্থ" },
  "donate.status.CANCELLED": { EN: "CANCELLED", BN: "বাতিল" },
  "donate.status.REFUNDED": { EN: "REFUNDED", BN: "ফেরত দেওয়া হয়েছে" },
};
