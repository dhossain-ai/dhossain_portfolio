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
}

export function EditorHeader({
    title,
    isEditing,
    saveState,
    status,
    backHref,
    children,
}: EditorHeaderProps) {
    return (
        <div className="flex items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b">
            <div className="flex items-center gap-4">
                <Link href={backHref}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">{title}</h2>
                        {isEditing && <SaveStateIndicator state={saveState} />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <StatusBadge status={status} />
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
