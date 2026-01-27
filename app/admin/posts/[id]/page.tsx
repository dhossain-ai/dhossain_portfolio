
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PostForm } from '../post-form'
import { Post } from '@/lib/blog'

type Params = Promise<{ id: string }>

export default async function EditPostPage(props: { params: Params }) {
    const params = await props.params
    const supabase = await createClient()

    const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!post) {
        notFound()
    }

    return (
        <div className="max-w-5xl mx-auto">
            <PostForm post={post as Post} />
        </div>
    )
}
