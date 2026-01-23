export interface Partner {
  id: number
  name: string
  logo: string
  website?: string
}

export const partnersData: Partner[] = [
  {
    id: 1,
    name: "BRAC University",
    logo: "/images/partners/brac-university.png",
  },
  {
    id: 2,
    name: "University of Dhaka",
    logo: "/images/partners/dhaka-university.png",
  },
  {
    id: 3,
    name: "North South University (NSU)",
    logo: "/images/partners/nsu.png",
  },
  {
    id: 4,
    name: "French Partner",
    logo: "/images/partners/french.png",
  },
  {
    id: 5,
    name: "U.S. Department of State",
    logo: "/images/partners/U.S._Department_of_State_official_seal.webp",
  },
]
