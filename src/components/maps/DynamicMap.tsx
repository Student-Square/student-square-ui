"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";

export type RegionConfig = {
  /** Exact value that appears in the GeoJSON feature property */
  name: string;
  color: string;
  /** Optional display label for legend (defaults to name) */
  label?: string;
  onClick?: () => void;
};

type Props = {
  geoUrl: string;
  center: [number, number];
  scale: number;
  /** GeoJSON property key used to match region names */
  nameProperty: string;
  /** Regions to highlight — un-listed features render in #E5E5E5 */
  regions: RegionConfig[];
  /** SVG viewBox width (default 800) */
  svgWidth?: number;
  /** SVG viewBox height (default 500) */
  svgHeight?: number;
  /** Called with the feature's name value when any geography is clicked */
  onRegionClick?: (name: string) => void;
};

export default function DynamicMap({
  geoUrl,
  center,
  scale,
  nameProperty,
  regions,
  svgWidth = 800,
  svgHeight = 500,
  onRegionClick,
}: Props) {
  const lookup = new Map<string, RegionConfig>();
  for (const r of regions) lookup.set(r.name, r);

  return (
    <ComposableMap
      width={svgWidth}
      height={svgHeight}
      projection="geoMercator"
      projectionConfig={{ center, scale }}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }: { geographies: import("react-simple-maps").GeoFeature[] }) =>
          geographies.map((geo) => {
            const regionName: string =
              geo.properties[nameProperty] ?? "";
            const config = lookup.get(regionName);

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => {
                  config?.onClick?.();
                  onRegionClick?.(regionName);
                }}
                style={{
                  default: {
                    fill: config ? config.color : "#E5E5E5",
                    stroke: "#FFFFFF",
                    strokeWidth: 0.5,
                    outline: "none",
                    cursor: config ? "pointer" : "default",
                  },
                  hover: {
                    fill: config ? config.color : "#D0D0D0",
                    stroke: "#FFFFFF",
                    strokeWidth: 0.5,
                    outline: "none",
                    filter: config ? "brightness(0.85)" : "none",
                    cursor: config ? "pointer" : "default",
                  },
                  pressed: { outline: "none" },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}
