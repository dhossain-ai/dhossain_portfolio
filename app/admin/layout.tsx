
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    robots: {
        index: false,
        follow: false,
    },
}

import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminMobileNav } from '@/components/admin/mobile-nav'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        redirect('/')
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-muted/40">
            <AdminSidebar />
            <main className="flex-1 md:ml-64 p-4 md:p-8 mb-16 md:mb-0 overflow-y-auto min-h-screen">
                {children}
            </main>
            <AdminMobileNav />
        </div>
    )
}
