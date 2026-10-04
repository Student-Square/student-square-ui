import type { Metadata } from "next";
import { serverGet } from "@/lib/serverApi";
import { serializeJsonLd } from "@/lib/jsonLd";
import type { ApiBoardAssignment, ApiBoardGroups } from "@/types/content";
import WhoWeAreView from "./WhoWeAreView";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://studentsquare.org";

// Rendered per request so crawlers always get the current team in the HTML;
// serverGet still caches the API response for five minutes.
export const dynamic = "force-dynamic";

const description =
  "Meet the Board of Trustees, Advisory Board, Leadership Team, and Management Team of Student Square Foundation, a registered nonprofit in Godagari, Rajshahi, Bangladesh.";

export const metadata: Metadata = {
  title: "Who We Are — Board, Advisors and Team",
  description,
  alternates: { canonical: "/about/who-we-are" },
  openGraph: {
    title: "Who We Are — Student Square Foundation",
    description,
    url: "/about/who-we-are",
    type: "website",
  },
};

const GROUP_NAME: Record<keyof ApiBoardGroups, string> = {
  board: "Board of Trustees",
  advisory: "Advisory Board",
  leadership: "Leadership Team",
  management: "Management Team",
};

const person = (m: ApiBoardAssignment, group: string) => ({
  "@type": "Person",
  name: m.fullName,
  ...(m.fullNameBn ? { alternateName: m.fullNameBn } : {}),
  jobTitle: `${m.roleLabel}, ${group}`,
  url: `${siteUrl}/about/who-we-are/${m.slug}`,
  affiliation: { "@id": `${siteUrl}/#organization` },
});

function teamJsonLd(groups: ApiBoardGroups) {
  const members = (Object.keys(GROUP_NAME) as (keyof ApiBoardGroups)[]).flatMap((key) =>
    groups[key].map((m) => person(m, GROUP_NAME[key]))
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["NGO", "EducationalOrganization"],
        "@id": `${siteUrl}/#organization`,
        name: "Student Square Foundation",
        alternateName: "Student Square",
        url: siteUrl,
        email: "studentsquarebd@gmail.com",
        telephone: "+8801784655856",
        address: {
          "@type": "PostalAddress",
          streetAddress: "2nd Floor, Jalal Super Market, Thana Road",
          addressLocality: "Godagari",
          addressRegion: "Rajshahi",
          postalCode: "6290",
          addressCountry: "BD",
        },
        member: members,
      },
      {
        "@type": "AboutPage",
        "@id": `${siteUrl}/about/who-we-are`,
        url: `${siteUrl}/about/who-we-are`,
        name: "Who We Are",
        description,
        about: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };
}

export default async function WhoWeArePage() {
  const groups = await serverGet<ApiBoardGroups>("/content/board/groups");

  return (
    <>
      {groups && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(teamJsonLd(groups)) }}
        />
      )}
      <WhoWeAreView initialGroups={groups} />
    </>
  );
}
