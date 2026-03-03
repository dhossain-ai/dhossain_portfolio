
'use client'

import { useEffect, useState, useRef, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, type ProjectFormValues } from './schema'
import { createProject, updateProject } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, ImageIcon, X } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { ArrayInput } from '@/components/ui/array-input'
import { Switch } from '@/components/ui/switch'
import { EditorActions, EditorHeader } from '@/components/admin/editor'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable'
import { SortableGalleryItem } from './sortable-gallery-item'

// Type definition for existing project from DB (loose type to match DB return)
type ProjectData = {
    id?: string
    title?: string
    slug?: string
    year?: number
    summary?: string
    subtitle?: string | null
    overview?: string
    status_public?: 'draft' | 'published'
    badge?: string | null
    featured?: boolean
    role?: string | null
    project_type?: string | null
    platforms?: string[]
    stack?: string[]
    tags?: string[]
    live_url?: string | null
    code_url?: string | null
    android_url?: string | null
    ios_url?: string | null
    key_features?: string[]
    challenges?: string[]
    contributions?: string[]
    cover_image?: string | null
    gallery_images?: string[]
    seo_title?: string | null
    seo_description?: string | null
    canonical_url?: string | null
}

type ProjectFormProps = {
    project?: ProjectData // Optional for new projects
}

