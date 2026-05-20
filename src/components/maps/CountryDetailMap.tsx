'use client';

import { useRouter } from "next/navigation";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import type { CountryMapConfig } from "@/data/mapConfig";

type Props = {
  countrySlug: string;
  config: CountryMapConfig;
};

function normalise(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export default function CountryDetailMap({ countrySlug, config }: Props) {
  const router = useRouter();

  /** Build a fast lookup: normalised alias → highlight */
  const aliasMap = new Map<string, (typeof config.highlights)[number]>();
  for (const h of config.highlights) {
    for (const alias of h.aliases) {
      aliasMap.set(normalise(alias), h);
    }
  }

  function getHighlight(geo: { properties: Record<string, string> }) {
    const raw = geo.properties[config.nameProperty] ?? "";
    return aliasMap.get(normalise(raw)) ?? null;
  }

  return (
    <div className="w-full bg-white">
      {/* Title */}
      <p className="px-4 pt-4 text-sm font-semibold text-foreground uppercase tracking-widest">
        {config.title}
      </p>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: config.center, scale: config.scale }}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <Geographies geography={config.geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const highlight = getHighlight(geo);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => {
                    if (highlight) {
                      router.push(`/about/where-we-work/${countrySlug}/${highlight.citySlug}`);
                    }
                  }}
                  style={{
                    default: {
                      fill: highlight ? highlight.color : "#E8E8E8",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.6,
                      outline: "none",
                      cursor: highlight ? "pointer" : "default",
                    },
                    hover: {
                      fill: highlight ? highlight.color : "#D8D8D8",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.6,
                      outline: "none",
                      filter: highlight ? "brightness(0.88)" : "none",
                      cursor: highlight ? "pointer" : "default",
                    },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Legend */}
      <div className="px-4 pb-3 space-y-1">
        <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
          <span>DIST_NAME</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {config.highlights.map((h) => (
            <button
              key={h.citySlug}
              onClick={() => router.push(`/about/where-we-work/${countrySlug}/${h.citySlug}`)}
              className="flex items-center gap-1.5 text-xs text-foreground hover:text-emerald-600 transition-colors"
            >
              <span
                className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
                style={{ background: h.color }}
              />
              {h.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground pt-1">{config.attribution}</p>
      </div>
    </div>
  );
}
