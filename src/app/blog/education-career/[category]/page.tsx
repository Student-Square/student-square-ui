"use client";

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

  return <EducationCareerContent initialCategory={category} />;
}
