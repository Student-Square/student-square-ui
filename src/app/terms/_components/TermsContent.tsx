"use client";

import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { SENSITIVE_CONSENT_SUMMARY, SENSITIVE_CONSENT_SUMMARY_BN } from "@/lib/registration";

/**
 * The Terms of Use body in the reader's language. Each language is written out
 * as a whole document rather than assembled from dictionary keys, so either
 * version can be reviewed top to bottom. Change both together.
 */
export default function TermsContent() {
  const { lang } = useLanguage();
  return lang === "BN" ? <Bangla /> : <English />;
}

function English() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        Terms of Use
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The rules for using Student Square Foundation&apos;s platform and programmes.
      </p>

      <div className="mt-10 space-y-10">
        <Section title="Agreement">
          <p>
            By creating an account or using Student Square, you agree to these
            Terms of Use and our{" "}
            <Link href="/privacy" className="underline">
              Privacy Notice
            </Link>
            . If you do not agree, do not register or continue using the
            platform.
          </p>
        </Section>

        <Section title="Who we are">
          <p>
            Student Square Foundation works with young people across Bangladesh
            on education, wellbeing, and leadership. The platform connects
            members with programmes, counsellors, mentors, and Foundation
            content.
          </p>
        </Section>

        <Section title="Your account">
          <p>
            You must provide accurate registration details and keep your login
            secure. You are responsible for activity under your account. Tell us
            promptly if you think someone else has used it.
          </p>
          <p>
            Membership and programme access may be limited by age, eligibility,
            or Foundation policy. We may suspend or close an account that
            breaches these Terms or puts others at risk.
          </p>
        </Section>

        <Section title="Acceptable use">
          <p>
            Use the platform lawfully and respectfully. Do not harass others,
            share others&apos; private information, attempt to break security,
            or use the service to send spam or harmful content.
          </p>
        </Section>

        <Section title="Sensitive information — please read before agreeing">
          <p className="font-medium text-foreground">We will ask you about:</p>
          <ul className="list-disc pl-5 space-y-0.5">
            {SENSITIVE_CONSENT_SUMMARY.categories.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p>
            <span className="font-medium text-foreground">Why: </span>
            {SENSITIVE_CONSENT_SUMMARY.purpose}
          </p>
          <p>
            <span className="font-medium text-foreground">Who can see it: </span>
            {SENSITIVE_CONSENT_SUMMARY.access}
          </p>
          <p>
            <span className="font-medium text-foreground">How long we keep it: </span>
            {SENSITIVE_CONSENT_SUMMARY.retention}
          </p>
          <p>
            <span className="font-medium text-foreground">Changing your mind: </span>
            {SENSITIVE_CONSENT_SUMMARY.withdrawal}
          </p>
          <p className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-foreground">
            By accepting these Terms of Use at registration, you consent to
            Student Square Foundation collecting and storing this sensitive
            information for the purpose described above.
          </p>
        </Section>

        <Section title="No medical or psychological diagnosis">
          <p>
            Content, assessments, and guidance on the platform are educational
            and supportive. They are not a medical or psychological diagnosis,
            and they do not replace professional clinical care when that is
            needed.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            We may update these Terms from time to time. Continued use after a
            published change means you accept the updated Terms. Material
            changes to how we handle sensitive information will also be
            reflected in the{" "}
            <Link href="/privacy" className="underline">
              Privacy Notice
            </Link>
            .
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these Terms: reach us through the{" "}
            <Link href="/contact" className="underline">
              contact page
            </Link>{" "}
            or the{" "}
            <Link href="/dashboard/feedback" className="underline">
              feedback form
            </Link>
            .
          </p>
          <p className="text-xs text-muted-foreground">
            Student Square Foundation is registered under the Societies
            Registration Act, 1860, Bangladesh.
          </p>
        </Section>
      </div>
    </main>
  );
}

