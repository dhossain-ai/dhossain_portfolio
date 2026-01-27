
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { FileText, Eye, Clock, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminPage() {
    const supabase = await createClient()

    const { count: totalPosts } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })

    const { count: publishedPosts } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')

    const { count: draftPosts } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft')

    const { data: recentPosts } = await supabase
        .from('posts')
        .select('id, title, status, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5)

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Overview of your blog content.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/posts/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Post
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Posts</h3>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{totalPosts || 0}</div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Published</h3>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{publishedPosts || 0}</div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Drafts</h3>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{draftPosts || 0}</div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Recent Activity</h3>
                <div className="rounded-md border bg-card">
                    {recentPosts && recentPosts.length > 0 ? (
                        <div className="divide-y">
                            {recentPosts.map((post) => (
                                <div key={post.id} className="flex items-center justify-between p-4">
                                    <div className="grid gap-1">
                                        <Link href={`/admin/posts/${post.id}`} className="font-medium hover:underline">
                                            {post.title}
                                        </Link>
                                        <p className="text-sm text-muted-foreground">
                                            Updated {new Date(post.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className={`text-xs px-2 py-1 rounded-full capitalize ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {post.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            No posts implementation yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
