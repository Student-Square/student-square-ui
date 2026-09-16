"use client"

import { ChevronRight } from "lucide-react"
import { useGetPageSectionsQuery } from "@/redux/features/content/contentApi"
import { useLanguage } from "@/components/i18n/LanguageProvider"

export type ImpactStat = { value: string; label: string; detail?: string }

/**
 * The foundation's real impact figures, seeded as the `impact-stats` section of
 * the home page. Any page that wants to show numbers reads them from here so
 * there is one set to keep up to date.
 */
export function useImpactStats(): ImpactStat[] {
  const { data } = useGetPageSectionsQuery("home")
  const { tr, digits } = useLanguage()
  const content = data?.find((s) => s.sectionKey === "impact-stats")?.content as
    | { items?: ImpactStat[] }
    | undefined
  // Returned already in the visitor's language, so every page that shows the
  // figures gets Bangla labels and digits without doing it itself.
  return (content?.items ?? []).map((item) => ({
    value: digits(item.value),
    label: tr(item.label),
    detail: item.detail ? tr(item.detail) : undefined,
  }))
}

/**
 * The bordered figures strip used on the location and partner pages. These are
 * organisation-wide totals, not per-city or per-partner — the foundation does
 * not publish a breakdown, and splitting a national figure across districts
 * would be inventing one.
 */
export default function ImpactStats({ className = "" }: { className?: string }) {
  const stats = useImpactStats()
  if (stats.length === 0) return null

  return (
    <div className={`grid grid-cols-2 gap-4 border-t border-b border-border py-8 sm:grid-cols-4 ${className}`}>
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
          <div className="flex items-start gap-1 mt-1">
            <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground leading-tight">
              {stat.label}
              {stat.detail && (
                <span className="block text-muted-foreground/70">{stat.detail}</span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
