"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CardForm from "../CardForm";
import type { HeroSlot } from "@/types/content";

const VALID_SLOTS: HeroSlot[] = ["main_carousel", "secondary", "third", "blog_1", "blog_2"];

// useSearchParams() needs a Suspense boundary, or `next build` refuses to
// prerender the page.
export default function AdminHeroNewPage() {
  return (
    <Suspense fallback={null}>
      <AdminHeroNewContent />
    </Suspense>
  );
}

function AdminHeroNewContent() {
  const searchParams = useSearchParams();
  const slotParam = searchParams.get("slot");
  const initialSlot: HeroSlot | undefined =
    slotParam && VALID_SLOTS.includes(slotParam as HeroSlot)
      ? (slotParam as HeroSlot)
      : undefined;

  return <CardForm mode={{ kind: "create" }} initialSlot={initialSlot} />;
}
