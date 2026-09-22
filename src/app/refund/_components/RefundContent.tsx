"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/**
 * Return and Refund Policy. Written out in each language so either version
 * can be reviewed top to bottom. Change both together.
 */
export default function RefundContent() {
  const { lang } = useLanguage();
  return lang === "BN" ? <Bangla /> : <English />;
}

function English() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        Return and Refund Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        How Student Square Foundation handles refunds and delivery of support.
      </p>

      <div className="mt-10 space-y-10">
        <Section title="Refund timeline">
          <p>
            An approved refund is sent back within <strong>7 to 10 working days</strong> of
            the day we confirm the request. The time your bank or mobile wallet takes to
            show the credit can be a little longer than that.
          </p>
        </Section>

        <Section title="When a refund applies">
          <p>
            Online gifts are made through SSLCOMMERZ. Write to{" "}
            <a className="underline" href="mailto:studentsquarebd@gmail.com">
              studentsquarebd@gmail.com
            </a>{" "}
            with the transaction reference if a payment was taken twice, the amount was
            wrong, or we cannot deliver the support you gave for.
          </p>
          <p>
            A gift that has already been used for the stated programme — books issued,
            a food package handed over, a camp held, or a counselling session completed —
            is not refunded, except where we are required to return it.
          </p>
        </Section>

        <Section title="Who we are">
          <p>
            Student Square Foundation, 2nd Floor, Jalal Super Market, Thana Road,
            Godagari-6290, Rajshahi, Bangladesh. Management details are on our{" "}
            <Link href="/about/who-we-are" className="underline">
              About Us
            </Link>{" "}
            page. This policy sits alongside our{" "}
            <Link href="/terms" className="underline">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
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
        রিটার্ন ও রিফান্ড নীতি
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        স্টুডেন্ট স্কয়ার ফাউন্ডেশন কীভাবে রিফান্ড এবং সহায়তা পৌঁছে দেয়।
      </p>

      <div className="mt-10 space-y-10">
        <Section title="রিফান্ডের সময়">
          <p>
            অনুমোদিত রিফান্ড, অনুরোধ নিশ্চিত হওয়ার দিন থেকে{" "}
            <strong>৭ থেকে ১০ কর্মদিবসের</strong> মধ্যে ফেরত দেওয়া হয়। ব্যাংক বা মোবাইল
            ওয়ালেটে টাকা দেখাতে তার চেয়ে একটু বেশি সময় লাগতে পারে।
          </p>
        </Section>

        <Section title="কখন রিফান্ড হয়">
          <p>
            অনলাইন অনুদান SSLCOMMERZ-এর মাধ্যমে নেওয়া হয়। একই পেমেন্ট দুইবার কেটে
            গেলে, ভুল পরিমাণ কাটা হলে, অথবা যে সহায়তার জন্য দিয়েছেন সেটা আমরা দিতে না
            পারলে{" "}
            <a className="underline" href="mailto:studentsquarebd@gmail.com">
              studentsquarebd@gmail.com
            </a>
            -এ ট্রানজ্যাকশন রেফারেন্সসহ লিখুন।
          </p>
          <p>
            যে অনুদান ইতিমধ্যে ঘোষিত কাজে লেগে গেছে — বই তুলে দেওয়া, খাদ্য প্যাকেজ
            হস্তান্তর, ক্যাম্প আয়োজন, বা কাউন্সেলিং সেশন সম্পন্ন — সেটা ফেরত দেওয়া হয়
            না, যেখানে আইনত ফেরত দেওয়া বাধ্যতামূলক সেখানে ছাড়া।
          </p>
        </Section>

        <Section title="আমরা কারা">
          <p>
            স্টুডেন্ট স্কয়ার ফাউন্ডেশন, ২য় তলা, জালাল সুপার মার্কেট, থানা রোড,
            গোদাগাড়ী-৬২৯০, রাজশাহী, বাংলাদেশ। ব্যবস্থাপনার বিবরণ{" "}
            <Link href="/about/who-we-are" className="underline">
              আমাদের সম্পর্কে
            </Link>{" "}
            পাতায় আছে। এই নীতি আমাদের{" "}
            <Link href="/terms" className="underline">
              ব্যবহারের শর্তাবলী
            </Link>{" "}
            ও{" "}
            <Link href="/privacy" className="underline">
              গোপনীয়তা নীতি
            </Link>
            -এর সঙ্গে প্রযোজ্য।
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
  children: ReactNode;
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
