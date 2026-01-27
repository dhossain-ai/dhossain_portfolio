
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProjectForm } from '../project-form'

type Params = Promise<{ id: string }>

export default async function EditProjectPage(props: { params: Params }) {
    const params = await props.params
    const supabase = await createClient()

    if (params.id === 'new') {
        return (
            <div className="max-w-5xl mx-auto">
                <ProjectForm />
            </div>
        )
    }

    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!project) {
        notFound()
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Cast strict DB Type to loose form type if needed, but they should match mostly */}
            <ProjectForm project={project} />
        </div>
    )
}
