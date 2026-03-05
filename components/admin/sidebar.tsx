
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, FileText, Settings, LogOut, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signout } from '@/app/admin/actions'

const navItems = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'Messages',
        href: '/admin/messages',
        icon: MessageCircle,
    },
    {
        title: 'Posts',
        href: '/admin/posts',
        icon: FileText,
    },
    {
        title: 'Journal',
        href: '/admin/journal',
        icon: FileText,
    },
    {
        title: 'Projects',
        href: '/admin/projects',
        icon: FileText,
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="hidden border-r bg-muted/40 md:flex md:w-64 lg:w-72 md:flex-col md:fixed md:inset-y-0">
            <div className="flex flex-col gap-2 p-4 lg:p-6 flex-1">
                <div className="flex h-12 lg:h-14 items-center border-b px-2 lg:px-4 mb-2 lg:mb-4">
                    <Link href="/" className="flex items-center gap-2 font-semibold text-sm lg:text-base">
                        <span className="">Shahadat / Admin</span>
                    </Link>
                </div>
                <nav className="grid items-start gap-1 lg:gap-2 text-sm font-medium">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 lg:gap-3 rounded-lg px-2 lg:px-3 py-2 transition-all hover:text-primary text-sm",
                                pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{item.title}</span>
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-4 lg:p-6 border-t">
                <form action={signout}>
                    <Button variant="outline" className="w-full justify-start gap-2 lg:gap-3 text-sm" size="sm">
                        <LogOut className="h-4 w-4" />
                        <span className="hidden lg:inline">Sign Out</span>
                        <span className="lg:hidden">Out</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}
