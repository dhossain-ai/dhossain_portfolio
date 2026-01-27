
import { createClient } from '@/lib/supabase/client'
import readingTime from 'reading-time'

export type Post = {
    id: string
    title: string
    slug: string
    excerpt: string
    content_markdown: string
    cover_image: string | null
    tags: string[]
    status: 'draft' | 'published'
    type: 'blog' | 'journal'
    published_at: string | null
    updated_at: string
    created_at: string
    seo_title: string | null
    seo_description: string | null
    canonical_url: string | null
    reading_time: number | null
    featured: boolean
}

// Client for reuse
const supabase = createClient()

export async function getPublishedPosts(type: 'blog' | 'journal' = 'blog') {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .eq('type', type)
        .order('published_at', { ascending: false })

    if (error) {
        console.error('Error fetching posts:', error)
        return []
    }

    // Calculate reading time on the fly if null (migration fallback) 
    // or trust DB if populated. 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map((post) => ({
        ...post,
        readingTime: post.reading_time ? `${post.reading_time} min read` : readingTime(post.content_markdown).text
    }))
}

export async function getPostBySlug(slug: string) {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) {
        return null
    }

    // If draft, only admin should see it - but this function is generally for public pages.
    // We can handle status check in the page component or here.
    // For now, return data and let page decide (access control is also on RLS level).

    return {
        ...data,
        readingTime: data.reading_time ? `${data.reading_time} min read` : readingTime(data.content_markdown).text
    } as Post & { readingTime: string }
}

export async function getRecentPosts(limit = 3, type: 'blog' | 'journal' = 'blog') {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .eq('type', type)
        .order('published_at', { ascending: false })
        .limit(limit)

    if (error) return []
    return data
}
