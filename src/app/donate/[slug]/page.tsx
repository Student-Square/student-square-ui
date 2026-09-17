"use client";

import { useParams } from "next/navigation";
import DonateExperience from "@/components/features/Donate/DonateExperience";

export default function DonateProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  return <DonateExperience slug={slug} />;
}
