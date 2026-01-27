
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PostView } from '@/components/post-view'
import { Metadata } from 'next'

// SEO: prevent indexing of preview pages
export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
    title: 'Preview - Shahadat Hossain',
}

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function PreviewPage(props: PageProps) {
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

    // 2. Fetch Post (Allowing draft status)
    const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!post) {
        notFound()
    }

    // 3. Mock reading time if missing (since it's computed on lib fetch usually)
    // We can just calculate it roughly or import readingTime lib if we want to be precise
    // For preview, a rough estimate or re-using lib function is fine, but lib function `getPublishedPosts` filters by status.
    // `getPostBySlug` also filters status usually or we modified it?
    // Let's use reading-time lib directly here or mock it.

    // We can rely on PostView to render it, but PostView expects `readingTime` string.
    // We'll calculate it simple here.
    const words = post.content_markdown?.split(/\s+/g).length || 0;
    const minutes = Math.ceil(words / 200);
    const readingTime = `${minutes} min read`;

    const postWithReadingTime = {
        ...post,
        readingTime
    }

    const backHref = post.type === 'journal' ? '/admin/journal' : '/admin/posts'
    const backLabel = "Back to Admin"

    return (
        <div className="relative">
            <div className="sticky top-0 z-50 w-full bg-yellow-500/90 text-black text-center py-2 font-bold text-sm backdrop-blur-sm">
                PREVIEW MODE - {post.status.toUpperCase()}
            </div>
            <PostView
                post={postWithReadingTime}
                backHref={backHref}
                backLabel={backLabel}
            />
        </div>
    )
}
