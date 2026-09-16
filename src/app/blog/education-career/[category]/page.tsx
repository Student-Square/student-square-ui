"use client";

import { Suspense } from "react";
import { useParams, notFound } from "next/navigation";
import EducationCareerContent, { SUB_CATEGORIES } from "../_content";

const VALID_SLUGS = new Set(
  SUB_CATEGORIES.map((c) => c.slug).filter((s) => s !== "all")
);

export default function EducationCareerSubCategoryPage() {
  const { category } = useParams<{ category: string }>();

  if (!VALID_SLUGS.has(category)) {
    notFound();
  }

  // The content reads useSearchParams(), which needs a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <EducationCareerContent initialCategory={category} />
    </Suspense>
  );
}
