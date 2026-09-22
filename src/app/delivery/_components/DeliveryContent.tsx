"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/**
 * Delivery policy for a nonprofit. Gifts are confirmed at once. There is no
 * courier window. Change both languages together.
 */
export default function DeliveryContent() {
  const { lang } = useLanguage();
  return lang === "BN" ? <Bangla /> : <English />;
}

function English() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Delivery Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Student Square Foundation is a nonprofit. We do not sell or ship goods.
      </p>

      <div className="mt-10 space-y-10">
        <Section title="When a gift is confirmed">
          <p>
            A confirmed online donation is recorded at once. The receipt is issued{" "}
            <strong>immediately</strong>. The gift itself is not sent by courier, and there
            is no waiting period for it.
          </p>
        </Section>

        <Section title="Programme support">
          <p>
            Counselling, learning materials, food packages, and camps are arranged with
            the person or community they are for. The foundation hands these over itself.
            They are not shop orders.
          </p>
        </Section>

        <Section title="Who we are">
          <p>
            Student Square Foundation, 2nd Floor, Jalal Super Market, Thana Road,
            Godagari-6290, Rajshahi, Bangladesh. This policy sits alongside our{" "}
            <Link href="/refund" className="underline">
              Return and Refund Policy
            </Link>
            ,{" "}
            <Link href="/terms" className="underline">
              Terms of Use
            </Link>
            , and{" "}
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
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">ডেলিভারি নীতি</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        স্টুডেন্ট স্কয়ার ফাউন্ডেশন একটি অলাভজনক প্রতিষ্ঠান। আমরা পণ্য বিক্রি বা কুরিয়ারে
        পাঠাই না।
      </p>

      <div className="mt-10 space-y-10">
        <Section title="অনুদান নিশ্চিত হলে">
          <p>
            নিশ্চিত অনলাইন অনুদান সাথে সাথে নথিভুক্ত হয়। রসিদ{" "}
            <strong>তৎক্ষণাৎ</strong> ইস্যু করা হয়। অনুদান কুরিয়ারে যায় না, এবং এর জন্য
            কোনো অপেক্ষার সময় নেই।
          </p>
        </Section>

        <Section title="কার্যক্রমের সহায়তা">
          <p>
            কাউন্সেলিং, শিক্ষা উপকরণ, খাদ্য প্যাকেজ ও ক্যাম্প যার জন্য, সেই ব্যক্তি বা
            কমিউনিটির সঙ্গে আয়োজন করা হয়। ফাউন্ডেশন নিজে এগুলো হস্তান্তর করে। এগুলো
            দোকানের অর্ডার নয়।
          </p>
        </Section>

        <Section title="আমরা কারা">
          <p>
            স্টুডেন্ট স্কয়ার ফাউন্ডেশন, ২য় তলা, জালাল সুপার মার্কেট, থানা রোড,
            গোদাগাড়ী-৬২৯০, রাজশাহী, বাংলাদেশ। এই নীতি আমাদের{" "}
            <Link href="/refund" className="underline">
              রিটার্ন ও রিফান্ড নীতি
            </Link>
            ,{" "}
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
