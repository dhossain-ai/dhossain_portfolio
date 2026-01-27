
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectView } from '@/components/project-view'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

type PageProps = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    props: PageProps
): Promise<Metadata | undefined> {
    const params = await props.params
    const supabase = await createClient()

    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', params.slug)
        .eq('status_public', 'published')
        .single()

    if (!project) return undefined

    return buildMetadata({
        title: project.seo_title || project.title,
        description: project.seo_description || project.summary,
        path: `/projects/${project.slug}`,
        image: project.cover_image || undefined,
    })
}

export default async function ProjectDetailPage(props: PageProps) {
    const params = await props.params
    const supabase = await createClient()

    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', params.slug)
        .eq('status_public', 'published')
        .single()

    if (!project) {
        notFound()
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProjectView project={project} />
        </div>
    )
}
