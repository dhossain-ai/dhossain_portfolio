
import { z } from 'zod'

export const postSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with dashes'),
    excerpt: z.string().min(1, 'Excerpt is required').max(300, 'Excerpt must be less than 300 characters'),
    content_markdown: z.string().min(1, 'Content is required'),
    cover_image: z.string().optional().nullable(),
    tags: z.string().optional(), // We'll handle comma-separated string in form -> array in submit
    status: z.enum(['draft', 'published']),
    type: z.enum(['blog', 'journal']).default('blog'),
    seo_title: z.string().optional().nullable(),
    seo_description: z.string().optional().nullable(),
    canonical_url: z.string().url().optional().or(z.literal('')).nullable(),
    featured: z.boolean().default(false),
})

export type PostFormValues = z.infer<typeof postSchema>
