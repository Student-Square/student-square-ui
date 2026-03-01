import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { getProjectBySlug } from "@/data/projectsData";

type VideoPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectVideoPage({ params }: VideoPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href={`/projects/${project.slug}/blog`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <FileText className="h-4 w-4" />
            Project Blog
          </Link>
        </div>

        <h1 className="mb-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          {project.title} Video
        </h1>
        <p className="mb-6 max-w-3xl text-muted-foreground">{project.summary}</p>

        <div className="overflow-hidden rounded-2xl border border-border bg-black">
          <video
            src={project.videoSrc}
            poster={project.poster}
            controls
            autoPlay
            loop
            playsInline
            className="h-auto w-full"
          />
        </div>
      </div>
    </main>
  );
}
