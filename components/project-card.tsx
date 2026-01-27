"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Github, Smartphone, Sparkles, AlertCircle } from "lucide-react";
import { Project } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TechBadge } from "@/components/tech-badge";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  layoutId?: string;
};

export function ProjectCard({ project, layoutId }: ProjectCardProps) {
  const isBeta = project.badge === 'Beta';

  // Normalize links
  const links = [
    { label: 'Live', url: project.live_url, kind: 'primary' },
    { label: 'Code', url: project.code_url, kind: 'secondary' },
    { label: 'Android', url: project.android_url, kind: 'secondary' },
    { label: 'iOS', url: project.ios_url, kind: 'secondary' },
  ].filter(l => l.url) as { label: string; url: string; kind: 'primary' | 'secondary' }[]

  return (
    <motion.div
      layoutId={layoutId ?? project.slug}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="h-full"
    >
      <SpotlightCard className={cn(
        "group flex h-full flex-col bg-card/50",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10",
        "motion-reduce:transition-none motion-reduce:transform-none",
        project.featured && "border-primary/30",
        isBeta && "border-amber-500/30"
      )}
        spotlightColor="rgba(120, 119, 198, 0.15)"
      >
        <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-0 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-3xl" aria-label={`View ${project.title}`} />

        {/* Top row: Year + Badge */}
        <div className="relative z-10 flex items-center justify-between p-5 pb-2 text-xs text-muted-foreground sm:p-6 sm:pb-2">
          <span className="font-medium uppercase tracking-[0.2em]">
            {project.year}
          </span>
          <div className="flex items-center gap-2">
            {isBeta && (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-3 w-3" />
                Beta
              </span>
            )}
            {project.featured && !isBeta && (
              <span className="flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold text-primary">
                <Sparkles className="h-3 w-3" />
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Title + Summary */}
        <div className="relative z-10 flex-1 space-y-3 px-5 sm:px-6">
          <h3 className="text-2xl font-semibold text-foreground line-clamp-2">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {project.summary}
          </p>
        </div>

        {/* Tech stack tags - controlled height */}
        <div className="relative z-10 mt-4 flex flex-wrap gap-2 px-5 max-h-16 overflow-hidden sm:px-6">
          {project.stack.slice(0, 4).map((item) => (
            <TechBadge key={item} label={item} />
          ))}
          {project.stack.length > 4 && (
            <span className="text-[10px] text-muted-foreground self-center">+{project.stack.length - 4}</span>
          )}
        </div>

        {/* Action buttons - pinned to bottom */}
        <div className="relative z-20 mt-auto flex flex-wrap gap-3 p-5 pt-4 sm:p-6 sm:pt-4">
          {links.map((link) => {
            const Icon = getIconForLabel(link.label);
            const isPrimary = link.kind === "primary";

            return (
              <Button
                key={link.url}
                asChild
                variant={isPrimary ? "primary" : "outline"}
                size="sm"
                className={cn(
                  "rounded-2xl group/btn",
                  !isPrimary && "text-muted-foreground hover:text-foreground"
                )}
              >
                <Link href={link.url} target={link.url.startsWith("/") ? "_self" : "_blank"} rel="noreferrer">
                  {link.label} <Icon className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 motion-reduce:transform-none" />
                </Link>
              </Button>
            );
          })}
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

function getIconForLabel(label: string) {
  const l = label.toLowerCase();
  if (l.includes("code") || l.includes("github") || l.includes("repo")) return Github;
  if (l.includes("android") || l.includes("play store") || l.includes("app")) return Smartphone;
  if (l.includes("ios")) return Smartphone;
  if (l.includes("beta")) return AlertCircle;
  return ExternalLink;
}
