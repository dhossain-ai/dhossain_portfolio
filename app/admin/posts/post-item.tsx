
'use client'

import React, { useTransition } from 'react'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deletePost } from './actions'
import { toast } from 'sonner' // Assuming sonner is installed as seen in package.json

type PostItemProps = {
    post: {
        id: string
        title: string
        status: string
        updated_at: string
        slug: string
    }
    basePath?: string
}

export function PostItem({ post, basePath = '/admin/posts' }: PostItemProps) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (!confirm('Are you sure you want to delete this post?')) return

        startTransition(async () => {
            try {
                await deletePost(post.id)
                toast.success('Post deleted')
            } catch {
                toast.error('Failed to delete post')
            }
        })
    }

    return (
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm transition-all sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className={`inline-flex h-2 w-2 rounded-full ${post.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="text-sm font-medium text-muted-foreground capitalize">{post.status}</span>
                </div>
                <Link href={`${basePath}/${post.id}`} className="text-lg font-semibold hover:underline">
                    {post.title}
                </Link>
                <p className="text-xs text-muted-foreground">
                    Updated {new Date(post.updated_at).toLocaleDateString()}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Link href={`${basePath}/${post.id}`}>
                    <Button variant="outline" size="sm" className="h-8">
                        <Edit className="mr-2 h-3.5 w-3.5" />
                        Edit
                    </Button>
                </Link>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleDelete} disabled={isPending}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
