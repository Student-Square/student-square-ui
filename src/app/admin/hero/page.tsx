"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  useAdminListCardsQuery,
  useAdminDeleteCardMutation,
  useAdminUpdateCardMutation,
} from "@/redux/features/content/contentApi";
import type { AdminFeatureCard, CardStatus, HeroSlot } from "@/types/content";
import {
  Archive,
  CheckCircle2,
  ImageOff,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

// ── Slot metadata ─────────────────────────────────────────────────────────────

const SLOT_META: Array<{ slot: HeroSlot; label: string; desc: string }> = [
  { slot: "main_carousel", label: "Main (carousel)", desc: "Large left card — rotates through multiple published cards" },
  { slot: "secondary",     label: "Secondary",        desc: "Top-right card" },
  { slot: "third",         label: "Third",            desc: "Bottom-right card (under secondary)" },
  { slot: "blog_1",        label: "Blog 1",           desc: "Bottom row left — hidden on mobile" },
  { slot: "blog_2",        label: "Blog 2",           desc: "Bottom row right — hidden on mobile" },
];

// ── Helper ────────────────────────────────────────────────────────────────────

function statusStyle(status: CardStatus) {
  if (status === "PUBLISHED") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
  if (status === "DRAFT")     return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800";
  return "bg-muted text-muted-foreground border-border";
}

// ── Card row inside a slot section ────────────────────────────────────────────

function CardRow({
  card,
  onPublish,
  onArchive,
  onDelete,
}: {
  card: AdminFeatureCard;
  onPublish: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const isLive = card.status === "PUBLISHED";

  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
      isLive
        ? "bg-emerald-50/60 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/60"
        : "bg-card border-border hover:border-emerald-500/30"
    }`}>
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center">
        {card.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
        ) : (
          <ImageOff className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${statusStyle(card.status)}`}>
            {card.status === "PUBLISHED" ? "● Live" : card.status.toLowerCase()}
          </span>
          <span className="text-[10px] text-muted-foreground">order {card.order}</span>
        </div>
        <p className="text-sm font-semibold text-foreground truncate">{card.title}</p>
        <p className="text-[11px] text-muted-foreground truncate">
          {card.category} · {card.contentType.toLowerCase()}/{card.contentRef}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Link
          href={`/admin/hero/${card.id}`}
          title="Edit"
          className="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-muted text-muted-foreground hover:text-emerald-600 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Link>
        {isLive ? (
          <button
            type="button"
            onClick={onArchive}
            title="Archive (take offline)"
            className="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-muted text-muted-foreground hover:text-amber-600 transition-colors"
          >
            <Archive className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onPublish}
            title="Publish (make live)"
            className="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-muted text-muted-foreground hover:text-emerald-600 transition-colors"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          title="Delete"
          className="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-muted text-muted-foreground hover:text-red-600 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminHeroListPage() {
  const { data: cards = [], isLoading, isError } = useAdminListCardsQuery({});
  const [updateCard] = useAdminUpdateCardMutation();
  const [deleteCard] = useAdminDeleteCardMutation();
  const [expandedSlot, setExpandedSlot] = useState<HeroSlot | null>(null);

  const handlePublish = async (c: AdminFeatureCard) => {
    try {
      await updateCard({ id: c.id, data: { status: "PUBLISHED" } }).unwrap();
      toast.success(`"${c.title}" is now live`);
    } catch { /* baseApi toasts */ }
  };

  const handleArchive = async (c: AdminFeatureCard) => {
    try {
      await updateCard({ id: c.id, data: { status: "ARCHIVED" } }).unwrap();
      toast.success(`"${c.title}" archived`);
    } catch { /* baseApi toasts */ }
  };

  const handleDelete = async (c: AdminFeatureCard) => {
    if (!confirm(`Delete "${c.title}"? This cannot be undone.`)) return;
    try {
      await deleteCard(c.id).unwrap();
      toast.success(`"${c.title}" deleted`);
    } catch { /* baseApi toasts */ }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Hero Cards</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            5 slots on the homepage hero. Each slot shows the card marked <span className="font-semibold text-emerald-600">Live</span>.
          </p>
        </div>
        <Link
          href="/admin/hero/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New card
        </Link>
      </div>

      {/* Layout diagram */}
      <div className="mb-6 rounded-xl border border-border bg-card/60 p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Slot positions</p>
        <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold text-center">
          <div className="col-span-2 row-span-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3 text-emerald-700 dark:text-emerald-300">
            Main carousel<br /><span className="font-normal opacity-70">col-span-2 · rotates</span>
          </div>
          <div className="rounded-lg bg-muted/60 border border-border p-2 text-muted-foreground">Secondary</div>
          <div className="rounded-lg bg-muted/60 border border-border p-2 text-muted-foreground">Third</div>
          <div className="rounded-lg bg-muted/40 border border-dashed border-border p-2 text-muted-foreground/60">
            Blog 1<br /><span className="font-normal text-[10px]">hidden mobile</span>
          </div>
          <div className="rounded-lg bg-muted/40 border border-dashed border-border p-2 text-muted-foreground/60 col-span-2">
            Blog 2<br /><span className="font-normal text-[10px]">hidden mobile</span>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl border border-border bg-card/60 animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-red-600 py-6">Failed to load cards.</p>
      )}

      {/* Slot sections */}
      {!isLoading && !isError && (
        <div className="space-y-3">
          {SLOT_META.map(({ slot, label, desc }) => {
            const slotCards = cards.filter((c) => c.slot === slot);
            const liveCards = slotCards.filter((c) => c.status === "PUBLISHED");
            const otherCards = slotCards.filter((c) => c.status !== "PUBLISHED");
            const isOpen = expandedSlot === slot;

            return (
              <div key={slot} className="rounded-xl border border-border bg-card overflow-hidden">
                {/* Slot header */}
                <button
                  type="button"
                  onClick={() => setExpandedSlot(isOpen ? null : slot)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/40 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-foreground">{label}</span>
                      <span className="text-[11px] text-muted-foreground">{desc}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {liveCards.length > 0 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {liveCards.length} live
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                        empty
                      </span>
                    )}
                    {slotCards.length > 0 && (
                      <span className="text-[11px] text-muted-foreground">
                        {slotCards.length} card{slotCards.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    <Link
                      href={`/admin/hero/new?slot=${slot}`}
                      onClick={(e) => e.stopPropagation()}
                      title={`Add card to ${label}`}
                      className="inline-flex items-center justify-center w-6 h-6 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-muted-foreground hover:text-emerald-600 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Link>
                    <svg
                      className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded cards */}
                {isOpen && (
                  <div className="border-t border-border px-4 py-3 space-y-2">
                    {slotCards.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-xs text-muted-foreground">No cards yet.</p>
                        <Link
                          href={`/admin/hero/new?slot=${slot}`}
                          className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:underline"
                        >
                          <Plus className="h-3 w-3" /> Add one
                        </Link>
                      </div>
                    ) : (
                      <>
                        {/* Live cards first */}
                        {liveCards.map((c) => (
                          <CardRow
                            key={c.id}
                            card={c}
                            onPublish={() => handlePublish(c)}
                            onArchive={() => handleArchive(c)}
                            onDelete={() => handleDelete(c)}
                          />
                        ))}
                        {/* Draft / archived */}
                        {otherCards.length > 0 && (
                          <>
                            {liveCards.length > 0 && (
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pt-1">
                                Draft / archived
                              </p>
                            )}
                            {otherCards.map((c) => (
                              <CardRow
                                key={c.id}
                                card={c}
                                onPublish={() => handlePublish(c)}
                                onArchive={() => handleArchive(c)}
                                onDelete={() => handleDelete(c)}
                              />
                            ))}
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