function Bangla() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        ব্যবহারের শর্তাবলী
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        স্টুডেন্ট স্কয়ার ফাউন্ডেশনের প্ল্যাটফর্ম ও কার্যক্রম ব্যবহারের নিয়মাবলি।
      </p>

      <div className="mt-10 space-y-10">
        <Section title="সম্মতি">
          <p>
            অ্যাকাউন্ট খুলে বা স্টুডেন্ট স্কয়ার ব্যবহার করে আপনি এই ব্যবহারের
            শর্তাবলী এবং আমাদের{" "}
            <Link href="/privacy" className="underline">
              গোপনীয়তা নোটিশ
            </Link>
            -এ সম্মতি দিচ্ছেন। আপনি একমত না হলে নিবন্ধন করবেন না বা
            প্ল্যাটফর্মটি ব্যবহার চালিয়ে যাবেন না।
          </p>
        </Section>

        <Section title="আমাদের পরিচয়">
          <p>
            স্টুডেন্ট স্কয়ার ফাউন্ডেশন সারা বাংলাদেশের তরুণদের সঙ্গে শিক্ষা,
            সুস্থতা ও নেতৃত্ব নিয়ে কাজ করে। এই প্ল্যাটফর্ম সদস্যদের ফাউন্ডেশনের
            কার্যক্রম, কাউন্সেলর, মেন্টর ও বিভিন্ন কনটেন্টের সঙ্গে যুক্ত করে।
          </p>
        </Section>

        <Section title="আপনার অ্যাকাউন্ট">
          <p>
            নিবন্ধনের সময় আপনাকে সঠিক তথ্য দিতে হবে এবং লগইনের তথ্য সুরক্ষিত
            রাখতে হবে। আপনার অ্যাকাউন্টে যা কিছু করা হয়, তার দায় আপনার। অন্য
            কেউ আপনার অ্যাকাউন্ট ব্যবহার করেছে বলে মনে হলে দ্রুত আমাদের জানান।
          </p>
          <p>
            বয়স, যোগ্যতা বা ফাউন্ডেশনের নীতির কারণে সদস্যপদ ও কার্যক্রমে
            অংশগ্রহণ সীমিত হতে পারে। কোনো অ্যাকাউন্ট এই শর্তাবলী ভঙ্গ করলে বা
            অন্যদের ঝুঁকিতে ফেললে আমরা তা স্থগিত বা বন্ধ করতে পারি।
          </p>
        </Section>

        <Section title="গ্রহণযোগ্য ব্যবহার">
          <p>
            প্ল্যাটফর্মটি আইন মেনে ও শ্রদ্ধার সঙ্গে ব্যবহার করুন। অন্যকে হয়রানি
            করবেন না, অন্যের ব্যক্তিগত তথ্য শেয়ার করবেন না, নিরাপত্তা ভাঙার
            চেষ্টা করবেন না, এবং স্প্যাম বা ক্ষতিকর কনটেন্ট পাঠাতে এই সেবা
            ব্যবহার করবেন না।
          </p>
        </Section>

        <Section title="সংবেদনশীল তথ্য — সম্মতি দেওয়ার আগে অবশ্যই পড়ুন">
          <p className="font-medium text-foreground">আমরা যেসব বিষয়ে জানতে চাইব:</p>
          <ul className="list-disc pl-5 space-y-0.5">
            {SENSITIVE_CONSENT_SUMMARY_BN.categories.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p>
            <span className="font-medium text-foreground">কেন: </span>
            {SENSITIVE_CONSENT_SUMMARY_BN.purpose}
          </p>
          <p>
            <span className="font-medium text-foreground">কারা দেখতে পারবেন: </span>
            {SENSITIVE_CONSENT_SUMMARY_BN.access}
          </p>
          <p>
            <span className="font-medium text-foreground">কতদিন রাখা হবে: </span>
            {SENSITIVE_CONSENT_SUMMARY_BN.retention}
          </p>
          <p>
            <span className="font-medium text-foreground">মত বদলালে: </span>
            {SENSITIVE_CONSENT_SUMMARY_BN.withdrawal}
          </p>
          <p className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-foreground">
            নিবন্ধনের সময় এই ব্যবহারের শর্তাবলী গ্রহণ করে আপনি ওপরে বর্ণিত
            উদ্দেশ্যে স্টুডেন্ট স্কয়ার ফাউন্ডেশনকে এই সংবেদনশীল তথ্য সংগ্রহ ও
            সংরক্ষণের সম্মতি দিচ্ছেন।
          </p>
        </Section>

        <Section title="কোনো চিকিৎসা বা মনস্তাত্ত্বিক রোগনির্ণয় নয়">
          <p>
            প্ল্যাটফর্মের কনটেন্ট, মূল্যায়ন ও দিকনির্দেশনা শিক্ষা ও সহায়তার
            উদ্দেশ্যে দেওয়া। এগুলো কোনো চিকিৎসা বা মনস্তাত্ত্বিক রোগনির্ণয় নয়,
            এবং প্রয়োজন হলে পেশাদার চিকিৎসাসেবার বিকল্পও নয়।
          </p>
        </Section>

        <Section title="পরিবর্তন">
          <p>
            আমরা সময়ে সময়ে এই শর্তাবলী হালনাগাদ করতে পারি। কোনো পরিবর্তন
            প্রকাশের পরও ব্যবহার চালিয়ে গেলে ধরে নেওয়া হবে যে আপনি হালনাগাদ
            শর্তাবলী মেনে নিয়েছেন। সংবেদনশীল তথ্য ব্যবহারের পদ্ধতিতে উল্লেখযোগ্য
            কোনো পরিবর্তন হলে তা{" "}
            <Link href="/privacy" className="underline">
              গোপনীয়তা নোটিশ
            </Link>
            -এও জানানো হবে।
          </p>
        </Section>

        <Section title="যোগাযোগ">
          <p>
            এই শর্তাবলী নিয়ে প্রশ্ন থাকলে আমাদের{" "}
            <Link href="/contact" className="underline">
              যোগাযোগ পেজ
            </Link>{" "}
            অথবা{" "}
            <Link href="/dashboard/feedback" className="underline">
              ফিডব্যাক ফর্ম
            </Link>
            -এর মাধ্যমে জানান।
          </p>
          <p className="text-xs text-muted-foreground">
            স্টুডেন্ট স্কয়ার ফাউন্ডেশন বাংলাদেশের সোসাইটিজ রেজিস্ট্রেশন অ্যাক্ট,
            ১৮৬০-এর অধীনে নিবন্ধিত।
          </p>
        </Section>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}
