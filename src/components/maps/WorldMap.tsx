"use client";

import { useRouter } from "next/navigation";
import DynamicMap from "./DynamicMap";

type CountryEntry = { geoName: string; label: string; slug: string };

const ACTIVE_COUNTRIES: CountryEntry[] = [
  { geoName: "Bangladesh", label: "Bangladesh",    slug: "bangladesh" },
  { geoName: "England",    label: "United Kingdom", slug: "uk" },
];

const HIGHLIGHT_COLOR = "#2bbfa4";

export default function WorldMap() {
  const router = useRouter();

  const regions = ACTIVE_COUNTRIES.map(({ geoName, slug }) => ({
    name: geoName,
    color: HIGHLIGHT_COLOR,
    onClick: () => router.push(`/about/where-we-work/${slug}`),
  }));

  return (
    <div className="w-full" style={{ background: "#cde8f0" }}>
      <DynamicMap
        geoUrl="/geo/world.geojson"
        center={[20, 10]}
        scale={147}
        nameProperty="name"
        regions={regions}
        svgWidth={800}
        svgHeight={360}
      />

      {/* Country legend */}
      <div className="px-4 pb-3 flex items-center gap-5 flex-wrap text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: HIGHLIGHT_COLOR }} />
          <span>Student Square presence</span>
        </div>
        {ACTIVE_COUNTRIES.map(({ label, slug }) => (
          <button
            key={slug}
            onClick={() => router.push(`/about/where-we-work/${slug}`)}
            className="hover:text-emerald-600 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
