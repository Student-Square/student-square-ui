import type { Metadata } from "next";
import { serverGet } from "@/lib/serverApi";
import { serializeJsonLd } from "@/lib/jsonLd";
import type { ApiPublicUser } from "@/types/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://studentsquare.org";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

const CATEGORY_NAME: Record<string, string> = {
  BOARD: "Board of Trustees",
  ADVISORY: "Advisory Board",
  LEADERSHIP: "Leadership Team",
  MANAGEMENT: "Management Team",
};

const roleOf = (member: ApiPublicUser) => {
  const role = member.boardAssignments.find((a) => a.isActive) ?? member.boardAssignments[0];
  return role ? `${role.roleLabel}, ${CATEGORY_NAME[role.category] ?? role.category}` : null;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const member = await serverGet<ApiPublicUser>(`/content/users/${encodeURIComponent(slug)}`);
  if (!member) return {};

  const role = roleOf(member);
  const title = role ? `${member.fullName} — ${role}` : member.fullName;
  const description =
    member.profile?.bio?.slice(0, 160) ||
    `${member.fullName}${role ? `, ${role}` : ""} at Student Square Foundation, Rajshahi, Bangladesh.`;
  const url = `/about/who-we-are/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "profile" },
  };
}

export default async function MemberLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const member = await serverGet<ApiPublicUser>(`/content/users/${encodeURIComponent(slug)}`);
  const role = member ? roleOf(member) : null;

  const jsonLd = member && {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.fullName,
    ...(member.profile?.fullNameBn ? { alternateName: member.profile.fullNameBn } : {}),
    ...(role ? { jobTitle: role } : {}),
    ...(member.profile?.bio ? { description: member.profile.bio } : {}),
    url: `${siteUrl}/about/who-we-are/${slug}`,
    affiliation: {
      "@type": "NGO",
      "@id": `${siteUrl}/#organization`,
      name: "Student Square Foundation",
      url: siteUrl,
    },
  };

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      )}
      {children}
    </>
  );
}
