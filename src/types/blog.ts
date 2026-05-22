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
  paragraph: string
  body: string[]
  image: string
  author: Author
  tags: string[]
  category: BlogCategory
  publishDate: string
  publishedAt: string
}
