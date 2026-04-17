"use client";

import { siteConfig, socialLinks } from "@/data/site";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Mail,
  FileText,
  Printer,
  Download,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export function CVContent() {
  const githubLink = socialLinks.find((l) => l.platform === "GitHub")?.href || "#";
  const linkedinLink = socialLinks.find((l) => l.platform === "LinkedIn")?.href || "#";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="border-b bg-card/50">
        <div className="container max-w-4xl py-12 md:py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {siteConfig.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                Full-Stack Developer | Next.js & Python Engineer | Applied AI Student
              </p>
              <p className="text-sm text-muted-foreground">
                {siteConfig.location} •{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="underline hover:text-primary"
                >
                  {siteConfig.email}
                </a>
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <Link href={githubLink} target="_blank">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <Link href={linkedinLink} target="_blank">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <Link href="/projects">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Projects
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full"
                onClick={() => window.print()}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => window.print()}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl space-y-12 py-12 md:py-16">
        {/* Summary */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <FileText className="h-5 w-5 text-primary" />
            Summary
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Applied AI student at Vilnius Gediminas Technical University (VILNIUS TECH)
            with hands-on full-stack development experience. Built production-ready web
            and mobile applications end-to-end using Next.js, Python/FastAPI, Supabase,
            and Flutter. Seeking a Full-Stack Developer / Software Engineer internship to
            build complete products, work across the stack, and contribute to real-world
            services.
          </p>
        </section>

        {/* Education */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Education</h2>
          <div className="space-y-4">
            <div className="border-l-2 border-primary/30 pl-4">
              <h3 className="font-semibold">BSc in Applied Artificial Intelligence</h3>
              <p className="text-sm text-muted-foreground">
                Vilnius Gediminas Technical University (VILNIUS TECH), Vilnius, Lithuania
              </p>
              <p className="text-sm text-muted-foreground">
                2023 – Present (Expected 2027)
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Erasmus Exchange Semester — Lisbon, Portugal (5 months)</li>
                <li>
                  Relevant Coursework: Operating Systems, Databases, Machine Learning,
                  Scanning & Recognition Systems, Robots & Intelligent Automation, Theory
                  of Algorithms
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Experience</h2>
          <div className="space-y-4">
            <div className="border-l-2 border-primary/30 pl-4">
              <h3 className="font-semibold">Junior IT Specialist</h3>
              <p className="text-sm text-muted-foreground">
                Al Tayef Overseas Ltd. • Dhaka, Bangladesh
              </p>
              <p className="text-sm text-muted-foreground">2019 – 2021</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>
                  Supported production IT systems and resolved software/hardware issues
                  for daily operations
                </li>
                <li>
                  Designed and launched the company website using WordPress; managed
                  hosting and content updates
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Selected Projects */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Selected Projects</h2>
          <div className="space-y-6">
            <div className="border-l-2 border-primary/30 pl-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">
                  LexNova Legal Platform — Full-Stack Web & Mobile App
                </h3>
                <Link
                  href="https://lexnovaeu.xyz"
                  target="_blank"
                  className="text-sm text-primary hover:underline"
                >
                  Live ↗
                </Link>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Next.js, TypeScript, Supabase, Flutter, Vercel
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>
                  Built a complete law firm platform with public website, lead capture,
                  appointment requests, blog/FAQ, and an admin dashboard
                </li>
                <li>
                  Implemented authentication and role-based access control (RBAC) using
                  Supabase; managed PostgreSQL database and real-time updates
                </li>
                <li>
                  Integrated Cloudinary for media management; deployed on Vercel with PWA
                  support
                </li>
                <li>Developed companion Android app for internal use</li>
              </ul>
            </div>

            <div className="border-l-2 border-primary/30 pl-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">
                  EduFriends Global — Multi-Role Education Consultancy Platform
                </h3>
                <Link
                  href="https://edufriendsglobal.com"
                  target="_blank"
                  className="text-sm text-primary hover:underline"
                >
                  Live ↗
                </Link>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Node.js, JavaScript, MongoDB, Firebase, Flutter, Cloudinary
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>
                  Built and maintained a multi-role platform (Owner/Admin/Country
                  Admin/Student) over 2+ years from scratch
                </li>
                <li>
                  Implemented complete backend logic: authentication, role-based access
                  control (RBAC), and core data models
                </li>
                <li>
                  Grew platform to 500+ monthly web visits and 100+ Android installs
                </li>
              </ul>
            </div>

            <div className="border-l-2 border-primary/30 pl-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">
                  GenAI Chatbot Platform — RAG + Safety + OCR Workflow
                </h3>
                <Link
                  href="https://github.com/dhossain-ai/genai-chatbot-platform"
                  target="_blank"
                  className="text-sm text-primary hover:underline"
                >
                  Repo ↗
                </Link>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Next.js, TypeScript, FastAPI, Python, Ollama, Docker, CI/CD
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>
                  Built a developer-friendly GenAI platform with retrieval-augmented
                  generation (RAG) and deterministic safety/triage layer
                </li>
                <li>
                  Implemented document intake pipeline with OCR and scan-quality scoring;
                  created review/approve workflow
                </li>
                <li>
                  Containerized the full stack with Docker Compose; added health checks
                  and CI automation
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Technical Skills */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Technical Skills</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Frontend</h3>
              <p className="text-sm">Next.js, React, Tailwind CSS, HTML/CSS</p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Backend</h3>
              <p className="text-sm">Python (FastAPI), Node.js, REST APIs, Auth/RBAC</p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Mobile</h3>
              <p className="text-sm">Flutter, Dart</p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                Databases
              </h3>
              <p className="text-sm">PostgreSQL (Supabase), MongoDB, Firebase</p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">DevOps</h3>
              <p className="text-sm">
                Docker, Docker Compose, CI/CD (GitHub Actions), Vercel
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                Languages
              </h3>
              <p className="text-sm">Python, JavaScript, TypeScript, Dart</p>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Certifications</h2>
          <ul className="space-y-2">
            <li className="text-sm">
              <span className="font-medium">Google (Coursera)</span> — Technical Support
              Fundamentals
            </li>
            <li className="text-sm">
              <span className="font-medium">Google (Coursera)</span> — The Bits and Bytes
              of Computer Networking
            </li>
            <li className="text-sm">
              <span className="font-medium">ATHENA</span> — Advanced Data Technologies
              Super Summer School
            </li>
          </ul>
        </section>

        {/* Languages */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Languages</h2>
          <ul className="grid gap-2 sm:grid-cols-3">
            <li className="text-sm">
              <span className="font-medium">Bengali</span> — Native
            </li>
            <li className="text-sm">
              <span className="font-medium">English</span> — Professional
            </li>
            <li className="text-sm">
              <span className="font-medium">Hindi</span> — Conversational
            </li>
          </ul>
        </section>

        {/* Contact CTA */}
        <section className="border-t pt-8">
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-bold">Let's Connect</h2>
            <p className="text-muted-foreground">
              I'm open to internships, freelance projects, and full-time roles.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Me
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="/projects">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Projects
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
