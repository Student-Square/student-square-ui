/**
 * Hero feature cards — data model
 * ──────────────────────────────────────────────────────────────
 * Designed to be 1:1 with a future DB table (`hero_features`).
 * Each card is a single row. The rendering layer queries this
 * "table" by slot + status. Nothing in the component depends on
 * the data being a JS object literal vs. an API response.
 *
 *   Phase 1 (now)   → `featureCards` is a typed const in this file.
 *   Phase 2 (API)   → swap `getActiveCardsForSlot()` to `await fetch(...)`.
 *   Phase 3 (DB)    → one table; admin CRUD on top.
 *
 * Editorial rules:
 *   - Display copy (title, image, category) lives ON the card row,
 *     so marketing can write hero copy independently of the source article.
 *   - `content` is a polymorphic reference — used only to produce the
 *     click href. If a content route is ever renamed, change it in
 *     `resolveHref()` and every card moves with it.
 *   - Cards are never deleted when rotated out — they are archived.
 *     This gives the client a permanent history of past features.
 */

// ───────────────────────── Types ─────────────────────────

export type HeroSlot =
  | "main_carousel" // large rotating card on the left
  | "secondary"     // small card, top-right of main grid
  | "third"         // small card, bottom-right of main grid
  | "blog_1"        // bottom row, left
  | "blog_2"        // bottom row, right

export type CardStatus = "draft" | "published" | "archived"

/** Polymorphic content reference — points to existing entities */
export type ContentRef =
  | { type: "project"; slug: string }   // → /projects/[slug]
  | { type: "service"; slug: string }   // → /what-we-do/[slug]
  | { type: "blog"; id: number }        // → /blog/[id]
  | { type: "story"; id: number }       // → /blog/real-life-stories/[id]
  | { type: "external"; href: string }  // → arbitrary url (escape hatch)

/** A single row in the (future) hero_features table */
export interface FeatureCard {
  id: string
  slot: HeroSlot

  /** Where the click goes. URL is computed from this via resolveHref(). */
  content: ContentRef

  /** Display copy — denormalized on purpose. */
  title: string
  titleBn?: string
  category: string
  image: string

  /** Lifecycle */
  status: CardStatus
  publishedAt?: string  // ISO date — when this card went live
  archivedAt?: string   // ISO date — set when status becomes "archived"

  /** Sort order within a slot when multiple cards are active (used by main_carousel) */
  order: number
}

/** Shape consumed by the renderer — `content` resolved to a concrete href */
export interface ResolvedFeatureCard {
  id: string
  slot: HeroSlot
  title: string
  titleBn?: string
  category: string
  image: string
  href: string
}

// ───────────────────────── Resolver ─────────────────────────

/** Single source of truth for content URLs. Rename a route once, here. */
export function resolveHref(ref: ContentRef): string {
  switch (ref.type) {
    case "project":  return `/projects/${ref.slug}`
    case "service":  return `/what-we-do/${ref.slug}`
    case "blog":     return `/blog/${ref.id}`
    case "story":    return `/blog/real-life-stories/${ref.id}`
    case "external": return ref.href
  }
}

function resolve(card: FeatureCard): ResolvedFeatureCard {
  return {
    id: card.id,
    slot: card.slot,
    title: card.title,
    titleBn: card.titleBn,
    category: card.category,
    image: card.image,
    href: resolveHref(card.content),
  }
}

/**
 * Return active cards for a slot, ordered.
 * Replace the array source with an API call later — signature stays the same.
 */
export function getActiveCardsForSlot(slot: HeroSlot): ResolvedFeatureCard[] {
  return featureCards
    .filter((c) => c.slot === slot && c.status === "published")
    .sort((a, b) => a.order - b.order)
    .map(resolve)
}

// ───────────────────────── Data ─────────────────────────

