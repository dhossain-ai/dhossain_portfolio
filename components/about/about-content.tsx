"use client";

import { motion } from "framer-motion";
import { GraduationCap, Target, Users } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { TimelineCard } from "@/components/timeline-card";
import { skillGroups } from "@/data/skills";
import { timeline } from "@/data/timeline";

const highlights = [
  {
    icon: Target,
    title: "Product-ready builds",
    description:
      "Shipping web platforms, admin dashboards, and running backend logic end-to-end.",
  },
  {
    icon: Users,
    title: "Web + Android",
    description:
      "Modern web experiences + Flutter Android apps designed for real usage.",
  },
  {
    icon: GraduationCap,
    title: "AI-curious mindset",
    description:
      "Exploring ML foundations with Python and applying learning through projects.",
  },
];

export function AboutContent() {
  return (
    <div className="space-y-16">
      <SectionHeader
        eyebrow="About"
        title="Curious by nature. Builder by choice."
        description="Applied AI student building full-stack web and Android apps. I care about clean interfaces, scalable backend flows, and real features users need. Currently growing into AI/ML with Python through learning and experimentation."
      />

      <div className="grid gap-6 sm:grid-cols-3">
        {highlights.map((item) => (
          <motion.div
            key={item.title}
            className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <item.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-12 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-8">
          <SectionHeader
            eyebrow="Timeline"
            title="A journey through AI and data"
            description="From academic labs to product teams, here is the throughline of the projects and people who shaped my craft."
          />
          <div className="space-y-6">
            {timeline.map((item) => (
              <TimelineCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeader
            eyebrow="Skills"
            title="Tools in heavy rotation"
            description="A snapshot of the stacks and environments I lean on most."
          />
          <div className="space-y-5">
            {skillGroups.map((group) => (
              <div
                key={group.title}
                className="space-y-4 rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm"
              >
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {group.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-md border border-border/50 bg-background/50 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-background hover:text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