export function ProjectForm({ project }: ProjectFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const isEditing = !!project?.id

    const [saveState, setSaveState] = useState<'idle' | 'unsaved' | 'saving' | 'saved' | 'failed'>('idle')
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [initialLoad, setInitialLoad] = useState(true)

    const form = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: project?.title || '',
            slug: project?.slug || '',
            year: project?.year || new Date().getFullYear(),
            summary: project?.summary || '',
            subtitle: project?.subtitle || '',
            overview: project?.overview || '',

            status_public: project?.status_public || 'draft',
            badge: project?.badge || '',
            featured: project?.featured ?? false,

            role: project?.role || '',
            project_type: project?.project_type || '',

            platforms: project?.platforms || [],
            stack: project?.stack || [],
            tags: project?.tags || [],

            live_url: project?.live_url || '',
            code_url: project?.code_url || '',
            android_url: project?.android_url || '',
            ios_url: project?.ios_url || '',

            key_features: project?.key_features || [],
            challenges: project?.challenges || [],
            contributions: project?.contributions || [],

            cover_image: project?.cover_image || null,
            gallery_images: project?.gallery_images || [],

            seo_title: project?.seo_title || '',
            seo_description: project?.seo_description || '',
            canonical_url: project?.canonical_url || '',
        },
    })

    const onSubmit = (values: ProjectFormValues) => {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        startTransition(async () => {
            try {
                if (isEditing && project?.id) {
                    setSaveState('saving')
                    await updateProject(project.id, values)
                    setSaveState('saved')
                    toast.success('Project updated')
                } else {
                    await createProject(values)
                    toast.success('Project created')
                }
                router.refresh()
            } catch (error) {
                console.error(error)
                setSaveState('failed')
                toast.error('Failed to save project')
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
                const data = form.getValues() as ProjectFormValues
                await updateProject(project!.id!, data)
                setSaveState('saved')
            } catch (error) {
                console.error('Autosave error', error)
                setSaveState('failed')
            }
        }, 1500)

        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        }
    }, [watchedValues, isEditing, initialLoad, project])

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCoverUpload = (result: any) => {
        if (result.info?.secure_url) {
            form.setValue('cover_image', result.info.secure_url, { shouldDirty: true })
        }
    }

    const handleExternalPreview = () => {
        if (!project?.id) {
            toast.error("Please save the draft first to preview")
            return
        }
        window.open(`/preview/project/${project.id}`, '_blank')
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (active.id !== over?.id) {
            const current = form.getValues('gallery_images') || []
            const oldIndex = current.indexOf(active.id as string)
            const newIndex = current.indexOf(over?.id as string)

            if (oldIndex !== -1 && newIndex !== -1) {
                form.setValue('gallery_images', arrayMove(current, oldIndex, newIndex), { shouldDirty: true })
            }
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-20">
            <EditorHeader
                title={project?.title || 'New Project'}
                isEditing={isEditing}
                saveState={saveState}
                status={form.watch('status_public') === 'published' ? 'published' : 'draft'}
                backHref="/admin/projects"
                actions={
                    <EditorActions
                        isEditing={isEditing}
                        isPending={isPending}
                        saveState={saveState}
                        status={form.watch('status_public') === 'published' ? 'published' : 'draft'}
                        previewUrl={project?.id ? `/preview/project/${project.id}` : null}
                        onPreview={handleExternalPreview}
                        onPublish={() => {
                            form.setValue('status_public', 'published', { shouldDirty: true })
                            form.handleSubmit(onSubmit)()
                        }}
                        onUpdate={() => form.handleSubmit(onSubmit)()}
                        onCreateDraft={() => form.handleSubmit(onSubmit)()}
                    />
                }
            />

            <div className="grid gap-6 md:gap-8 md:grid-cols-[2fr_1fr]">
                {/* Main Content Column */}
                <div className="space-y-8">
                    {/* Basic Info */}
                    <div className="rounded-lg border bg-card p-6 space-y-6">
                        <h3 className="font-semibold border-b pb-2">Core Info</h3>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input {...form.register('title')} id="title" placeholder="Project Name" />
                                {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="subtitle">Subtitle (Tagline)</Label>
                                <Input {...form.register('subtitle')} id="subtitle" placeholder="Short tagline shown under title" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="slug">Slug</Label>
                                        <Button type="button" variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground" onClick={handleSlugGenerate}>
                                            Auto-generate
                                        </Button>
                                    </div>
                                    <Input {...form.register('slug')} id="slug" placeholder="project-slug" />
                                    {form.formState.errors.slug && <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="year">Year</Label>
                                    <Input type="number" {...form.register('year', { valueAsNumber: true })} id="year" />
                                    {form.formState.errors.year && <p className="text-sm text-destructive">{form.formState.errors.year.message}</p>}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="summary">Summary</Label>
                                <Textarea {...form.register('summary')} id="summary" placeholder="Brief summary for cards (max 300 chars)" maxLength={300} className="h-24" />
                                <p className="text-xs text-muted-foreground text-right">{form.watch('summary')?.length || 0}/300</p>
                                {form.formState.errors.summary && <p className="text-sm text-destructive">{form.formState.errors.summary.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="overview">Overview</Label>
                                <Textarea {...form.register('overview')} id="overview" placeholder="Detailed overview paragraph" className="h-40" />
                                {form.formState.errors.overview && <p className="text-sm text-destructive">{form.formState.errors.overview.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Content Arrays */}
                    <div className="rounded-lg border bg-card p-6 space-y-6">
                        <h3 className="font-semibold border-b pb-2">Details & Lists</h3>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label>Key Features</Label>
                                <ArrayInput
                                    value={form.watch('key_features') || []}
                                    onChange={(val) => form.setValue('key_features', val, { shouldDirty: true })}
                                    placeholder="Add a feature..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Challenges & Learnings</Label>
                                <ArrayInput
                                    value={form.watch('challenges') || []}
                                    onChange={(val) => form.setValue('challenges', val, { shouldDirty: true })}
                                    placeholder="Add a challenge..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Contributions / What I Did</Label>
                                <ArrayInput
                                    value={form.watch('contributions') || []}
                                    onChange={(val) => form.setValue('contributions', val, { shouldDirty: true })}
                                    placeholder="Add a contribution..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    {/* Meta Card */}
                    <div className="rounded-lg border bg-card p-6 space-y-4">
                        <h3 className="font-semibold text-sm border-b pb-2">Metadata</h3>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Input {...form.register('role')} id="role" placeholder="e.g. Solo Developer" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="project_type">Type</Label>
                            <Input {...form.register('project_type')} id="project_type" placeholder="e.g. Web + Mobile" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="badge">Badge</Label>
                            <Input {...form.register('badge')} id="badge" placeholder="e.g. Beta, Live, v1.0" />
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <Switch
                                id="featured"
                                checked={form.watch('featured')}
                                onCheckedChange={(val) => form.setValue('featured', val)}
                            />
                            <Label htmlFor="featured" className="cursor-pointer">Featured Project</Label>
                        </div>
                    </div>

                    {/* Tech & Links */}
                    <div className="rounded-lg border bg-card p-6 space-y-4">
                        <h3 className="font-semibold text-sm border-b pb-2">Tech & Links</h3>

                        <div className="grid gap-2">
                            <Label>Platforms</Label>
                            {/* Simple checkboxes for platforms or array input? User asked for checkboxes (Web, Android, iOS) */}
                            {/* We'll use ArrayInput logic but pre-defined toggles might be better. Let's stick to ArrayInput for flexibility or custom UI?
                                User specified: "Web, Android, iOS" checkboxes in plan. let's implement toggles.
                            */}
                            <div className="flex gap-4">
                                {['Web', 'Android', 'iOS'].map(platform => (
                                    <div key={platform} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`platform-${platform}`}
                                            checked={(form.watch('platforms') || []).includes(platform)}
                                            onChange={(e) => {
                                                const current = form.getValues('platforms') || [];
                                                if (e.target.checked) {
                                                    form.setValue('platforms', [...current, platform], { shouldDirty: true })
                                                } else {
                                                    form.setValue('platforms', current.filter(p => p !== platform), { shouldDirty: true })
                                                }
                                            }}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <Label htmlFor={`platform-${platform}`}>{platform}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Tech Stack</Label>
                            <ArrayInput
                                value={form.watch('stack') || []}
                                onChange={(val) => form.setValue('stack', val, { shouldDirty: true })}
                                placeholder="Add tech (Next.js, etc)..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Tags (SEO/Filter)</Label>
                            <ArrayInput
                                value={form.watch('tags') || []}
                                onChange={(val) => form.setValue('tags', val, { shouldDirty: true })}
                                placeholder="Add tag..."
                            />
                        </div>

                        <div className="border-t pt-4 grid gap-2">
                            <Label>Links</Label>
                            <Input {...form.register('live_url')} placeholder="Live URL" className="text-xs" />
                            <Input {...form.register('code_url')} placeholder="Code / GitHub URL" className="text-xs" />
                            <Input {...form.register('android_url')} placeholder="Play Store URL" className="text-xs" />
                            <Input {...form.register('ios_url')} placeholder="App Store URL" className="text-xs" />
                        </div>
                    </div>

                    {/* Media */}
                    <div className="rounded-lg border bg-card p-6 space-y-4">
                        <h3 className="font-semibold text-sm border-b pb-2">Media</h3>

                        <div className="grid gap-2">
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
                                        size="icon"
                                        className="absolute top-2 right-2 h-8 w-8 bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
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
                                            <div className="text-xs text-muted-foreground">Upload Cover</div>
                                        </div>
                                    )}
                                </CldUploadWidget>
                            )}
                        </div>

                        <div className="grid gap-2 pt-4 border-t">
                            <Label>Gallery Images</Label>

                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={form.watch('gallery_images') || []}
                                    strategy={rectSortingStrategy}
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        {(form.watch('gallery_images') || []).map((img) => (
                                            <SortableGalleryItem
                                                key={img}
                                                id={img}
                                                url={img}
                                                onRemove={(urlToRemove) => {
                                                    const current = form.getValues('gallery_images') || []
                                                    form.setValue('gallery_images', current.filter(u => u !== urlToRemove), { shouldDirty: true })
                                                }}
                                            />
                                        ))}

                                        <CldUploadWidget
                                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            onSuccess={(result: any) => {
                                                if (result.info?.secure_url) {
                                                    const current = form.getValues('gallery_images') || []
                                                    form.setValue('gallery_images', [...current, result.info.secure_url], { shouldDirty: true })
                                                }
                                            }}
                                            options={{
                                                sources: ['local', 'url', 'unsplash'],
                                                multiple: true,
                                                clientAllowedFormats: ['image'],
                                                maxImageFileSize: 4000000,
                                            }}
                                        >
                                            {({ open }) => (
                                                <div
                                                    onClick={() => open()}
                                                    className="flex aspect-video items-center justify-center gap-2 rounded-lg border border-dashed hover:bg-muted/50 cursor-pointer transition-colors"
                                                >
                                                    <div className="text-center">
                                                        <ImageIcon className="mx-auto h-6 w-6 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground mt-1 block">Add Image</span>
                                                    </div>
                                                </div>
                                            )}
                                        </CldUploadWidget>
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
