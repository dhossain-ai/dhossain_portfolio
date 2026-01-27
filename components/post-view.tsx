
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react'
import Image from 'next/image'
import { Post } from '@/lib/blog'
import { compileMDX } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/mdx-components'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'

type PostViewProps = {
    post: Post & { readingTime: string }
    backHref: string
    backLabel: string
}

export async function PostView({ post, backHref, backLabel }: PostViewProps) {
    // Compile MDX
    const { content } = await compileMDX({
        source: post.content_markdown,
        components: mdxComponents,
        options: {
            parseFrontmatter: false,
            mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                    [rehypePrettyCode, {
                        theme: 'github-dark',
                        keepBackground: false,
                    }]
                ],
            },
        },
    })

    // JSON-LD Schema
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.seo_title || post.title,
        description: post.seo_description || post.excerpt,
        datePublished: post.published_at,
        dateModified: post.updated_at,
        articleSection: post.type === 'journal' ? 'Journal' : 'Tech Blog',
        author: {
            '@type': 'Person',
            name: 'Shahadat Hossain',
            url: 'https://dhossian.com'
        },
        image: post.cover_image || undefined,
        keywords: post.tags?.join(', '),
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://dhossian.com/${post.type === 'journal' ? 'journal' : 'blog'}/${post.slug}`
        }
    }

    return (
        <article className="container max-w-3xl py-10 lg:py-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <header className="space-y-6">
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {backLabel}
                </Link>
                <h1 className="text-4xl font-semibold tracking-tight">
                    {post.title}
                </h1>
                <p className="text-base text-muted-foreground">
                    {post.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        {new Date(post.published_at || post.created_at).toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        {post.readingTime}
                    </span>
                </div>

                {post.cover_image && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
                        <Image
                            src={post.cover_image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}
            </header>

            <div className="prose prose-invert max-w-none prose-h2:text-foreground prose-p:text-muted-foreground dark:prose-invert">
                {content}
            </div>
        </article>
    )
}
