"use client";

import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/**
 * The Privacy Notice body in the reader's language. Each language is written
 * out as a whole document rather than assembled from dictionary keys, so either
 * version can be reviewed top to bottom. Change both together.
 *
 * FR-11-004 requires that Super Admin visibility of member–counsellor messages
 * is disclosed *here* as well as on the Messages screen. That section is a
 * requirement, not boilerplate — do not trim it, in either language, without
 * checking the SRS.
 */
export default function PrivacyContent() {
  const { lang } = useLanguage();
  return lang === "BN" ? <Bangla /> : <English />;
}

function English() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        Privacy Notice
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        How Student Square Foundation handles your information.
      </p>

      <div className="mt-10 space-y-10">
        <Section title="What we collect">
          <p>
            When you register we collect your name, email address, phone number,
            address, and answers to the registration questionnaire — your age
            band, gender, home district, education, occupation and family
            context. Completing an assessment adds your answers in five
            categories, and any aptitude test results.
          </p>
          <p>
            Some of this is <strong>sensitive personal information</strong>:
            disability status, health answers and psychological answers. Details
            of what we ask, why, who can see it, and how long we keep it are in
            the{" "}
            <Link href="/terms" className="underline">
              Terms of Use
            </Link>
            . You can decline any individual question.
          </p>
        </Section>

        <Section title="Why we collect it">
          <p>
            To match you with a counsellor and mentor, to let them understand
            your situation before advising you, and to build a career roadmap
            with you. Aggregate, de-identified figures help the Foundation
            report on its work; those figures never identify an individual, and
            we suppress any group small enough to make someone identifiable.
          </p>
          <p>
            We do not sell your data. We do not share it with advertisers. We do
            not use it to train automated decision systems: no algorithm scores,
            ranks or diagnoses you, and no psychological interpretation is
            produced automatically.
          </p>
        </Section>

        <Section title="Who can see it">
          <p>
            Your assigned counsellor and mentor can see your assessment answers
            (except health and psychological responses, which stay encrypted and
            are not displayed), your SWOT, your roadmap and your sessions. Staff
            who are <em>not</em> assigned to you cannot: access follows the
            assignment, and it ends the moment the assignment does.
          </p>
          <p>
            Every time a staff member opens your record, that access is written
            to an audit log with their identity and the time.
          </p>
        </Section>

        <Section title="Messages between you and your care team">
          <p>
            Messages you exchange with your counsellor or mentor are encrypted
            when stored and are private between the two of you.
          </p>
          <p className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 p-4">
            <strong>One exception, which we want you to know about upfront:</strong>{" "}
            a Super Admin of the Foundation can read these conversations where
            there is a safeguarding concern — for example a risk to your safety
            or someone else&apos;s. This is oversight only: they cannot post in
            your conversation, and every such access is recorded in the audit
            log. The same notice appears on your Messages screen.
          </p>
          <p>
            Your private notes box is different. Nobody but you can read it —
            not your counsellor, not your mentor, not a Super Admin.
          </p>
        </Section>

        <Section title="Email you receive from us">
          <p>
            Newsletters and announcements carry a one-click unsubscribe link,
            and using it stops all non-essential email to your address
            permanently. You can also choose what reaches you, per type and per
            channel, in your{" "}
            <Link href="/dashboard/settings" className="underline">
              notification settings
            </Link>
            .
          </p>
          <p>
            Some messages cannot be switched off: receipts, security alerts, and
            notices about your counselling or mentoring. These are part of your
            account record rather than marketing.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            We keep your account and care records for as long as your account is
            active, and for a defined retention period afterwards so that a
            counselling history is not lost the moment someone logs out for the
            last time. Records that are no longer needed are deleted on a
            scheduled sweep rather than left indefinitely.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            You can export everything we hold about you as a file, at any time,
            from your dashboard. You can ask us to correct anything that is
            wrong, and you can ask us to erase your data — we will tell you what
            we are legally required to retain and for how long.
          </p>
          <p>
            You can withdraw a consent you gave at registration. Withdrawing
            consent for sensitive data means we stop using those answers;
            withdrawing consent to the privacy notice itself is treated as an
            account-deletion request.
          </p>
        </Section>

        <Section title="Security">
          <p>
            Sensitive fields — your phone number, address, disability status,
            guardian contact, health and psychological answers, message bodies
            and meeting links — are encrypted before they are written to the
            database, so a copy of the database on its own does not reveal them.
            Staff accounts require multi-factor authentication.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about any of this, or about a request you have made:
            reach us through the{" "}
            <Link href="/dashboard/feedback" className="underline">
              feedback form
            </Link>{" "}
            or the contact details on our{" "}
            <Link href="/" className="underline">
              website
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
        গোপনীয়তা নোটিশ
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        স্টুডেন্ট স্কয়ার ফাউন্ডেশন আপনার তথ্য কীভাবে ব্যবহার ও সংরক্ষণ করে।
      </p>

      <div className="mt-10 space-y-10">
        <Section title="আমরা কী তথ্য সংগ্রহ করি">
          <p>
            নিবন্ধনের সময় আমরা আপনার নাম, ইমেইল ঠিকানা, ফোন নম্বর, ঠিকানা এবং
            নিবন্ধন প্রশ্নাবলির উত্তর সংগ্রহ করি — আপনার বয়সসীমা, লিঙ্গ, নিজ
            জেলা, শিক্ষা, পেশা ও পারিবারিক প্রেক্ষাপট। কোনো মূল্যায়ন সম্পন্ন করলে
            পাঁচটি বিভাগে আপনার উত্তর এবং অ্যাপটিটিউড টেস্টের ফলাফলও যুক্ত হয়।
          </p>
          <p>
            এর কিছু তথ্য <strong>সংবেদনশীল ব্যক্তিগত তথ্য</strong>: প্রতিবন্ধিতার
            অবস্থা, স্বাস্থ্য সংক্রান্ত উত্তর এবং মনস্তাত্ত্বিক উত্তর। আমরা কী
            জানতে চাই, কেন চাই, কারা দেখতে পারেন এবং কতদিন রাখি — তার বিস্তারিত
            রয়েছে{" "}
            <Link href="/terms" className="underline">
              ব্যবহারের শর্তাবলী
            </Link>
            -তে। যেকোনো একটি প্রশ্নের উত্তর দিতে আপনি অস্বীকার করতে পারেন।
          </p>
        </Section>

        <Section title="কেন সংগ্রহ করি">
          <p>
            আপনাকে একজন কাউন্সেলর ও মেন্টরের সঙ্গে যুক্ত করতে, পরামর্শ দেওয়ার
            আগে তাঁরা যেন আপনার পরিস্থিতি বুঝতে পারেন, এবং আপনার সঙ্গে মিলে একটি
            ক্যারিয়ার রোডম্যাপ তৈরি করতে। সমষ্টিগত ও পরিচয়-মুক্ত পরিসংখ্যান
            ফাউন্ডেশনকে তার কাজের প্রতিবেদন তৈরিতে সাহায্য করে; এসব পরিসংখ্যান
            কখনো কোনো ব্যক্তিকে শনাক্ত করে না, এবং কোনো দল এত ছোট হলে যে তা থেকে
            কাউকে চেনা যেতে পারে, সেই দলের তথ্য আমরা প্রকাশ করি না।
          </p>
          <p>
            আমরা আপনার তথ্য বিক্রি করি না। বিজ্ঞাপনদাতাদের সঙ্গে শেয়ার করি না।
            স্বয়ংক্রিয় সিদ্ধান্ত গ্রহণ ব্যবস্থা প্রশিক্ষণে এটি ব্যবহার করি না:
            কোনো অ্যালগরিদম আপনাকে নম্বর দেয় না, ক্রম নির্ধারণ করে না বা
            রোগনির্ণয় করে না, এবং কোনো মনস্তাত্ত্বিক ব্যাখ্যা স্বয়ংক্রিয়ভাবে তৈরি
            হয় না।
          </p>
        </Section>

        <Section title="কারা দেখতে পারেন">
          <p>
            আপনার জন্য নির্ধারিত কাউন্সেলর ও মেন্টর আপনার মূল্যায়নের উত্তর
            (স্বাস্থ্য ও মনস্তাত্ত্বিক উত্তর বাদে, যেগুলো এনক্রিপ্ট করা থাকে এবং
            দেখানো হয় না), আপনার SWOT, রোডম্যাপ ও সেশনগুলো দেখতে পারেন। আপনার
            জন্য নির্ধারিত <em>নন</em> এমন স্টাফরা দেখতে পারেন না: অ্যাক্সেস
            নির্ভর করে দায়িত্ব বণ্টনের ওপর, এবং দায়িত্ব শেষ হওয়ার সঙ্গে সঙ্গেই
            অ্যাক্সেসও শেষ হয়।
          </p>
          <p>
            কোনো স্টাফ সদস্য যতবার আপনার রেকর্ড খোলেন, ততবার তাঁর পরিচয় ও সময়সহ
            সেই অ্যাক্সেস একটি অডিট লগে লিখে রাখা হয়।
          </p>
        </Section>

        <Section title="আপনার ও কেয়ার টিমের মধ্যকার বার্তা">
          <p>
            কাউন্সেলর বা মেন্টরের সঙ্গে আপনার আদান-প্রদান করা বার্তা এনক্রিপ্ট
            করে সংরক্ষণ করা হয় এবং তা শুধু আপনাদের দুজনের মধ্যেই থাকে।
          </p>
          <p className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 p-4">
            <strong>একটি ব্যতিক্রম, যা আমরা শুরুতেই আপনাকে জানাতে চাই:</strong>{" "}
            সুরক্ষা সংক্রান্ত উদ্বেগ থাকলে — যেমন আপনার বা অন্য কারও নিরাপত্তা
            ঝুঁকিতে থাকলে — ফাউন্ডেশনের একজন সুপার অ্যাডমিন এসব কথোপকথন পড়তে
            পারেন। এটি শুধুই তদারকি: তাঁরা আপনার কথোপকথনে কিছু লিখতে পারেন না,
            এবং এমন প্রতিটি অ্যাক্সেস অডিট লগে রেকর্ড করা হয়। একই নোটিশ আপনার
            মেসেজ স্ক্রিনেও দেখানো হয়।
          </p>
          <p>
            আপনার ব্যক্তিগত নোট বক্স আলাদা। আপনি ছাড়া আর কেউ তা পড়তে পারেন না —
            আপনার কাউন্সেলর না, মেন্টর না, সুপার অ্যাডমিনও না।
          </p>
        </Section>

        <Section title="আমাদের কাছ থেকে যেসব ইমেইল পান">
          <p>
            নিউজলেটার ও ঘোষণায় এক ক্লিকে আনসাবস্ক্রাইব করার লিংক থাকে, এবং তা
            ব্যবহার করলে আপনার ঠিকানায় সব অপ্রয়োজনীয় ইমেইল স্থায়ীভাবে বন্ধ হয়ে
            যায়। কোন ধরনের বার্তা কোন মাধ্যমে পাবেন, তা আপনি আপনার{" "}
            <Link href="/dashboard/settings" className="underline">
              নোটিফিকেশন সেটিংস
            </Link>{" "}
            থেকেও বেছে নিতে পারেন।
          </p>
          <p>
            কিছু বার্তা বন্ধ করা যায় না: রসিদ, নিরাপত্তা সতর্কতা এবং আপনার
            কাউন্সেলিং বা মেন্টরিং সংক্রান্ত নোটিশ। এগুলো বিপণন নয়, আপনার
            অ্যাকাউন্ট রেকর্ডের অংশ।
          </p>
        </Section>

        <Section title="কতদিন রাখি">
          <p>
            আপনার অ্যাকাউন্ট সক্রিয় থাকা পর্যন্ত এবং তার পরে একটি নির্ধারিত
            সংরক্ষণকাল পর্যন্ত আমরা আপনার অ্যাকাউন্ট ও কেয়ার রেকর্ড রাখি, যাতে
            কেউ শেষবারের মতো লগ আউট করলেই কাউন্সেলিংয়ের ইতিহাস হারিয়ে না যায়। যে
            রেকর্ডের আর প্রয়োজন নেই, তা অনির্দিষ্টকাল ফেলে না রেখে নির্ধারিত
            সময়ের নিয়মিত পরিষ্কার-প্রক্রিয়ায় মুছে ফেলা হয়।
          </p>
        </Section>

        <Section title="আপনার অধিকার">
          <p>
            আমাদের কাছে আপনার যত তথ্য আছে, তা যেকোনো সময় আপনার ড্যাশবোর্ড থেকে
            ফাইল হিসেবে এক্সপোর্ট করতে পারেন। কোনো তথ্য ভুল থাকলে তা সংশোধন করতে
            বলতে পারেন, এবং আপনার তথ্য মুছে ফেলার অনুরোধ করতে পারেন — আইন
            অনুযায়ী আমাদের কী রাখতে হবে এবং কতদিন, তা আমরা আপনাকে জানাব।
          </p>
          <p>
            নিবন্ধনের সময় দেওয়া কোনো সম্মতি আপনি প্রত্যাহার করতে পারেন।
            সংবেদনশীল তথ্যের সম্মতি প্রত্যাহার করলে আমরা সেই উত্তরগুলো ব্যবহার
            বন্ধ করি; আর গোপনীয়তা নোটিশের সম্মতি প্রত্যাহার করাকে অ্যাকাউন্ট মুছে
            ফেলার অনুরোধ হিসেবে গণ্য করা হয়।
          </p>
        </Section>

        <Section title="নিরাপত্তা">
          <p>
            সংবেদনশীল তথ্য — আপনার ফোন নম্বর, ঠিকানা, প্রতিবন্ধিতার অবস্থা,
            অভিভাবকের যোগাযোগ, স্বাস্থ্য ও মনস্তাত্ত্বিক উত্তর, বার্তার বিষয়বস্তু
            এবং মিটিং লিংক — ডাটাবেসে লেখার আগেই এনক্রিপ্ট করা হয়, তাই শুধু
            ডাটাবেসের একটি কপি হাতে পেলেও এগুলো জানা যায় না। স্টাফ অ্যাকাউন্টে
            মাল্টি-ফ্যাক্টর অথেনটিকেশন বাধ্যতামূলক।
          </p>
        </Section>

        <Section title="যোগাযোগ">
          <p>
            এসব বিষয়ে বা আপনার করা কোনো অনুরোধ নিয়ে প্রশ্ন থাকলে{" "}
            <Link href="/dashboard/feedback" className="underline">
              ফিডব্যাক ফর্ম
            </Link>{" "}
            অথবা আমাদের{" "}
            <Link href="/" className="underline">
              ওয়েবসাইটে
            </Link>{" "}
            দেওয়া যোগাযোগের ঠিকানায় যোগাযোগ করুন।
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
