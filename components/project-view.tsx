import Link from 'next/link'
import { ArrowLeft, ExternalLink, Github, Smartphone, AlertCircle, Award, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TechBadge } from '@/components/tech-badge'
import { cn } from '@/lib/utils'
import { ProjectGalleryHero } from '@/components/projects/project-gallery-hero'

// Define the shape that this component expects. 
// It should be close to the DB shape but we can handle nulls here.
export type ProjectViewProps = {
    project: {
        title: string
        subtitle?: string | null
        summary: string
        overview: string
        slug: string

        status_public: string
        badge?: string | null

        role?: string | null
        project_type?: string | null

        platforms: string[]
        stack: string[]
        tags?: string[]

        live_url?: string | null
        code_url?: string | null
        android_url?: string | null
        ios_url?: string | null

        key_features: string[]
        challenges: string[]
        contributions: string[]

        cover_image?: string | null
        gallery_images?: string[]
    }
}

export function ProjectView({ project }: ProjectViewProps) {
    // Icons for quick facts
    const RoleIcon = Award;
    const TypeIcon = Database;

    const links = [
        { label: 'Live', url: project.live_url, kind: 'primary' },
        { label: 'Code', url: project.code_url, kind: 'secondary' },
        { label: 'Android', url: project.android_url, kind: 'secondary' },
        { label: 'iOS', url: project.ios_url, kind: 'secondary' },
    ].filter(l => l.url) // Filter out null/empty URLs

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
                            project.badge === "Live" || project.status_public === 'published' // Fallback logic
                                ? "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
                                : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        )}>
                            {project.badge === "Beta" && <AlertCircle className="mr-1.5 h-3.5 w-3.5" />}
                            {project.badge || (project.status_public === 'published' ? 'Live' : 'Draft')}
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                        {project.title}
                    </h1>
                    {project.subtitle && (
                        <p className="max-w-2xl text-xl text-muted-foreground md:text-2xl">
                            {project.subtitle}
                        </p>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4">
                    {links.map((link) => {
                        let Icon = ExternalLink;
                        if (link.label.toLowerCase().includes("code") || link.label.toLowerCase().includes("github")) Icon = Github;
                        if (link.label.toLowerCase().includes("android") || link.label.toLowerCase().includes("app")) Icon = Smartphone;
                        if (link.label.toLowerCase().includes("ios")) Icon = Smartphone;

                        return (
                            <Button key={link.url} asChild size="lg" variant={link.kind === "primary" ? undefined : "outline"} className="rounded-full">
                                <Link href={link.url!} target="_blank" rel="noopener noreferrer">
                                    {link.label}
                                    <Icon className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        );
                    })}
                </div>

                {/* Gallery Hero (Handles both Cover + Gallery Images) */}
                <ProjectGalleryHero
                    title={project.title}
                    coverImage={project.cover_image}
                    galleryImages={project.gallery_images}
                />
            </section>

            {/* Quick Facts Grid */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <RoleIcon className="h-4 w-4" />
                        <span className="font-semibold uppercase tracking-wider">Role</span>
                    </div>
                    <p className="font-medium text-foreground">{project.role || 'Developer'}</p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <TypeIcon className="h-4 w-4" />
                        <span className="font-semibold uppercase tracking-wider">Type</span>
                    </div>
                    <p className="font-medium text-foreground">{project.project_type || 'Project'}</p>
                </div>

                <div className="col-span-full rounded-2xl border border-border/60 bg-card/50 p-5 lg:col-span-2">
                    <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-semibold uppercase tracking-wider">Stack</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {project.stack.map(t => <TechBadge key={t} label={t} />)}
                    </div>
                </div>
            </section >

            {/* Main Content Details */}
            < div className="grid gap-12 lg:grid-cols-[2fr,1fr]" >
                <div className="space-y-12">
                    {/* Overview */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-foreground">Overview</h2>
                        <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                            {project.overview}
                        </p>
                    </section>

                    {/* Key Features */}
                    {project.key_features && project.key_features.length > 0 && (
                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">Key Features</h2>
                            <ul className="grid gap-3 sm:grid-cols-1">
                                {project.key_features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Challenges & Learnings */}
                    {project.challenges && project.challenges.length > 0 && (
                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">Challenges & Learnings</h2>
                            <ul className="space-y-3">
                                {project.challenges.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                {/* Sidebar (What I Did) */}
                {
                    project.contributions && project.contributions.length > 0 && (
                        <div className="space-y-8">
                            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                                <h3 className="mb-4 font-semibold text-foreground">My Contributions</h3>
                                <ul className="space-y-4">
                                    {project.contributions.map((item, i) => (
                                        <li key={i} className="text-sm text-muted-foreground">
                                            • {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )
                }
            </div >
        </div >
    )
}
