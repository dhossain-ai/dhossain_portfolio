
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FilterX } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Projects",
  description:
    "Selected AI, data, and web projects spanning product experiments, platform foundations, and developer tooling.",
  path: "/projects",
});

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const tags = Array.from(new Set(projects.flatMap((project) => project.tech))).sort();

export default async function ProjectsPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : undefined;
  const stack = normalizeParam(params?.stack);

  const filtered = stack
    ? projects.filter((project) =>
      project.tech.map((item) => item.toLowerCase()).includes(stack.toLowerCase()),
    )
    : projects;

  const show404 = stack && filtered.length === 0;
  if (show404) {
    redirect("/projects");
  }

  return (
    <div className="space-y-12">
      <SectionHeader
        eyebrow="Project archive"
        title="Projects that ship"
        description="From proof-of-concept to shipping versions, here is a curated collection of the platforms and apps I’ve built or maintained."
      />

      <div className="flex flex-wrap items-center gap-2">
        <FilterPill href="/projects" active={!stack}>
          All
        </FilterPill>
        {tags.map((tag) => (
          <FilterPill
            key={tag}
            href={`/projects?stack=${encodeURIComponent(tag)}`}
            active={stack === tag}
          >
            {tag}
          </FilterPill>
        ))}
        {stack && (
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="rounded-2xl border border-border/60 text-muted-foreground hover:text-foreground"
          >
            <Link href="/projects">
              <FilterX className="mr-1.5 h-4 w-4" />
              Clear
            </Link>
          </Button>
        )}
      </div>

      <ProjectsGrid projects={filtered} />
    </div>
  );
}

function normalizeParam(param?: string | string[]) {
  if (!param) return undefined;
  return Array.isArray(param) ? param[0] : param;
}

type FilterPillProps = {
  href: string;
  active?: boolean;
  children: ReactNode;
};

function FilterPill({ href, active, children }: FilterPillProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full border border-border/60 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary",
        active && "border-primary/70 bg-primary/10 text-primary",
      )}
    >
      {children}
    </Link>
  );
}

