"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Target, Globe, Code2, Mail, Github, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { TimelineCard } from "@/components/timeline-card";
import { Button } from "@/components/ui/button";
import { skillGroups } from "@/data/skills";
import { timeline } from "@/data/timeline";
import { siteConfig, socialLinks } from "@/data/site";

function ProfileImage() {
  const [src, setSrc] = useState("/images/profile.jpg");
  const [attempts, setAttempts] = useState(0);

  const fallbacks = [
    "/images/profile.png",
    "/images/profile.jpeg",
    "/images/profile-placeholder.png"
  ];

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
      <Image
        src={src}
        alt={siteConfig.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        priority
        onError={() => {
          if (attempts < fallbacks.length) {
            setSrc(fallbacks[attempts]);
            setAttempts(prev => prev + 1);
          }
        }}
        unoptimized // Allow local file loading without strict optimization checks during dev/fallback
      />
    </div>
  );
}

const highlights = [
  {
    icon: Code2,
    title: "What I Build",
    description: "Full-stack web platforms, admin dashboards, and scalable backend flows.",
  },
  {
    icon: GraduationCap,
    title: "My Research",
    description: "Building ML foundations with Python and exploring Computer Vision.",
  },
  {
    icon: Target,
    title: "How I Work",
    description: "Clean UI, maintainable code, and a shipping mindset focused on user needs.",
  },
  {
    icon: Globe,
    title: "Beyond Code",
    description: "Visited 32 countries. Capturing stories through travel blogs and vlogs.",
  },
];

const nowItems = [
  "Building this portfolio CMS + project journal",
  "Deepening AI/ML foundations & Computer Vision",
  "Open to internships, freelance, and collaborations",
];

export function AboutContent() {
  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="grid gap-12 md:grid-cols-[1fr_320px] md:gap-16 items-start">
        <div className="space-y-8">
          <SectionHeader
            eyebrow="About Me"
            title="Building digital products. Exploring AI. Traveling the world."
            description="I'm Shahadat, an Applied AI student and full-stack developer based in Vilnius. I blend academic research with hands-on engineering to build products that work. When I'm not coding, I'm exploring new borders and documenting the journey."
            className="items-start text-left"
          />

          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/contact">Let&apos;s Collaborate</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/projects">View Work</Link>
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="group sticky top-24 overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
        >
          <ProfileImage />
          <div className="p-6 space-y-4 bg-card/50 backdrop-blur-sm">
            <div>
              <h3 className="font-bold text-lg text-foreground">{siteConfig.name}</h3>
              <p className="text-sm text-muted-foreground">{siteConfig.location}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-muted">
                <Link href={socialLinks.find(l => l.platform === 'GitHub')?.href || '#'} target="_blank">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-muted">
                <Link href={socialLinks.find(l => l.platform === 'LinkedIn')?.href || '#'} target="_blank">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-muted">
                <Link href={`mailto:${siteConfig.email}`}>
                  <Mail className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item, i) => (
          <motion.div
            key={item.title}
            className="rounded-3xl border border-border/60 bg-card/50 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <item.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-16 lg:grid-cols-[2fr,1fr] lg:gap-24">
        {/* Timeline */}
        <section className="space-y-10">
          <SectionHeader
            eyebrow="Timeline"
            title="A journey through AI and data"
            description="From academic labs to product teams, the milestones that shaped my craft."
            className="items-start text-left"
          />
          <div className="space-y-8 pl-2 border-l border-border/50">
            {timeline.map((item) => (
              <TimelineCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        <div className="space-y-16">
          {/* Skills */}
          <section className="space-y-8">
            <h3 className="text-lg font-bold">Tools in rotation</h3>
            <div className="space-y-8">
              {skillGroups.map((group) => (
                <div key={group.title} className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex cursor-default items-center rounded-md border border-border/50 bg-muted/30 px-3 py-1 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-primary/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Now Section */}
          <section className="space-y-6 rounded-3xl border border-dashed border-border p-8 bg-card/30">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <h3 className="text-lg font-bold">What I&apos;m doing now</h3>
              </div>
              <p className="text-sm text-muted-foreground">Currently based in {siteConfig.location}</p>
            </div>
            <ul className="space-y-3">
              {nowItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="ghost" className="px-0 text-primary h-auto hover:bg-transparent hover:underline hover:text-primary/80">
              <Link href="/contact">Let&apos;s collaborate &rarr;</Link>
            </Button>
          </section>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-foreground px-8 py-16 text-background md:px-16 md:py-20 text-center">
        <div className="relative z-10 mx-auto max-w-2xl space-y-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-background">
            Want to build something ambitious?
          </h2>
          <p className="text-lg text-background/80">
            I&apos;m open to internships, freelance projects, and full-time roles. If you have an idea or need a hand, let&apos;s talk.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90 h-12 px-8">
              <Link href="/contact">Contact Me</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-background/20 text-background hover:bg-background/10 h-12 px-8">
              <a href={`mailto:${siteConfig.email}`}>Email Me</a>
            </Button>
          </div>
        </div>
        {/* Decoration */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
      </section>
    </div>
  );
}
