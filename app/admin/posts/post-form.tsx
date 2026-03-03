
'use client'

import { useTransition, useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { postSchema, type PostFormValues } from './schema'
import { createPost, updatePost } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, Save, Loader2, ImageIcon, X, ExternalLink, CheckCircle2 } from 'lucide-react'
import { Post } from '@/lib/blog'
import { EditorToolbar } from './editor-toolbar'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'

type PostFormProps = {
    post: Post
    isJournal?: boolean
}

export function PostForm({ post, isJournal = false }: PostFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
    
    const isEditing = !!post?.id

    const [saveState, setSaveState] = useState<'idle' | 'unsaved' | 'saving' | 'saved' | 'failed'>('idle')
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [initialLoad, setInitialLoad] = useState(true)

    const form = useForm({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content_markdown: post.content_markdown,
            cover_image: post.cover_image,
            tags: post.tags ? post.tags.join(', ') : '',
            status: post.status,
            type: post.type || 'blog',
            seo_title: post.seo_title,
            seo_description: post.seo_description,
            canonical_url: post.canonical_url,
            featured: post.featured ?? false,
        },
    })

    // Watch content for preview
    const contentMarkdown = form.watch('content_markdown')

    const onSubmit = (values: PostFormValues) => {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        startTransition(async () => {
            try {
                const formattedData = {
                    ...values,
                    tags: values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : []
                }
                
                if (isEditing && post?.id) {
                    setSaveState('saving')
                    await updatePost(post.id, formattedData)
                    setSaveState('saved')
                    toast.success('Post updated')
                } else {
                    await createPost(formattedData)
                    toast.success('Post created')
                }
                router.refresh()
            } catch (error) {
                console.error(error)
                setSaveState('failed')
                toast.error('Failed to save post')
            }
        })
    }

    // Clear initial load flag
    useEffect(() => { setInitialLoad(false) }, [])

    // Auto-save effect
    const watchedValues = form.watch()
    useEffect(() => {
        if (initialLoad) return
        if (!isEditing) return

        setSaveState('unsaved')
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = setTimeout(async () => {
            setSaveState('saving')
            try {
                const values = form.getValues() as PostFormValues
                const formattedData = {
                    ...values,
                    tags: values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : []
                }
                await updatePost(post!.id!, formattedData)
                setSaveState('saved')
            } catch (error) {
                console.error('Autosave error', error)
                setSaveState('failed')
            }
        }, 1500)

        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        }
    }, [watchedValues, isEditing, initialLoad, post])

    // Unsaved changes leave warning
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (saveState === 'unsaved' || saveState === 'saving') {
                e.preventDefault()
                e.returnValue = ''
            }
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [saveState])

    const handleSlugGenerate = () => {
        const title = form.getValues('title')
        if (title) {
            const slug = title.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            form.setValue('slug', slug)
        }
    }

    const handleEditorInsert = (text: string) => {
        const textarea = document.getElementById('content_markdown') as HTMLTextAreaElement
        if (!textarea) {
            const current = form.getValues('content_markdown') || ''
            form.setValue('content_markdown', current + '\n' + text)
            return
        }

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const value = textarea.value

        const newValue = value.substring(0, start) + text + value.substring(end)

        form.setValue('content_markdown', newValue, { shouldDirty: true })

        // Restore focus/cursor (next tick)
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + text.length, start + text.length)
        }, 0)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCoverUpload = (result: any) => {
        if (result.info?.secure_url) {
            form.setValue('cover_image', result.info.secure_url, { shouldDirty: true })
        }
    }

    // Handle external preview - open in new tab
    const handleExternalPreview = () => {
        if (!post.id) {
            toast.error("Please save the draft first to preview")
            return
        }
        window.open(`/preview/post/${post.id}`, '_blank')
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <input type="hidden" {...form.register('type')} />
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b">
                <div className="flex items-center gap-4">
                    <Link href={isJournal ? "/admin/journal" : "/admin/posts"}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold">{post?.title || 'New Post'}</h2>
                            {isEditing && (
                                <span className="flex items-center text-xs font-medium">
                                    {saveState === 'saving' && <span className="flex items-center text-yellow-600 dark:text-yellow-500"><Loader2 className="mr-1 h-3 w-3 animate-spin"/> Saving...</span>}
                                    {saveState === 'saved' && <span className="flex items-center text-green-600 dark:text-green-500"><CheckCircle2 className="mr-1 h-3 w-3"/> Saved</span>}
                                    {saveState === 'unsaved' && <span className="text-muted-foreground">Unsaved changes</span>}
                                    {saveState === 'failed' && <span className="text-destructive">Save failed</span>}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${form.watch('status') === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                {form.watch('status') === 'published' ? 'Published' : 'Draft'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isEditing && (
                        <Button type="button" variant="outline" size="sm" onClick={handleExternalPreview}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Preview
                        </Button>
                    )}
                    
                    {isEditing ? (
                        form.watch('status') === 'draft' ? (
                            <Button type="button" size="sm" onClick={() => {
                                form.setValue('status', 'published', { shouldDirty: true })
                                form.handleSubmit(onSubmit)()
                            }} disabled={isPending || saveState === 'saving'}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Publish
                            </Button>
                        ) : (
                            <Button type="button" size="sm" onClick={() => {
                                form.handleSubmit(onSubmit)()
                            }} disabled={isPending || saveState === 'saved' || saveState === 'idle'}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update
                            </Button>
                        )
                    ) : (
                        <Button type="submit" size="sm" disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Create Draft
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input {...form.register('title')} id="title" placeholder="Post title" />
                        {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="slug">Slug</Label>
                            <Button type="button" variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary" onClick={handleSlugGenerate}>
                                Generate from title
                            </Button>
                        </div>
                        <Input {...form.register('slug')} id="slug" placeholder="post-slug" />
                        {form.formState.errors.slug && <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea {...form.register('excerpt')} id="excerpt" placeholder="Short description for SEO and cards" className="h-20" />
                        <p className="text-xs text-muted-foreground text-right">{form.watch('excerpt')?.length || 0}/300</p>
                        {form.formState.errors.excerpt && <p className="text-sm text-destructive">{form.formState.errors.excerpt.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label>Content (Markdown)</Label>
                            <div className="flex items-center gap-1 rounded-lg border p-1 bg-muted">
                                <button type="button" onClick={() => setActiveTab('edit')} className={`px-2 py-0.5 text-xs rounded-md transition-all ${activeTab === 'edit' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>
                                    Write
                                </button>
                                <button type="button" onClick={() => setActiveTab('preview')} className={`px-2 py-0.5 text-xs rounded-md transition-all ${activeTab === 'preview' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>
                                    Preview
                                </button>
                            </div>
                        </div>

                        {activeTab === 'edit' ? (
                            <div className="rounded-md border bg-background">
                                <EditorToolbar onInsert={handleEditorInsert} />
                                <Textarea
                                    {...form.register('content_markdown')}
                                    id="content_markdown"
                                    // Fixed height and scrollable
                                    className="h-[600px] font-mono border-0 focus-visible:ring-0 rounded-t-none resize-none overflow-y-auto"
                                    placeholder="# Hello World"
                                />
                            </div>
                        ) : (
                            // Fixed height and scrollable preview
                            <div className="h-[600px] overflow-y-auto rounded-md border p-4 prose prose-sm dark:prose-invert max-w-none bg-card">
                                <ReactMarkdown
                                    components={{
                                        // Optional: Map specific components if needed, or rely on prose
                                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-6 mb-4" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc pl-4" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-4" {...props} />,
                                    }}
                                >
                                    {contentMarkdown || '*No content yet*'}
                                </ReactMarkdown>
                            </div>
                        )}
                        {form.formState.errors.content_markdown && <p className="text-sm text-destructive">{form.formState.errors.content_markdown.message}</p>}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-lg border bg-card p-4 space-y-4">
                        <h3 className="font-semibold text-sm">Organization</h3>
                        <div className="grid gap-2">
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <Input {...form.register('tags')} id="tags" placeholder="ai, nextjs, tutorial" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="featured" {...form.register('featured')} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <Label htmlFor="featured" className="cursor-pointer">Featured Post</Label>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-4 space-y-4">
                        <h3 className="font-semibold text-sm">SEO Settings</h3>
                        <div className="grid gap-2">
                            <Label htmlFor="seo_title">Meta Title</Label>
                            <Input {...form.register('seo_title')} id="seo_title" placeholder="Same as title if empty" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="seo_description">Meta Description</Label>
                            <Textarea {...form.register('seo_description')} id="seo_description" placeholder="Same as excerpt if empty" className="h-20" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="canonical_url">Canonical URL</Label>
                            <Input {...form.register('canonical_url')} id="canonical_url" placeholder="https://..." />
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-4 space-y-4">
                        <h3 className="font-semibold text-sm">Media</h3>
                        <div className="grid gap-4">
                            <Label>Cover Image</Label>

                            {form.watch('cover_image') ? (
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                                    <Image
                                        src={form.watch('cover_image')!}
                                        alt="Cover preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="absolute top-2 right-2 h-8 w-8 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        onClick={() => form.setValue('cover_image', null, { shouldDirty: true })}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <CldUploadWidget
                                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                    onSuccess={handleCoverUpload}
                                    options={{
                                        sources: ['local', 'url', 'unsplash'],
                                        multiple: false,
                                        clientAllowedFormats: ['image'],
                                        maxImageFileSize: 4000000,
                                    }}
                                >
                                    {({ open }) => (
                                        <div
                                            onClick={() => open()}
                                            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center hover:bg-muted/50 cursor-pointer transition-colors"
                                        >
                                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                            <div className="text-xs text-muted-foreground">Click to upload cover image</div>
                                        </div>
                                    )}
                                </CldUploadWidget>
                            )}
                            <Input {...form.register('cover_image')} className="hidden" />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
