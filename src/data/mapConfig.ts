export type RegionHighlight = {
  /** Display name shown in legend */
  label: string;
  /** City slug for click navigation */
  citySlug: string;
  /** Fill colour */
  color: string;
  /** One or more names that might appear as the property value in the topojson */
  aliases: string[];
};

export type CountryMapConfig = {
  title: string;
  geoUrl: string;
  /** Topojson object name (leave blank to use first object) */
  objectName?: string;
  /** Feature property key that holds the region name */
  nameProperty: string;
  /** [longitude, latitude] centre for the Mercator projection */
  center: [number, number];
  /** d3-geo projection scale — higher = more zoomed in */
  scale: number;
  attribution: string;
  highlights: RegionHighlight[];
};

const COLORS = {
  yellow:    "#F4D03F",
  teal:      "#1ABC9C",
  green:     "#2ECC71",
  cyan:      "#76D7C4",
  red:       "#E74C3C",
  orange:    "#E67E22",
  blue:      "#3498DB",
  purple:    "#9B59B6",
  darkGreen: "#27AE60",
};

export const COUNTRY_MAP_CONFIGS: Record<string, CountryMapConfig> = {
  bangladesh: {
    title: "Bangladesh Map",
    geoUrl:
      "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/bangladesh/bangladesh-districts.json",
    nameProperty: "DIST_NAME",
    center: [90.35, 23.68],
    scale: 4200,
    attribution: "Map data: © Arc Bangladesh Ltd. · Created with react-simple-maps",
    highlights: [
      { label: "Rajshahi",        citySlug: "rajshahi",        color: COLORS.orange, aliases: ["Rajshahi"] },
      { label: "Joypurhat",       citySlug: "joypurhat",       color: COLORS.blue,   aliases: ["Joypurhat"] },
      { label: "Chapai",          citySlug: "chapainawabganj", color: COLORS.yellow, aliases: ["Chapainawabganj", "Nawabganj", "Chapai Nawabganj", "Chapai"] },
      { label: "Kushtia",         citySlug: "kushtia",         color: COLORS.red,    aliases: ["Kushtia"] },
      { label: "Khulna",          citySlug: "khulna",          color: COLORS.cyan,   aliases: ["Khulna"] },
      { label: "Feni",            citySlug: "feni",            color: COLORS.teal,   aliases: ["Feni"] },
    ],
  },
  uk: {
    title: "UK Map",
    geoUrl:
      "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-kingdom/uk-ceremonial-counties.json",
    nameProperty: "NAME_2",
    center: [-1.8, 52.5],
    scale: 2400,
    attribution: "Map data: © Crown copyright and database right 2019 · Created with react-simple-maps",
    highlights: [
      { label: "Hampshire", citySlug: "hampshire", color: COLORS.green, aliases: ["Hampshire"] },
    ],
  },
  india: {
    title: "India Map",
    geoUrl:
      "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json",
    nameProperty: "NAME_1",
    center: [80.0, 22.0],
    scale: 900,
    attribution: "Map data: Created with react-simple-maps",
    highlights: [
      { label: "Maharashtra", citySlug: "mumbai",    color: COLORS.orange, aliases: ["Maharashtra"] },
      { label: "Delhi",       citySlug: "delhi",     color: COLORS.red,    aliases: ["Delhi", "NCT of Delhi"] },
      { label: "Karnataka",   citySlug: "bangalore", color: COLORS.teal,   aliases: ["Karnataka"] },
    ],
  },
  pakistan: {
    title: "Pakistan Map",
    geoUrl:
      "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/pakistan/pakistan-divisions.json",
    nameProperty: "NAME_2",
    center: [69.3, 30.4],
    scale: 1100,
    attribution: "Map data: Created with react-simple-maps",
    highlights: [
      { label: "Karachi", citySlug: "karachi", color: COLORS.orange, aliases: ["Karachi"] },
      { label: "Lahore",  citySlug: "lahore",  color: COLORS.teal,   aliases: ["Lahore"] },
    ],
  },
  nepal: {
    title: "Nepal Map",
    geoUrl:
      "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/nepal/nepal-districts.json",
    nameProperty: "DIST_NAME",
    center: [84.1, 28.2],
    scale: 2400,
    attribution: "Map data: Created with react-simple-maps",
    highlights: [
      { label: "Kathmandu", citySlug: "kathmandu", color: COLORS.orange, aliases: ["Kathmandu"] },
    ],
  },
  "sri-lanka": {
    title: "Sri Lanka Map",
    geoUrl:
      "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/sri-lanka/sri-lanka-provinces.json",
    nameProperty: "NAME_1",
    center: [80.7, 7.9],
    scale: 3200,
    attribution: "Map data: Created with react-simple-maps",
    highlights: [
      { label: "Western Province", citySlug: "colombo", color: COLORS.orange, aliases: ["Western", "Western Province"] },
    ],
  },
};
