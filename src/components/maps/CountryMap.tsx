"use client";

import { useRouter } from "next/navigation";
import DynamicMap, { type RegionConfig } from "./DynamicMap";

type ActiveRegion = {
  /** Name as it appears in the GeoJSON property */
  geoName: string;
  /** City slug for router navigation */
  citySlug: string;
  color: string;
  label: string;
};

type CountryConfig = {
  geoUrl: string;
  center: [number, number];
  scale: number;
  svgHeight?: number;
  nameProperty: string;
  title: string;
  attribution: string;
  activeRegions: ActiveRegion[];
};

const CONFIGS: Record<string, CountryConfig> = {
  bangladesh: {
    geoUrl: "/geo/bangladesh.geojson",
    center: [90.35, 23.685],
    scale: 3200,
    nameProperty: "NAME_2",
    title: "Bangladesh Map",
    attribution: "Map data: © Arc Bangladesh Ltd. · GADM",
    activeRegions: [
      { geoName: "Rajshahi",   citySlug: "rajshahi",        color: "#E67E22", label: "Rajshahi" },
      { geoName: "Joypurhat",  citySlug: "joypurhat",       color: "#3498DB", label: "Joypurhat" },
      { geoName: "Nawabganj",  citySlug: "chapainawabganj", color: "#F4D03F", label: "Chapai" },
      { geoName: "Kushtia",    citySlug: "kushtia",         color: "#E74C3C", label: "Kushtia" },
      { geoName: "Khulna",     citySlug: "khulna",          color: "#76D7C4", label: "Khulna" },
      { geoName: "Chittagong", citySlug: "chittagong",      color: "#8E44AD", label: "Chittagong" },
      { geoName: "Feni",       citySlug: "feni",            color: "#1ABC9C", label: "Feni" },
    ],
  },
  uk: {
    geoUrl: "/geo/uk.geojson",
    center: [-1.3, 51.05],
    scale: 12000,
    nameProperty: "LAD13NM",
    title: "UK Map",
    attribution: "Map data: © Crown copyright and database right 2013 · ONS Open Geography",
    // All 13 districts that make up Hampshire county
    activeRegions: [
      "Basingstoke and Deane","East Hampshire","Eastleigh","Fareham",
      "Gosport","Hart","Havant","New Forest","Rushmoor",
      "Test Valley","Winchester","Southampton","Portsmouth",
    ].map((name) => ({
      geoName: name,
      citySlug: "hampshire",
      color: "#2ECC71",
      label: "Hampshire",
    })),
  },
};

type Props = {
  country: string;
  /** Override active regions (from API / dynamic data) */
  activeRegionOverride?: string[];
};

export default function CountryMap({ country, activeRegionOverride }: Props) {
  const router = useRouter();
  const config = CONFIGS[country];

  if (!config) {
    return (
      <div className="w-full bg-muted flex items-center justify-center text-muted-foreground text-sm" style={{ minHeight: 380 }}>
        Map not available for this country yet
      </div>
    );
  }

  // If caller passes an override list, highlight only those names
  const activeRegions: RegionConfig[] = activeRegionOverride
    ? config.activeRegions
        .filter((r) => activeRegionOverride.includes(r.geoName))
        .map((r) => ({
          name: r.geoName,
          color: r.color,
          label: r.label,
          onClick: () => router.push(`/about/where-we-work/${country}/${r.citySlug}`),
        }))
    : config.activeRegions.map((r) => ({
        name: r.geoName,
        color: r.color,
        label: r.label,
        onClick: () => router.push(`/about/where-we-work/${country}/${r.citySlug}`),
      }));

  // Deduplicate legend entries by citySlug
  const legendItems = Array.from(
    new Map(
      config.activeRegions.map((r) => [
        r.citySlug,
        { label: r.label, color: r.color, citySlug: r.citySlug },
      ])
    ).values()
  );

  return (
    <div className="w-full bg-background">
      <DynamicMap
        geoUrl={config.geoUrl}
        center={config.center}
        scale={config.scale}
        nameProperty={config.nameProperty}
        regions={activeRegions}
        svgHeight={config.svgHeight ?? 340}
      />

      {/* Legend */}
      <div className="px-4 pb-3 pt-1">
        <div className="flex flex-wrap gap-3">
          {legendItems.map((item) => (
            <button
              key={item.citySlug}
              onClick={() => router.push(`/about/where-we-work/${country}/${item.citySlug}`)}
              className="flex items-center gap-1.5 text-xs text-foreground hover:text-emerald-600 transition-colors"
            >
              <span
                className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
                style={{ background: item.color }}
              />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
