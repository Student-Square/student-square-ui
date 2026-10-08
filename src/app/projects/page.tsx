import { pageMetadata } from "@/lib/seo";
import ProjectsContent from "./_components/ProjectsContent";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Community projects run by Student Square volunteers across Bangladesh: health care, climate action, Eid support and more. See each project and how to help.",
  path: "/projects",
});

export default function ProjectsPage() {
  return <ProjectsContent />;
}
