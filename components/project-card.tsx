"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Github, Smartphone, Sparkles, AlertCircle } from "lucide-react";
import { Project } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { TechBadge } from "@/components/tech-badge";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  layoutId?: string;
};

export function ProjectCard({ project, layoutId }: ProjectCardProps) {
  return (
    <motion.article
      layoutId={layoutId ?? project.slug}
      className={cn(
        "group relative flex h-full flex-col rounded-3xl border border-border/70 bg-gradient-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft",
        project.featured && "border-primary/30",
      )}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-0 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary/50" aria-label={`View ${project.title}`} />

      <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium uppercase tracking-[0.2em]">
          {project.year}
        </span>
        <div className="flex items-center gap-2">
          {project.beta && (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-3 w-3" />
              Beta
            </span>
          )}
          {project.featured && !project.beta && (
            <span className="flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold text-primary">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          )}
        </div>
      </div>
      <div className="relative z-10 mt-4 space-y-3">
        <h3 className="text-2xl font-semibold text-foreground">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {project.description}
        </p>
      </div>
      <div className="relative z-10 mt-4 flex flex-wrap gap-2">
        {project.tech.map((item) => (
          <TechBadge key={item} label={item} />
        ))}
      </div>
      <div className="relative z-20 mt-6 flex flex-wrap gap-3 pt-4">
        {project.links.map((link) => {
          const Icon = getIconForLabel(link.label);
          const isPrimary = link.kind === "primary";

          return (
            <Button
              key={link.url}
              asChild
              variant={isPrimary ? "primary" : "outline"}
              size="sm"
              className={cn(
                "rounded-2xl",
                !isPrimary && "text-muted-foreground hover:text-foreground"
              )}
            >
              <Link href={link.url} target={link.url.startsWith("/") ? "_self" : "_blank"} rel="noreferrer">
                {link.label} <Icon className="h-4 w-4" />
              </Link>
            </Button>
          );
        })}
      </div>
    </motion.article>
  );
}

function getIconForLabel(label: string) {
  const l = label.toLowerCase();
  if (l.includes("code") || l.includes("github") || l.includes("repo")) return Github;
  if (l.includes("android") || l.includes("play store") || l.includes("app")) return Smartphone;
  if (l.includes("beta")) return AlertCircle;
  return ExternalLink;
}