export const featureCards: FeatureCard[] = [
  // ── Main carousel (rotates every 7s in the hero) ──
  {
    id: "feat-main-climate",
    slot: "main_carousel",
    content: { type: "project", slug: "counter-climate-change" },
    title: "Counter Climate Change Project",
    titleBn:
      "পরিবর্তিত পরিবেশে চরমভাবাপন্ন আবহাওয়ার উষ্ণতা কমাতে, পানির স্তর নেমে যাওয়া ঠেকাতে একলক্ষ তালগাছ রোপনের উদ্যোগ নেওয়া হয়েছে। ইতিমধ্যে ৫০০ তালগাছের চারা রোপন সম্পন্ন হয়েছে।",
    category: "Environment",
    image: "/images/tal-gach.jpg",
    status: "published",
    publishedAt: "2025-09-01",
    order: 1,
  },
  {
    id: "feat-main-eid",
    slot: "main_carousel",
    content: { type: "project", slug: "amar-vaiyer-eid" },
    title: "আমার ভাইয়ের ঈদ Project",
    titleBn:
      "প্রতি ঈদুল ফিতরে কিছু অসহায় অসচ্ছল পরিবারে ঈদের আনন্দ ভাগাভাগি করে নিতে গরুর মাংসসহ ঈদের খাদ্যসামগ্রী উপহার দেয়া হয়। এছাড়াও বিভিন্ন জরুরী পরিস্থিতিতে (বন্যা/কোভিড ১৯) ত্রাণ ও পুনর্বাসনে অংশগ্রহণ করা হয়।",
    category: "Community Relief",
    image: "/images/amar-vai-eid-project.jpg",
    status: "published",
    publishedAt: "2025-09-01",
    order: 2,
  },
  {
    id: "feat-main-health",
    slot: "main_carousel",
    content: { type: "project", slug: "healthcare-for-all" },
    title: "Healthcare for All",
    titleBn:
      "প্রান্তিক অঞ্চলের মানুষের নাগালের মধ্যে স্বাস্থ্যসেবা নিয়ে যেতে প্রতিবছর নির্দিষ্ট সময় পরপর হেলথ ক্যাম্প আয়োজন করা হয়। এক্ষেত্রে চরাঞ্চল ও বরেন্দ্র অঞ্চলকে বিশেষ গুরুত্ব প্রদান করা হয়।",
    category: "Health",
    image: "/images/medical-camp.jpg",
    status: "published",
    publishedAt: "2025-09-01",
    order: 3,
  },
  {
    id: "feat-main-journey",
    slot: "main_carousel",
    content: { type: "project", slug: "beyond-the-journey" },
    title: "Beyond the Journey",
    titleBn:
      "দেশের পাবলিক বিশ্ববিদ্যালয়গুলোর বিভিন্ন ডিপার্টমেন্টের ক্যারিয়ার–সংক্রান্ত সঠিক তথ্য, চলমান গবেষণা এবং সম্ভাব্য কর্মক্ষেত্রগুলো সংশ্লিষ্ট ফ্যাকাল্টি সদস্য, বিশেষজ্ঞ ও পেশাজীবীদের অভিজ্ঞতার আলোকে তুলে ধরা হয়।",
    category: "Career & Education",
    image: "/images/brain-battle-prize-ceremony.jpg",
    status: "published",
    publishedAt: "2025-09-01",
    order: 4,
  },

  // ── Static slots (one active card each) ──
  {
    id: "feat-secondary-journey",
    slot: "secondary",
    content: { type: "project", slug: "beyond-the-journey" },
    title: "Beyond The Journey Project",
    titleBn:
      "দেশের পাবলিক বিশ্ববিদ্যালয়গুলোর বিভিন্ন ডিপার্টমেন্টের ক্যারিয়ার–সংক্রান্ত সঠিক তথ্য, চলমান গবেষণা এবং সম্ভাব্য কর্মক্ষেত্রগুলো সংশ্লিষ্ট ফ্যাকাল্টি সদস্য, বিশেষজ্ঞ ও পেশাজীবীদের অভিজ্ঞতার আলোকে তুলে ধরা হয়।",
    category: "Career & Education",
    image: "/images/brain-battle-prize-ceremony.jpg",
    status: "published",
    publishedAt: "2025-09-01",
    order: 1,
  },
  {
    id: "feat-third-counselling",
    slot: "third",
    content: { type: "service", slug: "student-counselling" },
    title: "Counselling & Mental Health",
    titleBn: "শিক্ষার্থীদের মানসিক স্বাস্থ্য ও কাউন্সেলিং সেবা প্রদানে আমরা প্রতিশ্রুতিবদ্ধ।",
    category: "Wellbeing",
    image: "/images/medical-camp.jpg",
    status: "published",
    publishedAt: "2025-09-01",
    order: 1,
  },
  {
    id: "feat-blog1-stories",
    slot: "blog_1",
    content: { type: "external", href: "/blog/real-life-stories" },
    title: "Student Success Stories",
    titleBn: "শিক্ষার্থীদের সাফল্যের গল্প",
    category: "Stories",
    image: "/images/student-square-school-session.jpg",
    status: "published",
    publishedAt: "2025-09-01",
    order: 1,
  },
  {
    id: "feat-blog2-counselling",
    slot: "blog_2",
    content: { type: "service", slug: "student-counselling" },
    title: "Counselling & Workshop Programs",
    titleBn: "কাউন্সেলিং ও কর্মশালা কার্যক্রম",
    category: "Programs",
    image: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
    status: "published",
    publishedAt: "2025-09-01",
    order: 1,
  },

  // ──────────────────────────────────────────────────────────────
  // Example archived rows — kept for history (would normally come from DB).
  // To "re-feature" any of these in the future, set status to "published".
  // To feature a real-life story or blog post, add a new row with
  // content: { type: "story", id: 2 } or { type: "blog", id: 7 } etc.
  // ──────────────────────────────────────────────────────────────
  // {
  //   id: "feat-blog1-ahmed",
  //   slot: "blog_1",
  //   content: { type: "story", id: 2 },
  //   title: "How Ahmed's Training Saved Lives During the Floods",
  //   category: "Real Life Story",
  //   image: "/images/emergency-tran-bitoron-activities.jpg",
  //   status: "archived",
  //   publishedAt: "2025-06-01",
  //   archivedAt: "2025-08-30",
  //   order: 1,
  // },
]
