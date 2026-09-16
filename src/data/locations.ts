export type City = {
  name: string;
  nameBn: string;
  slug: string;
  lat: number;
  lng: number;
  image: string;
  description: string;
  descriptionBn: string;
};

export type Country = {
  name: string;
  nameBn: string;
  slug: string;
  center: [number, number];
  zoom: number;
  description: string;
  descriptionBn: string;
  cities: City[];
};

const BIO =
  "Our vision is to foster an inclusive society where every individual's potential is nurtured and developed, free from any form of discrimination. Our mission is to empower individuals through education and skill development, creating a society free from discrimination and equipped to tackle global challenges collectively such as poverty, climate change, inequality, and health crises.";

const BIO_BN =
  "আমাদের লক্ষ্য এমন একটি অন্তর্ভুক্তিমূলক সমাজ গড়ে তোলা, যেখানে সব ধরনের বৈষম্য থেকে মুক্ত থেকে প্রত্যেক মানুষের সম্ভাবনা লালিত ও বিকশিত হয়। আমাদের উদ্দেশ্য শিক্ষা ও দক্ষতা উন্নয়নের মাধ্যমে মানুষকে ক্ষমতায়িত করা এবং এমন একটি বৈষম্যহীন সমাজ গড়ে তোলা, যা দারিদ্র্য, জলবায়ু পরিবর্তন, অসমতা ও স্বাস্থ্য সংকটের মতো বৈশ্বিক চ্যালেঞ্জ সম্মিলিতভাবে মোকাবিলা করতে সক্ষম।";

// Figures are deliberately absent here. These pages render the foundation's
// real, organisation-wide totals via <ImpactStats />; the per-country and
// per-city numbers that used to sit in this file were a humanitarian template's
// statistics about Mali, shown as if they described Student Square.
export const locations: Country[] = [
  {
    name: "Bangladesh",
    nameBn: "বাংলাদেশ",
    slug: "bangladesh",
    center: [23.7, 90.35],
    zoom: 7,
    description: BIO,
    descriptionBn: BIO_BN,
    cities: [
      { name: "Rajshahi", nameBn: "রাজশাহী",        slug: "rajshahi",        lat: 24.374, lng: 88.601, image: "/images/student-square-at-kustia-district.jpg",              description: BIO, descriptionBn: BIO_BN },
      { name: "Joypurhat", nameBn: "জয়পুরহাট",       slug: "joypurhat",       lat: 25.097, lng: 89.023, image: "/images/student-square-school-session.jpg",                   description: BIO, descriptionBn: BIO_BN },
      { name: "Chapainawabganj", nameBn: "চাঁপাইনবাবগঞ্জ", slug: "chapainawabganj", lat: 24.594, lng: 88.278, image: "/images/student-square-one-minute-investment-project.jpg",     description: BIO, descriptionBn: BIO_BN },
      { name: "Kushtia", nameBn: "কুষ্টিয়া",         slug: "kushtia",         lat: 23.901, lng: 89.120, image: "/images/student-square-at-kustia-district.jpg",              description: BIO, descriptionBn: BIO_BN },
      { name: "Khulna", nameBn: "খুলনা",          slug: "khulna",          lat: 22.845, lng: 89.540, image: "/images/tree-plantation-by-student-square.jpg",               description: BIO, descriptionBn: BIO_BN },
      { name: "Chittagong", nameBn: "চট্টগ্রাম",      slug: "chittagong",      lat: 22.356, lng: 91.783, image: "/images/brain-battle-prize-ceremony.jpg",                     description: BIO, descriptionBn: BIO_BN },
      { name: "Feni", nameBn: "ফেনী",            slug: "feni",            lat: 23.012, lng: 91.397, image: "/images/emergency-tran-bitoron-activities-2.jpg",             description: BIO, descriptionBn: BIO_BN },
    ],
  },
  {
    name: "UK",
    nameBn: "যুক্তরাজ্য",
    slug: "uk",
    center: [52.8, -1.8],
    zoom: 6,
    description: BIO,
    descriptionBn: BIO_BN,
    cities: [
      { name: "Hampshire", nameBn: "হ্যাম্পশায়ার", slug: "hampshire", lat: 51.058, lng: -1.308, image: "/images/pexels-sabbir-bhuiyan-1747552532-32221017.jpg", description: BIO, descriptionBn: BIO_BN },
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
