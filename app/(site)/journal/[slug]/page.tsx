
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPostBySlug, getPublishedPosts } from '@/lib/blog'
import { buildMetadata } from '@/lib/seo'
import { PostView } from '@/components/post-view'

type PageProps = {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const posts = await getPublishedPosts('journal')
    return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata(
    props: PageProps
): Promise<Metadata | undefined> {
    const params = await props.params
    const post = await getPostBySlug(params.slug)
    if (!post || post.type !== 'journal') return undefined

    return buildMetadata({
        title: post.seo_title || post.title,
        description: post.seo_description || post.excerpt,
        path: `/journal/${params.slug}`,
        image: post.cover_image || undefined,
    })
}

export default async function JournalPostPage(props: PageProps) {
    const params = await props.params
    const post = await getPostBySlug(params.slug)

    if (!post || post.type !== 'journal') {
        notFound()
    }

    return (
        <PostView
            post={post}
            backHref="/journal"
            backLabel="Back to journal"
        />
    )
}
