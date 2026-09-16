import { Suspense } from "react";
import EducationCareerContent from "./_content";

export default function EducationCareerPage() {
  // The content reads useSearchParams(); without a Suspense boundary
  // `next build` refuses to prerender the page.
  return (
    <Suspense fallback={null}>
      <EducationCareerContent initialCategory="all" />
    </Suspense>
  );
}
