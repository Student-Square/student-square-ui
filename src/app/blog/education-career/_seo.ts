// Titles and descriptions for /blog/education-career/<slug>, read by the
// category layout and sitemap.ts. SUB_CATEGORIES in ./_content is a client
// module, so server code cannot read it — keep these slugs in step with it.
// An unknown slug just gets no metadata, and the page itself 404s.
export const CATEGORY_SEO: Record<string, { title: string; description: string }> = {
  career: {
    title: "Career Guidance for Students",
    description: "Career planning, job hunting and first-job advice for students and fresh graduates in Bangladesh.",
  },
  "higher-study": {
    title: "Higher Study Guidance",
    description: "Choosing a subject, a university and a path abroad: higher study guidance for students in Bangladesh.",
  },
  "self-development": {
    title: "Self-Development for Students",
    description: "Study habits, confidence, communication and personal growth articles for students and young people.",
  },
  parenting: {
    title: "Parenting and Student Support",
    description: "Guidance for parents on supporting their children's education, career choices and wellbeing.",
  },
  "social-issues": {
    title: "Social Issues Affecting Students",
    description: "Articles on the social issues that shape students' lives and education in Bangladesh.",
  },
  "scholarship-opportunities": {
    title: "Scholarship Opportunities",
    description: "Scholarships and grants open to students in Bangladesh, with deadlines and how to apply.",
  },
  competitions: {
    title: "Competitions for Students",
    description: "Competitions for school, college and university students in Bangladesh, and how to take part.",
  },
  olympiads: {
    title: "Olympiads for Students",
    description: "Maths, science and other olympiads for students in Bangladesh: dates, preparation and results.",
  },
};

