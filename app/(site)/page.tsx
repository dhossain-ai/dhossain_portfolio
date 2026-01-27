import { HomeContent } from "@/components/home/home-content";
import { buildMetadata } from "@/lib/seo";
import { getPublishedProjects } from "@/lib/projects";

export const metadata = buildMetadata();
export const revalidate = 60;

export default async function HomePage() {
  const projects = await getPublishedProjects();
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);

  return <HomeContent featuredProjects={featuredProjects} />;
}
