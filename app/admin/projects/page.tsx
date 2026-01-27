
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react'
import { deleteProject } from './actions'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ProjectsPage({
    searchParams,
}: {
    searchParams: SearchParams
}) {
    const supabase = await createClient()
    const { filter } = await searchParams

    let query = supabase
        .from('projects')
        .select('id, title, status_public, updated_at, slug, year, role')
        .order('updated_at', { ascending: false })

    if (filter === 'published') {
        query = query.eq('status_public', 'published')
    } else if (filter === 'draft') {
        query = query.eq('status_public', 'draft')
    }

    const { data: projects } = await query

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
                    <p className="text-muted-foreground">Manage your portfolio projects.</p>
                </div>
                <Link href="/admin/projects/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Project
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-2 border-b pb-4 overflow-x-auto">
                <Link href="/admin/projects" className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${!filter ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                    All
                </Link>
                <Link href="/admin/projects?filter=published" className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${filter === 'published' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                    Published
                </Link>
                <Link href="/admin/projects?filter=draft" className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${filter === 'draft' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                    Drafts
                </Link>
            </div>

            <div className="grid gap-4">
                {projects?.map((project) => (
                    <div key={project.id} className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm transition-all sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex h-2 w-2 rounded-full ${project.status_public === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                <span className="text-sm font-medium text-muted-foreground capitalize">{project.status_public}</span>
                            </div>
                            <Link href={`/admin/projects/${project.id}`} className="text-lg font-semibold hover:underline">
                                {project.title}
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{project.year}</span>
                                <span>•</span>
                                <span>{project.role}</span>
                                <span>•</span>
                                <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Preview Button if we want quick access, though editor has it too */}
                            {project.status_public === 'published' && (
                                <a href={`/projects/${project.slug}`} target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </a>
                            )}

                            <Link href={`/admin/projects/${project.id}`}>
                                <Button variant="outline" size="sm" className="h-8">
                                    <Edit className="mr-2 h-3.5 w-3.5" />
                                    Edit
                                </Button>
                            </Link>
                            {/* We need to implement deleteProject action properly or use a client component for delete to handle confirmation */}
                            <form action={deleteProject.bind(null, project.id)}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                ))}
                {projects?.length === 0 && (
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                        No projects found.
                    </div>
                )}
            </div>
        </div>
    )
}
