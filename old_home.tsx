"use client";

import Link from "next/link";
import { ArrowRight, Mail, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { TechBadge } from "@/components/tech-badge";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";

const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);

const focusAreas = [
  "Full-stack products",
  "Web + mobile",
  "AI/ML journey",
];

export function HomeContent() {
  return (
    <div className="space-y-24">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background px-6 py-12 shadow-soft sm:px-10 md:px-14 md:py-16">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            AI & Data Science Explorer
          </div>
          <div className="space-y-6 text-balance">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Building. Shipping. Improving. 🚀
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Applied AI student at VILNIUS TECH. I ship full-stack apps with clean UI, scalable backend flows, and real-world features — with a growing foundation in AI/ML.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {siteConfig.location}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <a className="hover:text-primary" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-3xl">
              <Link href="/projects">
                View projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-3xl text-foreground"
            >
              <Link href="/contact">
                Start a project
                <Mail className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
        <motion.div
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {focusAreas.map((area) => (
            <motion.div
              key={area}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              className="rounded-2xl border border-border/60 bg-card/80 p-5 text-sm text-muted-foreground shadow-sm backdrop-blur"
            >
              {area}
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="projects" className="space-y-10">
        <SectionHeader
          eyebrow="Selected work"
          title="Recent projects"
          description="A taste of the AI-native products, data platforms, and developer tools I have shipped recently."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border/70 bg-card/80 px-6 py-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-foreground">
              Want the full breakdown?
            </p>
            <p className="text-sm text-muted-foreground">
              Dive into the full project archive or get in touch to talk through a challenge.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="secondary" size="sm" className="rounded-2xl">
              <Link href="/projects">
                Browse all projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-2xl">
              <Link href="/contact">
                Contact me
                <Mail className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Toolbox"
          title="Stack favourites"
          description="Technologies I reach for when crafting resilient AI products."
        />
        <div className="flex flex-wrap gap-3">
          {[
            "TypeScript",
            "Next.js",
            "Node.js",
            "Python",
            "TensorFlow",
            "MongoDB",
            "Docker",
            "Tailwind",
            "Vercel",
          ].map((skill) => (
            <TechBadge key={skill} label={skill} />
          ))}
        </div>
      </section>
    </div>
  );
}
