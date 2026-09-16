export type Author = {
  name: string
  image: string
  designation: string
}

export type BlogCategory =
  | "Counselling"
  | "Scholarships"
  | "Community"
  | "Mental Health"
  | "Environment"
  | "Education"

export type Blog = {
  id: number
  title: string
  /** Bangla title; the body stays English (legacy sample posts). */
  titleBn?: string
  paragraph: string
  body: string[]
  image: string
  author: Author
  tags: string[]
  category: BlogCategory
  publishDate: string
  publishedAt: string
}
