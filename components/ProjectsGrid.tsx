"use client";

import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import { ProjectCard } from "@/components/project-card";

type ProjectsGridProps = {
  projects: Project[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {projects.map((project) => (
        <motion.div key={project.slug} variants={itemVariants}>
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </motion.div>
  );
}
