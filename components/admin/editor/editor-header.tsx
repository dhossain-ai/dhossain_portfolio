'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SaveStateIndicator, type SaveState } from './save-state-indicator'
import { StatusBadge } from './status-badge'

interface EditorHeaderProps {
    title: string
    isEditing: boolean
    saveState: SaveState
    status: 'draft' | 'published'
    backHref: string
    children?: React.ReactNode
    actions?: React.ReactNode
}

export function EditorHeader({
    title,
    isEditing,
    saveState,
    status,
    backHref,
    children,
    actions,
}: EditorHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-10 bg-background/95 backdrop-blur py-3 sm:py-4 border-b">
            <div className="flex items-center gap-3 sm:gap-4">
                <Link href={backHref}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <h2 className="text-base sm:text-lg font-semibold truncate max-w-[150px] sm:max-w-none">{title}</h2>
                        {isEditing && <SaveStateIndicator state={saveState} />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <StatusBadge status={status} />
                        {children}
                    </div>
                </div>
            </div>
            {actions && <div className="flex justify-end sm:ml-4">{actions}</div>}
        </div>
    )
}
