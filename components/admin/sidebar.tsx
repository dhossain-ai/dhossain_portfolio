
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, FileText, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signout } from '@/app/admin/actions'

const navItems = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
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
        <div className="hidden border-r bg-muted/40 md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
            <div className="flex flex-col gap-2 p-6 flex-1">
                <div className="flex h-14 items-center border-b px-2 lg:h-[60px] lg:px-4 mb-4">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <span className="">Shahadat / Admin</span>
                    </Link>
                </div>
                <nav className="grid items-start gap-2 text-sm font-medium">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-6 border-t">
                <form action={signout}>
                    <Button variant="outline" className="w-full justify-start gap-3" size="sm">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </form>
            </div>
        </div>
    )
}
