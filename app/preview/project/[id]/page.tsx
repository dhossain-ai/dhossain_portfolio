
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectView } from '@/components/project-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
    title: 'Preview Project - Shahadat Hossain',
}

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function ProjectPreviewPage(props: PageProps) {
    const params = await props.params
    const supabase = await createClient()

    // 1. Verify Admin Auth
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        redirect('/')
    }

    // 2. Fetch Project (Allowing draft status)
    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!project) {
        notFound()
    }

    return (
        <div className="relative">
            <div className="sticky top-0 z-50 w-full bg-yellow-500/90 text-black text-center py-2 font-bold text-sm backdrop-blur-sm">
                PREVIEW MODE - {project.status_public.toUpperCase()}
            </div>
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProjectView project={project} />
            </div>
        </div>
    )
}
