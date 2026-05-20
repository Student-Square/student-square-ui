export type City = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
  image: string;
  description: string;
  stats: { value: string; label: string }[];
};

export type Country = {
  name: string;
  slug: string;
  center: [number, number];
  zoom: number;
  description: string;
  stats: { value: string; label: string }[];
  cities: City[];
};

const BIO =
  "Our vision is to foster an inclusive society where every individual's potential is nurtured and developed, free from any form of discrimination. Our mission is to empower individuals through education and skill development, creating a society free from discrimination and equipped to tackle global challenges collectively such as poverty, climate change, inequality, and health crises.";

const STATS = [
  { value: "7.1m",    label: "people in need of humanitarian assistance" },
  { value: "1.3m",    label: "people do not have enough to eat" },
  { value: "350,000", label: "students reached through our programmes" },
];

export const locations: Country[] = [
  {
    name: "Bangladesh",
    slug: "bangladesh",
    center: [23.7, 90.35],
    zoom: 7,
    description: BIO,
    stats: STATS,
    cities: [
      { name: "Rajshahi",        slug: "rajshahi",        lat: 24.374, lng: 88.601, image: "/images/student-square-at-kustia-district.jpg",              description: BIO, stats: STATS },
      { name: "Joypurhat",       slug: "joypurhat",       lat: 25.097, lng: 89.023, image: "/images/student-square-school-session.jpg",                   description: BIO, stats: STATS },
      { name: "Chapainawabganj", slug: "chapainawabganj", lat: 24.594, lng: 88.278, image: "/images/student-square-one-minute-investment-project.jpg",     description: BIO, stats: STATS },
      { name: "Kushtia",         slug: "kushtia",         lat: 23.901, lng: 89.120, image: "/images/student-square-at-kustia-district.jpg",              description: BIO, stats: STATS },
      { name: "Khulna",          slug: "khulna",          lat: 22.845, lng: 89.540, image: "/images/tree-plantation-by-student-square.jpg",               description: BIO, stats: STATS },
      { name: "Chittagong",      slug: "chittagong",      lat: 22.356, lng: 91.783, image: "/images/brain-battle-prize-ceremony.jpg",                     description: BIO, stats: STATS },
      { name: "Feni",            slug: "feni",            lat: 23.012, lng: 91.397, image: "/images/emergency-tran-bitoron-activities-2.jpg",             description: BIO, stats: STATS },
    ],
  },
  {
    name: "UK",
    slug: "uk",
    center: [52.8, -1.8],
    zoom: 6,
    description: BIO,
    stats: STATS,
    cities: [
      { name: "Hampshire", slug: "hampshire", lat: 51.058, lng: -1.308, image: "/images/pexels-sabbir-bhuiyan-1747552532-32221017.jpg", description: BIO, stats: STATS },
    ],
  },
];

export function getCountryBySlug(slug: string): Country | undefined {
  return locations.find((c) => c.slug === slug);
}

export function getCityBySlug(
  countrySlug: string,
  citySlug: string
): { country: Country; city: City } | undefined {
  const country = getCountryBySlug(countrySlug);
  if (!country) return undefined;
  const city = country.cities.find((c) => c.slug === citySlug);
  if (!city) return undefined;
  return { country, city };
}
