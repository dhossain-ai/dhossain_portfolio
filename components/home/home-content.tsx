"use client";

import Link from "next/link";
import { ArrowRight, Mail, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { TechBadge } from "@/components/tech-badge";
import { ProjectCard } from "@/components/project-card";
import { siteConfig } from "@/data/site";
import type { Project } from "@/lib/projects";

const focusAreas = [
  "Full-stack products",
  "Web + mobile",
  "AI/ML journey",
];

type HomeContentProps = {
  featuredProjects: Project[];
}

export function HomeContent({ featuredProjects }: HomeContentProps) {
  return (
    <div className="space-y-16 md:space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-border/60 px-6 py-14 shadow-soft sm:px-8 md:px-10 md:py-16">

        {/* Ambient Backgrounds - Dark Mode optimized */}
        <div className="pointer-events-none absolute inset-0 select-none">
          {/* Top Right Blob */}
          <div className="absolute -top-[20%] -right-[10%] h-[350px] w-[350px] rounded-full bg-primary/10 blur-[100px] dark:bg-primary/20" />
          {/* Bottom Left Blob */}
          <div className="absolute -bottom-[20%] -left-[10%] h-[280px] w-[280px] rounded-full bg-blue-500/10 blur-[80px] dark:bg-purple-500/20" />
          {/* Gradient Overlay for subtle texture */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-background/20 to-background/50 backdrop-blur-[1px]" />
        </div>

        <motion.div
          className="relative z-10 space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 } // Stagger reveals
            }
          }}
        >
          {/* Badge */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI & Data Science Explorer
          </motion.div>

          {/* Main Headline */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="space-y-6 text-balance"
          >
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
              Building. Shipping. Improving. 🚀
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl md:leading-relaxed">
              Applied AI student at VILNIUS TECH. I ship full-stack apps with clean UI, scalable backend flows, and real-world features — with a growing foundation in AI/ML.
            </p>
          </motion.div>

          {/* Metadata / Location */}
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2 rounded-full bg-background/50 px-3 py-1 backdrop-blur-sm border border-border/50">
              <MapPin className="h-4 w-4 text-primary" />
              {siteConfig.location}
            </div>
            <div className="flex items-center gap-2 rounded-full bg-background/50 px-3 py-1 backdrop-blur-sm border border-border/50">
              <Mail className="h-4 w-4 text-primary" />
              <a className="hover:text-primary transition-colors" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Button asChild size="lg" className="rounded-full h-12 px-8 shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30">
              <Link href="/projects">
                View projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full h-12 px-8 bg-background/50 backdrop-blur-sm hover:bg-background/80"
            >
              <Link href="/contact">
                Start a project
                <Mail className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Focus Chips */}
        <motion.div
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {focusAreas.map((area) => (
            <div
              key={area}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/40 p-5 text-sm font-medium text-foreground/80 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md dark:bg-zinc-900/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative">{area}</span>
            </div>
          ))}
        </motion.div>
      </section>

      <section id="projects" className="space-y-8">
        <SectionHeader
          eyebrow="Selected work"
          title="Recent projects"
          description="A selection of the full-stack web platforms and mobile apps I have shipped recently."
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
          title="Tech I use"
          description="Technologies I use to build and ship full-stack web and mobile apps."
        />
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-border/60 bg-background/50 py-12 md:shadow-xl">
          <div className="grid w-full gap-8 px-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Core Web */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Core Web
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Next.js",
                  "TypeScript",
                  "JavaScript",
                  "Node.js",
                  "Tailwind CSS",
                ].map((skill) => (
                  <TechBadge key={skill} label={skill} />
                ))}
              </div>
            </div>

            {/* Platforms & Infra */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Platforms & Infra
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Supabase",
                  "Firebase",
                  "Cloudinary",
                  "Vercel",
                  "GitHub",
                  "Docker",
                ].map((skill) => (
                  <TechBadge key={skill} label={skill} />
                ))}
              </div>
            </div>

            {/* Mobile */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Mobile
              </h4>
              <div className="flex flex-wrap gap-2">
                {["Flutter"].map((skill) => (
                  <TechBadge key={skill} label={skill} />
                ))}
              </div>
            </div>

            {/* Python + AI/ML */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Python + AI/ML
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Python",
                  "NumPy",
                  "Pandas",
                  "Scikit-Learn",
                  "OpenCV",
                ].map((skill) => (
                  <TechBadge key={skill} label={skill} />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-muted-foreground/80">
              Currently exploring deeper: <span className="text-foreground">Computer Vision & Machine Learning</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
