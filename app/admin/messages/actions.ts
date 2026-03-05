'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ContactMessageStatus = 'unread' | 'read' | 'replied' | 'archived'

export async function getMessages(status?: string, search?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return data || []
}

export async function getMessage(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching message:', error)
    return null
  }

  return data
}

export async function updateMessageStatus(id: string, status: ContactMessageStatus) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('contact_messages')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error updating message status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/messages')
  revalidatePath(`/admin/messages/${id}`)

  return { success: true }
}

export async function getUnreadCount() {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'unread')

  return { unread: count || 0 }
}
