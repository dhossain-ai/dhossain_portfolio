
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Post } from '@/lib/blog'

export async function deletePost(postId: string) {
    const supabase = await createClient()

    // Verify admin again (RLS covers it, but good for safety)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

    if (error) {
        throw new Error('Failed to delete post')
    }

    revalidatePath('/admin/posts')
    revalidatePath('/blog') // Revalidate public blog list
}

// Internal helper
async function createPostInternal(type: 'blog' | 'journal') {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('posts')
        .insert({
            title: 'Untitled Post',
            slug: `untitled-${Date.now()}`,
            excerpt: '',
            content_markdown: '',
            status: 'draft',
            type: type,
            tags: [],
            updated_at: new Date().toISOString()
        })
        .select('id')
        .single()

    if (error) {
        throw new Error('Failed to create post')
    }

    const basePath = type === 'journal' ? '/admin/journal' : '/admin/posts'
    redirect(`${basePath}/${data.id}`)
}

export async function createBlogPost() {
    await createPostInternal('blog')
}

export async function createJournalPost() {
    await createPostInternal('journal')
}

// We need a specific type for update payload that matches Supabase schema
// Form formats tags to string[] so it matches Partial<Post> effectively
export async function updatePost(postId: string, data: Partial<Post>) {
    const supabase = await createClient()
    console.log('Update Post Data:', data)

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('posts')
        .update({
            ...data,
            updated_at: new Date().toISOString(),
            status: data.status, // Ensure status is explicitly passed
            published_at: data.status === 'published' ? new Date().toISOString() : null // Update published_at if publishing
        })
        .eq('id', postId)

    if (error) {
        console.error('Supabase Update Error:', error)
        throw new Error('Failed to update post: ' + error.message)
    }

    revalidatePath('/admin/posts')
    revalidatePath(`/admin/posts/${postId}`)
    revalidatePath('/blog') // Revalidate public blog
    revalidatePath(`/blog/${data.slug}`) // Revalidate specific post
}
