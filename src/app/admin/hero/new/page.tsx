"use client";

import { useSearchParams } from "next/navigation";
import CardForm from "../CardForm";
import type { HeroSlot } from "@/types/content";

const VALID_SLOTS: HeroSlot[] = ["main_carousel", "secondary", "third", "blog_1", "blog_2"];

export default function AdminHeroNewPage() {
  const searchParams = useSearchParams();
  const slotParam = searchParams.get("slot");
  const initialSlot: HeroSlot | undefined =
    slotParam && VALID_SLOTS.includes(slotParam as HeroSlot)
      ? (slotParam as HeroSlot)
      : undefined;

  return <CardForm mode={{ kind: "create" }} initialSlot={initialSlot} />;
}
