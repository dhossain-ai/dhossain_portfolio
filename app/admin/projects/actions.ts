
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { ProjectFormValues } from './schema'

export async function createProject(data: ProjectFormValues) {
    console.log('[CreateProject] Starting with data:', JSON.stringify(data, null, 2))

    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        console.error('[CreateProject] Auth Error:', authError)
        throw new Error('Unauthorized: No user found')
    }
    console.log('[CreateProject] User ID:', user.id)

    // Check Profile/Role (RLS Debug)
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    console.log('[CreateProject] User Profile Role:', profile?.role)

    if (profile?.role !== 'admin') {
        console.warn('[CreateProject] User is NOT admin. Insert will likely fail due to RLS.')
    }

    // Clean data (map undefined string urls to null if needed, but schema handles optional)
    // Zod schema optional() -> undefined. DB usually takes null for optional text.
    // Supabase JS handles undefined as "don't update / default", but for Insert we might want explicit nulls?
    // Actually undefined is fine, it just won't insert the column, which is NULL default.

    const payload = {
        ...data,
        // Explicitly set updated_at/created_at if needed, but triggers handle it
        published_at: data.status_public === 'published' ? new Date().toISOString() : null
    }
    console.log('[CreateProject] Final Payload:', payload)

    const { data: project, error } = await supabase
        .from('projects')
        .insert(payload)
        .select('*')
        .single()

    if (error) {
        console.error('[CreateProject] DB Insert Error:', error)
        console.error('[CreateProject] Error Message:', error.message)
        console.error('[CreateProject] Error Details:', error.details)
        console.error('[CreateProject] Error Hint:', error.hint)
        throw new Error(error.message || 'Failed to create project')
    }

    console.log('[CreateProject] Success! Project ID:', project.id)
    redirect(`/admin/projects/${project.id}`)
}

export async function updateProject(id: string, data: ProjectFormValues) {
    console.log('[UpdateProject] Starting for ID:', id)
    console.log('[UpdateProject] Data:', JSON.stringify(data, null, 2))

    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Logic for published_at:
    // If switching to published, set date only if not already set? Or always update?
    // Let's just update it if status is published.
    // If it was already published, maybe we keep original date? 
    // Ideally we fetch first to check, but let's keep it simple: Update published_at only if status becomes published.

    const payload = {
        ...data,
        published_at: data.status_public === 'published' ? new Date().toISOString() : null // Simplest logic: reset date on publish. Real CMS might preserve original date.
    }

    const { error } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single()

    if (error) {
        console.error('[UpdateProject] DB Error:', error)
        throw new Error(error.message || 'Failed to update project')
    }

    console.log('[UpdateProject] Success')
    revalidatePath('/admin/projects')
    revalidatePath(`/admin/projects/${id}`)
    revalidatePath('/projects')
}

export async function deleteProject(projectId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

    if (error) {
        throw new Error('Failed to delete project')
    }

    revalidatePath('/admin/projects')
    revalidatePath('/projects')
}
