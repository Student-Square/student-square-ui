import { Suspense } from "react";
import EducationCareerContent from "./_content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Education & Career Guidance",
  description:
    "Career advice, higher study, scholarships, competitions and self-development articles for students and parents in Bangladesh.",
  path: "/blog/education-career",
});

export default function EducationCareerPage() {
  // The content reads useSearchParams(); without a Suspense boundary
  // `next build` refuses to prerender the page.
  return (
    <Suspense fallback={null}>
      <EducationCareerContent initialCategory="all" />
    </Suspense>
  );
}
