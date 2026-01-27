
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { PostItem } from '../posts/post-item'
import { createJournalPost } from '../posts/actions'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function JournalPage({
    searchParams,
}: {
    searchParams: SearchParams
}) {
    const supabase = await createClient()
    const { filter } = await searchParams

    let query = supabase
        .from('posts')
        .select('id, title, status, updated_at, slug')
        .eq('type', 'journal') // Filter by journal type
        .order('updated_at', { ascending: false })

    if (filter === 'published') {
        query = query.eq('status', 'published')
    } else if (filter === 'draft') {
        query = query.eq('status', 'draft')
    }

    const { data: posts } = await query

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Journal</h2>
                    <p className="text-muted-foreground">Manage your travel and life updates.</p>
                </div>
                <form action={createJournalPost}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Entry
                    </Button>
                </form>
            </div>

            <div className="flex items-center gap-2 border-b pb-4 overflow-x-auto">
                <Link href="/admin/journal" className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${!filter ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                    All
                </Link>
                <Link href="/admin/journal?filter=published" className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${filter === 'published' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                    Published
                </Link>
                <Link href="/admin/journal?filter=draft" className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${filter === 'draft' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                    Drafts
                </Link>
            </div>

            <div className="grid gap-4">
                {posts?.map((post) => (
                    // We can reuse PostItem, but we need to ensure it links to /admin/journal/[id] or adapts
                    // Let's check PostItem implementation. If it hardcodes /admin/posts/[id], we might need to update it or pass base path.
                    <PostItem key={post.id} post={post} basePath="/admin/journal" />
                ))}
                {posts?.length === 0 && (
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                        No journal entries found.
                    </div>
                )}
            </div>
        </div>
    )
}
