import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { getProjectBySlug } from "@/data/projectsData";

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectBlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href={`/projects/${project.slug}/video`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <PlayCircle className="h-4 w-4" />
            Watch Video
          </Link>
        </div>

        <h1 className="mb-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          {project.title} Blog
        </h1>
        <p className="mb-8 text-muted-foreground">{project.summary}</p>

        <article className="space-y-5 rounded-2xl border border-border bg-card/30 p-6 text-sm leading-relaxed text-foreground sm:text-base">
          <p>
            This page is dedicated to updates, outcomes, and reflections from the{" "}
            <strong>{project.title}</strong> initiative. We use this space to document key milestones,
            student participation, and measurable community impact.
          </p>
          <p>
            As the project evolves, this blog will include stories from participants, implementation
            notes, and practical lessons that can help replicate successful actions in other contexts.
          </p>
          <p>
            Visit the video page for visual highlights and field footage tied to this project&apos;s
            work.
          </p>
        </article>
      </div>
    </main>
  );
}
