
import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export type Project = {
    id: string
    title: string
    slug: string
    year: number
    subtitle?: string | null
    summary: string
    overview: string

    status_public: 'draft' | 'published'
    badge?: string | null
    featured: boolean
    published_at?: string | null

    role?: string | null
    project_type?: string | null

    platforms: string[]
    stack: string[]
    tags: string[]

    live_url?: string | null
    code_url?: string | null
    android_url?: string | null
    ios_url?: string | null

    key_features: string[]
    challenges: string[]
    contributions: string[]

    cover_image?: string | null

    updated_at: string
}

export const getPublishedProjects = cache(async () => {
    const supabase = await createClient()
    const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('status_public', 'published')
        .order('featured', { ascending: false })
        .order('year', { ascending: false })
        .order('updated_at', { ascending: false })

    return (data as Project[]) || []
})

export const getProjectBySlug = cache(async (slug: string) => {
    const supabase = await createClient()
    const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('status_public', 'published')
        .single()

    return data as Project | null
})
