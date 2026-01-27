import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getPublishedPosts } from "@/lib/blog";
import { getPublishedProjects } from "@/lib/projects";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const lastMod = new Date();

  const routes: MetadataRoute.Sitemap = ["/", "/projects", "/about", "/blog", "/journal", "/contact"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: lastMod,
  }));

  const blogPosts = await getPublishedPosts('blog');
  const journalPosts = await getPublishedPosts('journal');

  const blogEntries = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
  }));

  const journalEntries = journalPosts.map((post) => ({
    url: `${baseUrl}/journal/${post.slug}`,
    lastModified: new Date(post.updated_at),
  }));

  const projects = await getPublishedProjects();
  const projectEntries = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.updated_at),
  }));

  return [...routes, ...blogEntries, ...journalEntries, ...projectEntries];
}
