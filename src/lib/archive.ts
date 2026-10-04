export type ArchiveItem = {
  id: string;
  year: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
};

export const ARCHIVE_PAGE_SLUG = "about-archive";
export const ARCHIVE_SECTION_KEY = "items";

export function parseArchiveItems(content: unknown): ArchiveItem[] {
  if (!content || typeof content !== "object") return [];
  const items = (content as { items?: unknown }).items;
  if (!Array.isArray(items)) return [];
  return items.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const row = raw as Record<string, unknown>;
    const title = typeof row.title === "string" ? row.title.trim() : "";
    if (!title) return [];
    return [
      {
        id: typeof row.id === "string" && row.id ? row.id : title,
        year: typeof row.year === "string" ? row.year.trim() : "",
        title,
        titleBn: typeof row.titleBn === "string" ? row.titleBn : "",
        description: typeof row.description === "string" ? row.description : "",
        descriptionBn: typeof row.descriptionBn === "string" ? row.descriptionBn : "",
      },
    ];
  });
}
