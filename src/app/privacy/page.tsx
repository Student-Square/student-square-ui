import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Notice | Student Square",
  description:
    "What Student Square collects, why, who can see it, and how long we keep it.",
};

/**
 * The Privacy Notice registration links to.
 *
 * FR-11-004 requires that Super Admin visibility of member–counsellor messages
 * is disclosed *here* as well as on the Messages screen. That section is a
 * requirement, not boilerplate — do not trim it without checking the SRS.
 */
export default function PrivacyPage() {
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
            disability status, health answers and psychological answers. We ask
            for your explicit, separate consent before collecting any of it, and
            you can decline any individual question.
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
