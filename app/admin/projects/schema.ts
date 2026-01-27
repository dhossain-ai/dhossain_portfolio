
import { z } from 'zod'

export const projectSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    year: z.number().int().min(2010).max(2100),
    summary: z.string().min(10, 'Summary must be at least 10 characters').max(300, 'Summary must be less than 300 characters'),
    subtitle: z.string().optional(),
    overview: z.string().min(10, 'Overview is required'),

    status_public: z.enum(['draft', 'published']),
    badge: z.string().optional(),
    featured: z.boolean().default(false),

    role: z.string().optional(),
    project_type: z.string().optional(),

    platforms: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),

    live_url: z.string().url().optional().or(z.literal('')),
    code_url: z.string().url().optional().or(z.literal('')),
    android_url: z.string().url().optional().or(z.literal('')),
    ios_url: z.string().url().optional().or(z.literal('')),

    key_features: z.array(z.string()).default([]),
    challenges: z.array(z.string()).default([]),
    contributions: z.array(z.string()).default([]),

    cover_image: z.string().nullable().optional(),
    gallery_images: z.array(z.string()).default([]),

    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    canonical_url: z.string().optional(),
})

export type ProjectFormValues = z.infer<typeof projectSchema>
