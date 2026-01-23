import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Smartphone, AlertCircle, Database, Award } from "lucide-react";
import { projects } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { TechBadge } from "@/components/tech-badge";
import { cn } from "@/lib/utils";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params;
    const project = projects.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    // Icons for quick facts
    const RoleIcon = Award;
    const TypeIcon = Database; // Placeholder context
    // LocationIcon removed as it was unused or verify usage

    return (
        <div className="space-y-16 py-8 md:py-12">
            {/* Back Navigation */}
            <div className="max-w-4xl">
                <Button asChild variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground">
                    <Link href="/projects">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to projects
                    </Link>
                </Button>
            </div>

            {/* Hero Section */}
            <section className="space-y-8">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                            project.statusBadge === "Live"
                                ? "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
                                : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        )}>
                            {project.statusBadge === "Beta" && <AlertCircle className="mr-1.5 h-3.5 w-3.5" />}
                            {project.statusBadge}
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                        {project.title}
                    </h1>
                    <p className="max-w-2xl text-xl text-muted-foreground md:text-2xl">
                        {project.tagline}
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4">
                    {project.links.map((link) => {
                        let Icon = ExternalLink;
                        if (link.label.toLowerCase().includes("code") || link.label.toLowerCase().includes("github")) Icon = Github;
                        if (link.label.toLowerCase().includes("play store") || link.label.toLowerCase().includes("app")) Icon = Smartphone;

                        return (
                            <Button key={link.url} asChild size="lg" variant={link.kind === "primary" ? undefined : "outline"} className="rounded-full">
                                <Link href={link.url} target="_blank" rel="noopener noreferrer">
                                    {link.label}
                                    <Icon className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        );
                    })}
                </div>
            </section>

            {/* Quick Facts Grid */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <RoleIcon className="h-4 w-4" />
                        <span className="font-semibold uppercase tracking-wider">Role</span>
                    </div>
                    <p className="font-medium text-foreground">{project.quickFacts.role}</p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <TypeIcon className="h-4 w-4" />
                        <span className="font-semibold uppercase tracking-wider">Type</span>
                    </div>
                    <p className="font-medium text-foreground">{project.quickFacts.type}</p>
                </div>

                <div className="col-span-full rounded-2xl border border-border/60 bg-card/50 p-5 lg:col-span-2">
                    <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-semibold uppercase tracking-wider">Stack</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {project.tech.map(t => <TechBadge key={t} label={t} />)}
                    </div>
                </div>
            </section>

            {/* Main Content Details */}
            <div className="grid gap-12 lg:grid-cols-[2fr,1fr]">
                <div className="space-y-12">
                    {/* Overview */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-foreground">Overview</h2>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            {project.description}
                        </p>
                    </section>

                    {/* Key Features */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-foreground">Key Features</h2>
                        <ul className="grid gap-3 sm:grid-cols-1">
                            {project.keyFeatures.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                    <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Challenges & Learnings */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-foreground">Challenges & Learnings</h2>
                        <ul className="space-y-3">
                            {project.challengesAndLearnings.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                    <div className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* Sidebar (What I Did) */}
                <div className="space-y-8">
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="mb-4 font-semibold text-foreground">My Contributions</h3>
                        <ul className="space-y-4">
                            {project.whatIDid.map((item, i) => (
                                <li key={i} className="text-sm text-muted-foreground">
                                    • {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {project.quickFacts.usage && (
                        <div className="rounded-3xl border border-border/50 bg-secondary/20 p-6">
                            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Real World Impact</h3>
                            <p className="text-lg font-medium text-foreground">{project.quickFacts.usage}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
