
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, FileText, Settings } from 'lucide-react'

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
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
]

export function AdminMobileNav() {
    const pathname = usePathname()

    return (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden z-50">
            <nav className="flex justify-around items-center h-16">
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
                            pathname === item.href ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="text-[10px] font-medium">{item.title}</span>
                    </Link>
                ))}
            </nav>
        </div>
    )
}
